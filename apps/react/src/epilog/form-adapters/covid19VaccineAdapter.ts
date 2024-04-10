import { DateTime } from "luxon";
import { LOCATIONS, YES_OR_NO } from "../../consts/options.const";
import { BasicOption } from "../../types/basicOption";
import {
  dateToString,
  getFirstOrNextId,
  getNextId,
  getPolicyOfClaim,
  stringToDate,
  timeOfDateToString,
} from "../../utils/epilogUtils";
import { FormAdapter } from "./_formAdapter";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type FormValues = {
  person: BasicOption;
  isPersonImmunocompromised: BasicOption | null;
  dob: Date | null;

  policy: BasicOption;
  policyType: BasicOption | null;

  claim: BasicOption;
  vaccinationHistory_vaccineTypes: BasicOption[];
  vaccineBrand: BasicOption | null;
  when: Date | null;
  where: BasicOption | null;
};

/* -------------------------------------------------------------------------- */
/*                              NOT HERE TO STAY                              */
/* -------------------------------------------------------------------------- */

/** @deprecated Should be fetched from Epilog common dataset in the future */
export const VACCINE_OPTIONS = [
  { id: "moderna", label: "Moderna" },
  { id: "pfizer", label: "Pfizer" },
  { id: "other", label: "Other" },
] as const;

/** @deprecated Should be fetched from Epilog common dataset in the future */
export const POLICY_TYPE_OPTIONS = [
  { id: "cardinal", label: "Cardinal Care" },
  { id: "kaiser", label: "Kaiser HMO" },
] as const;

/* -------------------------------------------------------------------------- */
/*                                   Adapter                                  */
/* -------------------------------------------------------------------------- */

