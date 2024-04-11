import { and, db, eq, inArray } from "db";
import { Profile } from "passport";
import { profiles, users } from "schema";

function mapProviderProfileToAppProfile(provider: string, providerProfile: Profile) {
  // TODO Currently, we just use the first email and photo. Might want to ask the user in the future which shall be used.
  const [firstEmail] = providerProfile.emails || [];
  const [firstPhoto] = providerProfile.photos || [];

  return {
    provider,
    idAtProvider: providerProfile.id,

    displayName: providerProfile.displayName,
    givenName: providerProfile.name?.givenName,
    middleName: providerProfile.name?.middleName,
    familyName: providerProfile.name?.familyName,

    email: firstEmail?.value,

    photoUrl: firstPhoto?.value,
  };
}

export default async function getOrCreateSSOUser(
  provider: string,
  providerProfile: Profile,
) {
  const profile = await db.query.profiles.findFirst({
    where: and(
      eq(profiles.provider, provider),
      eq(profiles.idAtProvider, providerProfile.id),
    ),
    with: { user: true },
  });

  // Profile exists
  if (profile) {
    return profile.user;
  }

  // Profile doesn't exist yet

  // Let's check if an existing user is logging in with a new provider

  const providerProfileEmails = providerProfile.emails || [];

  // TODO Test this
  if (providerProfileEmails.length) {
    const user = await db.query.users.findFirst({
      where: inArray(
        users.email,
        providerProfileEmails.map((e) => e.value),
      ),
    });

    // User already exists, add new profile and return user
    if (user) {
      await db.insert(profiles).values({
        ...mapProviderProfileToAppProfile(provider, providerProfile),
        userId: user.id,
      });

      return user;
    }
  }

  // User definitely doesn't exist yet, create a new user and profile

  const partialProfile = mapProviderProfileToAppProfile(provider, providerProfile);

  const TOUR_EPILOG_DATASET = `
  policy(policy0)
  claim(claim0)
  person.dob(person0,06_04_1996)
  person.occupation(person0,other)
  person.immunocompromised(person0,no)
  policy.type(policy0,cardinal)
  policy.insuree(policy0,person0)
  policy.startdate(policy0,person0,01_08_2023)
  policy.enddate(policy0,person0,30_06_2024)
  claim.policy(claim0,policy0)
  claim.service_type(claim0, "covidVaccine")
  claim.claimant(claim0,person0)
  claim.time(claim0,11_04_2024,00_00)
  claim.hosp_start_time(claim0,03_09_2023,00_00)
  claim.hosp_end_time(claim0,03_09_2023,01_13)
  claim.hospital(claim0,stanford_medical_center)
  claim.reason(claim0,preventive_care)
  claim.vaccine(claim0,covid)
  claim.vaccine_brand(claim0,pfizer)
  claim.vaccine_dose_count(claim0,1)
  claim.consequence_of_occupation(claim0,no)
  claim.location(claim0,facility)
  claim.previous_vaccines_pfizer(claim0,0)
  claim.previous_vaccines_moderna(claim0,0)
  claim.previous_vaccines_other(claim0,1)`;

  let initialDataset = "";

  if (provider === "dummy") {
    initialDataset = TOUR_EPILOG_DATASET;
  }

  const [user] = await db
    .insert(users)
    .values({
      ...partialProfile,
      epilogDataset: initialDataset,
    })
    .returning();

  if (!user) {
    throw new Error("User creation failed");
  }

  await db.insert(profiles).values({
    ...partialProfile,
    userId: user.id,
  });

  return user;
}
