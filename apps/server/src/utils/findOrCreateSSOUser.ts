import { and, db, eq, inArray } from "db";
import { Profile } from "passport";
import { profiles, users } from "schema";

export default async function getOrCreateSSOUser(
  provider: string,
  providerProfile: Profile,
) {
  const resultProfiles = await db
    .select()
    .from(profiles)
    .where(
      and(
        eq(profiles.provider, provider),
        eq(profiles.idAtProvider, providerProfile.id),
      ),
    );

  // Profile doesn't exist yet
  if (resultProfiles.length === 0) {
    // Let's check if an existing user is logging in with new provider
    const providerProfileEmails = providerProfile.emails || [];

    if (providerProfileEmails.length > 0) {
      const resultUser = await getFirstUserByEmail(
        providerProfileEmails.map((e) => e.value),
      );

      // Add profile to the user
      if (resultUser) {
        // TODO Add profile to the user
        return { id: resultUser.id, displayName: resultUser.displayName };
      }

      // User doesn't exist yet, create one
      return { id: 999, displayName: providerProfile.displayName };
    }
  }

  // Profile already exists
  return { id: 999, displayName: providerProfile.displayName };
}

async function getFirstUserByEmail(emailOrEmails: string | string[]) {
  const emails = Array.isArray(emailOrEmails) ? emailOrEmails : [emailOrEmails];

  const resultUsers = await db
    .select()
    .from(users)
    .where(inArray(users.email, emails));

  if (resultUsers.length > 1) {
    console.warn(
      `More than one user found for emails: ${emails.join(", ")}; user ids: ${resultUsers.map((u) => u.id).join(", ")}`,
    );
  }

  return resultUsers[0];
}
