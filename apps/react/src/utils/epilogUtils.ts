import { BasicOption } from "../types/basicOption";
import { Person } from '../types/Person';
import { Claim } from '../types/Claim';


/* -------------------------------------------------------------------------- */
/*                                    Const                                   */
/* -------------------------------------------------------------------------- */

const PERSON_ID_PREFIX = "person" as const;
const POLICY_ID_PREFIX = "policy" as const;
const CLAIM_ID_PREFIX = "claim" as const;

export type ID_PREFIX =
  | typeof PERSON_ID_PREFIX
  | typeof POLICY_ID_PREFIX
  | typeof CLAIM_ID_PREFIX;

/* -------------------------------------------------------------------------- */
/*                                    Read                                    */
/* -------------------------------------------------------------------------- */

export const removeEscapedDoubleQoutes = (str: string) => str.replace(/"/g, "");

export const compfindsReturnToBasicOptions = (
  compfindsReturn: ReturnType<typeof compfinds>,
): BasicOption[] =>
  compfindsReturn
    .map((entry) => {
      if (typeof entry === "string") return { id: entry, label: entry };

      if (Array.isArray(entry)) {
        const [, id, label] = entry;

        if (!id || !label)
          throw new Error(
            "compfindsReturnToBasicOptions expects at least binary predicates. Got instead: " +
              JSON.stringify(entry),
          );

        if (entry.length > 3)
          console.warn(
            "compfindsReturnToBasicOptions expects at most binary predicates. Will use the first two symbols as id and label. Got instead: " +
              JSON.stringify(entry),
          );

        return { id, label: removeEscapedDoubleQoutes(label) };
      }

      throw new Error(
        "compfindsReturnToBasicOptions doesn't support compfinds return type: " +
          JSON.stringify(entry),
      );
    })
    .sort((a, b) => a.label.localeCompare(b.label));

/**
 * @param dateString has to follow the format dd_MM_yyyy
 * @param timeString has to follow the format hh_mm
 * */
export const stringToDate = (dateString: string, timeString?: string) => {
  const [day, month, year] = dateString.split("_").map(Number);

  if (!day || !month || !year)
    throw new Error(
      `stringToDate expects a string in the format dd_MM_yyyy. Got instead: ${dateString}`,
    );

  if (!timeString) return new Date(year, month - 1, day);

  const [hours, minutes] = timeString.split("_").map(Number);

  if (!hours || !minutes)
    throw new Error(
      `stringToDate expects a string in the format hh_mm. Got instead: ${timeString}`,
    );

  return new Date(year, month - 1, day, hours, minutes);
};

/* ---------------------------------- Claim --------------------------------- */

export const getPolicyOfClaim = (
  claimId: string,
  userDataset: ReturnType<typeof definemorefacts>,
) => {
  const [policyId] = compfinds(
    "X",
    read(`claim.policy(${claimId}, X)`),
    userDataset,
    [],
  ) as string[];

  return policyId;
};

export const getReasonOfClaim = (
  claimId: string,
  userDataset: ReturnType<typeof definemorefacts>,
) => {
  const [reason] = compfinds(
    "X",
    read(`claim.reason(${claimId}, X)`),
    userDataset,
    [],
  ) as string[];

  return reason;
};


export const getClaimDetailsById = (claimId: string, dataset: ReturnType<typeof definemorefacts>): Claim | undefined => {
    // Initialize an object to hold the claim's details
    let claimDetails: Partial<Claim> = {
      id: claimId,
    };
  
    // Filter dataset for entries related to the claim
    dataset.forEach(entry => {
      if (entry[1] === claimId) {
        switch (entry[0]) {
          case 'claim.policy':
            claimDetails.policyId = entry[2];
            break;
          case 'claim.claimant':
            claimDetails.claimantId = entry[2];
            break;
          case 'claim.time':
            claimDetails.time = `${entry[2]} ${entry[3]}`;
            break;
          case 'claim.hosp_start_time':
            claimDetails.hospitalStart = `${entry[2]} ${entry[3]}`;
            break;
          case 'claim.hosp_end_time':
            claimDetails.hospitalEnd = `${entry[2]} ${entry[3]}`;
            break;
          case 'claim.hospital':
            claimDetails.hospitalName = entry[2];
            break;
          case 'claim.reason':
            claimDetails.reason = entry[2];
            break;
          case 'claim.vaccine':
            claimDetails.vaccine = entry[2];
            break;
          case 'claim.vaccine_brand':
            claimDetails.vaccineBrand = entry[2];
            break;
          case 'claim.vaccine_dose_count':
            claimDetails.vaccineDoseCount = parseInt(entry[2], 10);
            break;
          case 'claim.consequence_of_occupation':
            claimDetails.consequenceOfOccupation = entry[2];
            break;
          case 'claim.location':
            claimDetails.location = entry[2];
            break;
          case 'claim.previous_vaccines_pfizer':
            claimDetails.previousVaccinesPfizer = parseInt(entry[2], 10);
            break;
          case 'claim.previous_vaccines_moderna':
            claimDetails.previousVaccinesModerna = parseInt(entry[2], 10);
            break;
          case 'claim.previous_vaccines_other':
            claimDetails.previousVaccinesOther = parseInt(entry[2], 10);
            break;
          // Add cases for any other claim-related entries
        }
      }
    });
  
    // Check if the required fields are present
    if (!claimDetails.policyId || !claimDetails.claimantId) {
      // If critical information is missing, consider this claim as undefined
      return undefined;
    }
  
    // Return the aggregated details as a full Claim object
    return claimDetails as Claim;
  };

/* --------------------------------- Policy --------------------------------- */

export const getTypeOfPolicy = (
  policyId: string,
  userDataset: ReturnType<typeof definemorefacts>,
) => {
  const [policyType] = compfinds(
    "X",
    read(`policy.type(${policyId}, X)`),
    userDataset,
    [],
  ) as string[];

  return policyType;
};

/* -------------------------------------------------------------------------- */
/*                                    Write                                   */
/* -------------------------------------------------------------------------- */

export const dateToString = (date: Date) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as const;

  const formattedDate = (date) => {
    if (date === null) {
      return ""; // Or any other fallback value appropriate for your application
    }
    dateString = date.toLocaleDateString("de-DE", options);
    return dateString.split(".").join("_");
  };

  return formattedDate;
};

