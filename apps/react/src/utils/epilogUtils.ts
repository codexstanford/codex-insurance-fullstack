import { BasicOption } from "../types/basicOption";

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
