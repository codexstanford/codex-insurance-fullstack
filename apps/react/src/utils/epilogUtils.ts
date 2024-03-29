import { BasicOption } from "../types/basicOption";

/* -------------------------------------------------------------------------- */
/*                                    Const                                   */
/* -------------------------------------------------------------------------- */

const PERSON_ID_PREFIX = "person" as const;
const POLICY_ID_PREFIX = "policy" as const;
const CLAIM_ID_PREFIX = "claim" as const;

type ID_PREFIX =
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

/* -------------------------------------------------------------------------- */
/*                                    Write                                   */
/* -------------------------------------------------------------------------- */

export const dateToString = (date: Date) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as const;

  const dateString = date.toLocaleDateString("de-DE", options);

  const formattedDate = dateString.split(".").join("_");

  return formattedDate;
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
  const existingIds = getExistingIds(idPrefix, userDataset);

  if (existingIds.length) return existingIds[0];

  return getNextId(idPrefix, userDataset);
};

/* --------------------------------- Person --------------------------------- */
