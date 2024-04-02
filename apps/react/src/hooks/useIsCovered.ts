import { useMemo } from "react";
import { EPILOG_COMMON_DATASET } from "../consts/dataset.const";
import { EPILOG_RULESET } from "../consts/ruleset.const";

export default function useIsCovered(
  claimId: string,
  formDataset: ReturnType<typeof definemorefacts>,
) {
  const query = useMemo(() => read(`covered(${claimId})`), [claimId]);

  const mergedDataset = useMemo(
    () => definemorefacts(formDataset, EPILOG_COMMON_DATASET),
    [formDataset],
  );

  console.log("query", query);
  console.log("formDataset", formDataset);
  console.log("mergedDataset", mergedDataset);

  const result = useMemo(
    () => debugfinds(query, query, mergedDataset, EPILOG_RULESET) as string[][],
    [query, mergedDataset],
  );

  console.log("result", result);

  const isCovered = result.length > 0;

  return isCovered;
}
