import { DateTime } from "luxon";
import { LOCATIONS, YES_OR_NO, CONTRACEPTIVE_OPTIONS } from "../../consts/options.const";
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

  policy: BasicOption;
  policyType: BasicOption | null;

  contraceptiveService : BasicOption | null;

  claim: BasicOption;
  when: Date | null;
  where: BasicOption | null;
};

/* -------------------------------------------------------------------------- */
/*                              NOT HERE TO STAY                              */
/* -------------------------------------------------------------------------- */

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
    console.log("epilogDataset in contraceptives adapter before getNextId", epilogDataset);

    if (!claimId) claimId = getNextId("claim", epilogDataset);
    console.log("nextId", claimId);


    /* --------------------------------- Person --------------------------------- */

    let [personId] = compfinds(
      "X",
      read(`claim.claimant(${claimId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    //TODO Currently, only the first person that is found is used. Add form field so that the user can choose the person.

    if (!personId) personId = getFirstOrNextId("person", epilogDataset);

    /* --------------------------------- Policy --------------------------------- */

    let policyId = getPolicyOfClaim(claimId, epilogDataset);

    //TODO Currently, only the first policy that is found is used. Add form field so that the user can choose the policy.

    if (!policyId) policyId = getFirstOrNextId("policy", epilogDataset);

    // TODO Add policyType, currently will always default to cardinal

    /* ---------------------------------- Claim --------------------------------- */

    const [dateTimeResult] = compfinds(
      read("time(Date, Time)"),
      read(`claim.time(${claimId}, Date, Time)`),
      epilogDataset,
      [],
    ) as [string, string, string][];

    const when = dateTimeResult?.length === 3 && dateTimeResult[1] !== "nil" && dateTimeResult[2] !== "nil"
      ? stringToDate(dateTimeResult[1], dateTimeResult[2])
      : null;

      const [contraceptiveServiceObjConst] = compfinds(
        "X",
        read(`claim.contraceptive_service(${claimId}, X)`),
        epilogDataset,
        [],
      ) as string[];

    const [location] = compfinds(
      "X",
      read(`claim.location(${claimId}, X)`),
      epilogDataset,
      [],
    ) as string[];

    const formValues = {
      person: { id: personId, label: personId },

      policy: { id: policyId, label: policyId },
      policyType: { id: "cardinal", label: "Cardinal" },

      contraceptiveService: CONTRACEPTIVE_OPTIONS.find((v) => v.id === contraceptiveServiceObjConst) || null,

      claim: { id: claimId, label: claimId },
      when,
      where: LOCATIONS.find((v) => v.id === location) || null,
    } satisfies FormValues;

    // console.log("Form values:", formValues);

    return formValues;
  },

  
  formValuesToEpilog: (values) => {
    console.log("values",values);
    /* --------------------------------- Person --------------------------------- */

    if (!values.person) {
        throw new Error('person data is missing in form values.');
    }    
    
    const personId = values.person.id;

    /* --------------------------------- Policy --------------------------------- */

    if (!values.policy) {
        throw new Error('policy data is missing in form values.');
    }    

    const policyId = values.policy.id;
    const policyType = values.policyType?.id || "nil";

    /* ---------------------------------- Claim --------------------------------- */

    if (!values.claim) {
        throw new Error('Claim data is missing in form values.');
    }    
    const claimId = values.claim.id;

    const whenDate = values.when;
    const whenDateStr = dateToString(whenDate);
    const whenTimeStr = timeOfDateToString(whenDate);

    const location = values.where?.id || "nil";

    const contraceptiveService = values.contraceptiveService?.id || "nil";

    const epilogString = `
    person(${personId})
    policy(${policyId})
    claim(${claimId})

    person.occupation(${personId}, other)

    policy.type(${policyId}, ${policyType})
    policy.insuree(${policyId}, ${personId})
    policy.startdate(${policyId}, ${personId}, 01_08_2023)
    policy.enddate(${policyId}, ${personId}, 30_06_2024)

    claim.policy(${claimId}, ${policyId})
    claim.service_type(${claimId}, "contraceptives")
    claim.contraceptive_service(${claimId}, ${contraceptiveService})
    claim.claimant(${claimId}, ${personId})
    claim.time(${claimId}, ${whenDateStr}, ${whenTimeStr})
    claim.hosp_start_time(${claimId}, ${whenDateStr}, ${whenTimeStr})
    claim.hosp_end_time(${claimId}, 03_09_2023, 01_13)
    claim.hospital(${claimId}, stanford_medical_center)
    claim.reason(${claimId}, female_contraceptives)
    claim.consequence_of_occupation(${claimId}, no)
    claim.location(${claimId}, ${location})
    `;

    const formDataset = definemorefacts([], readdata(epilogString));

    // console.debug("Generated Epilog string:", epilogString);
    // console.debug("Generated Epilog dataset:", formDataset.length);

    return formDataset;
  },
} as const;