export const timeOfDateToString = (date: Date) => {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  } as const;

  const formattedTime = (date) => {
    if (date === null) {
      return ""; // Or any other fallback value appropriate for your application
    }
    timeString = date.toLocaleTimeString("de-DE", options);
    return timeString.replace(":", "_");
  };

  return formattedTime;
};

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

/* ----------------------------------- Id ----------------------------------- */

/** @returns eg "person0" */
export const composeId = (idPrefix: ID_PREFIX, index: number) =>
  idPrefix + index;

/** @returns eg ["person0"] */
export const getExistingIds = (
  idPrefix: ID_PREFIX,
  userDataset: ReturnType<typeof definemorefacts> = [],
) => {
  const X = "X";
  const query = read(`${idPrefix}(${X})`);
  const existingIds = compfinds(X, query, userDataset, []) as string[];
  return existingIds.sort();
};

/** @returns eg "person0" */
export const getNextId = (
  idPrefix: ID_PREFIX,
  userDataset: ReturnType<typeof definemorefacts> = [],
) => {
  const existingIds = getExistingIds(idPrefix, userDataset);

  let nextIndex = 0;

  while (existingIds.includes(composeId(idPrefix, nextIndex))) nextIndex++;

  return composeId(idPrefix, nextIndex);
};

/** @returns eg "person0" */
export const getFirstOrNextId = (
  idPrefix: ID_PREFIX,
  userDataset: ReturnType<typeof definemorefacts> = [],
) => {
  const [firstId] = getExistingIds(idPrefix, userDataset);

  if (firstId) return firstId;

  return getNextId(idPrefix, userDataset);
};

/* --------------------------------- Person --------------------------------- */


export const getPersonDetailsById = (userId, dataset) => {
    // Initialize an object to hold the person's details
    let personDetails = {
      id: userId,
      dob: '',
      occupation: '',
      immunocompromised: ''
    };
  
    // Filter dataset for entries related to the person
    dataset.forEach(entry => {
      if (entry[1] === userId) {
        switch (entry[0]) {
          case 'person.dob':
            personDetails.dob = entry[2];
            break;
          case 'person.occupation':
            personDetails.occupation = entry[2];
            break;
          case 'person.immunocompromised':
            personDetails.immunocompromised = entry[2] === 'yes' ? true : false;
            break;
          // Add cases for any other person-related entries
        }
      }
    });
  
    // Return the aggregated details
    return personDetails.dob ? personDetails : undefined;
  };