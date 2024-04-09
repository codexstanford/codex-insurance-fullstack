import { BasicOption } from "../types/basicOption";

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