export const formAdapter: FormAdapter<FormValues> = {
  epilogToFormValues: (epilogDataset, claimId) => {
    if (claimId) {
      // Check if the claimId exists in the dataset
      const claimExists =
        (
          compfinds(
            "X",
            read(`claim(${claimId})`),
            epilogDataset,
            [],
          ) as string[]
        ).length > 0;

      if (!claimExists) {
        console.debug("Claim ID not found in dataset, generating new ID");
        claimId = undefined;
      }
    }

    if (!claimId) claimId = getNextId("claim", epilogDataset);

    /* --------------------------------- Person --------------------------------- */

    let [personId] = compfinds(
      "X",
      read(`claim.claimant(${claimId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    //TODO Currently, only the first person that is found is used. Add form field so that the user can choose the person.

    if (!personId) personId = getFirstOrNextId("person", epilogDataset);

    let [dobString] = compfinds(
      "X",
      read(`person.dob(${personId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    const dob = dobString
      ? stringToDate(dobString)
      : null;

    let [isPersonImmunocompromised] = compfinds(
      "X",
      read(`person.immunocompromised(${personId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    /* --------------------------------- Policy --------------------------------- */

    let policyId = getPolicyOfClaim(claimId, epilogDataset);

    //TODO Currently, only the first policy that is found is used. Add form field so that the user can choose the policy.

    if (!policyId) policyId = getFirstOrNextId("policy", epilogDataset);

    // TODO Add policyType, currently will always default to cardinal

    /* ---------------------------------- Claim --------------------------------- */

    const getCount = (vaccine: "pfizer" | "moderna" | "other") =>
      parseInt(
        (
          compfinds(
            "X",
            read(`claim.previous_vaccines_${vaccine}(${claimId}, X)`),
            epilogDataset,
            [],
          ) as string[]
        )?.[0] || "0",
      );

    const getNOfVaccineTypeOption = (
      vaccine: "pfizer" | "moderna" | "other",
      n: number,
    ) => {
      const types: BasicOption[] = [];
      for (let i = 0; i < n; i++) {
        types.push(
          VACCINE_OPTIONS.find((v) => v.id === vaccine) as BasicOption,
        );
      }
      return types;
    };

    const previous_vaccines_pfizerCount = getCount("pfizer");
    const previous_vaccines_modernaCount = getCount("moderna");
    const previous_vaccines_otherCount = getCount("other");

    const vaccinationHistory_vaccineTypes = [
      ...getNOfVaccineTypeOption("pfizer", previous_vaccines_pfizerCount),
      ...getNOfVaccineTypeOption("moderna", previous_vaccines_modernaCount),
      ...getNOfVaccineTypeOption("other", previous_vaccines_otherCount),
    ];

    const [vaccineBrand] = compfinds(
      "X",
      read(`claim.vaccine_brand(${claimId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    const [dateTimeResult] = compfinds(
      read("time(Date, Time)"),
      read(`claim.time(${claimId}, Date, Time)`),
      epilogDataset,
      [],
    ) as [string, string, string][];

    const when = dateTimeResult?.length === 3
      ? stringToDate(dateTimeResult[1], dateTimeResult[2])
      : null;

    const [location] = compfinds(
      "X",
      read(`claim.location(${claimId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    const formValues = {
      person: { id: personId, label: personId },
      dob,
      isPersonImmunocompromised:
        YES_OR_NO.find((v) => v.id === isPersonImmunocompromised) || null,

      policy: { id: policyId, label: policyId },
      policyType: { id: "cardinal", label: "Cardinal" },

      claim: { id: claimId, label: claimId },
      vaccinationHistory_vaccineTypes,
      vaccineBrand: VACCINE_OPTIONS.find((v) => v.id === vaccineBrand) || null,
      when,
      where: LOCATIONS.find((v) => v.id === location) || null,
    } satisfies FormValues;

    // console.log("Form values:", formValues);

    return formValues;
  },
  formValuesToEpilog: (values) => {
    /* --------------------------------- Person --------------------------------- */

    const personId = values.person.id;
    const dob = dateToString(values.dob);
    const isPersonImmunocompromised =
      values.isPersonImmunocompromised?.id || "nil";

    /* --------------------------------- Policy --------------------------------- */

    const policyId = values.policy.id;
    const policyType = values.policyType?.id || "nil";

    /* ---------------------------------- Claim --------------------------------- */

    const claimId = values.claim.id;

    const getCount = (
      typesArray: BasicOption[],
      vaccine: "pfizer" | "moderna" | "other",
    ) => typesArray.filter((v) => v.id === vaccine).length;

    const vaccinationHistory_vaccineTypes_pfizer = getCount(
      values.vaccinationHistory_vaccineTypes,
      "pfizer",
    );

    const vaccinationHistory_vaccineTypes_moderna = getCount(
      values.vaccinationHistory_vaccineTypes,
      "moderna",
    );
    const vaccinationHistory_vaccineTypes_other = getCount(
      values.vaccinationHistory_vaccineTypes,
      "other",
    );

    const vaccineBrand = values.vaccineBrand?.id || "nil";

    const whenDate = values.when;
    const whenDateStr = dateToString(whenDate);
    const whenTimeStr = timeOfDateToString(whenDate);

    const location = values.where?.id || "nil";

    const epilogString = `
    person(${personId})
    policy(${policyId})
    claim(${claimId})

    person.dob(${personId}, ${dob})
    person.occupation(${personId}, other)
    person.immunocompromised(${personId}, ${isPersonImmunocompromised})

    policy.type(${policyId}, ${policyType})
    policy.insuree(${policyId}, ${personId})
    policy.startdate(${policyId}, ${personId}, 01_08_2023)
    policy.enddate(${policyId}, ${personId}, 30_06_2024)

    claim.policy(${claimId}, ${policyId})
    claim.claimant(${claimId}, ${personId})
    claim.time(${claimId}, ${whenDateStr}, ${whenTimeStr})
    claim.hosp_start_time(${claimId}, 03_09_2023, 00_00)
    claim.hosp_end_time(${claimId}, 03_09_2023, 01_13)
    claim.hospital(${claimId}, stanford_medical_center)
    claim.reason(${claimId}, preventive_care)
    claim.vaccine(${claimId}, covid)
    claim.vaccine_brand(${claimId}, ${vaccineBrand})
    claim.vaccine_dose_count(${claimId}, 2)
    claim.consequence_of_occupation(${claimId}, no)
    claim.location(${claimId}, ${location})
    claim.previous_vaccines_pfizer(${claimId}, ${vaccinationHistory_vaccineTypes_pfizer})
    claim.previous_vaccines_moderna(${claimId}, ${vaccinationHistory_vaccineTypes_moderna})
    claim.previous_vaccines_other(${claimId}, ${vaccinationHistory_vaccineTypes_other})
    `;

    const formDataset = definemorefacts([], readdata(epilogString));

    // console.debug("Generated Epilog string:", epilogString);
    // console.debug("Generated Epilog dataset:", formDataset.length);

    return formDataset;
  },
} as const;
