import { useMemo } from "react";
import { useParams } from "react-router-dom";
import z from "zod";

export default function useClaimIdParam() {
  const params = useParams();

  const claimId = useMemo(
    () =>
      z
        .string()
        .startsWith("claim")
        .refine((str) => {
          const claimIndex = str.split("claim")[1];
          return (
            typeof claimIndex !== "undefined" && !isNaN(Number(claimIndex))
          );
        })
        .optional()
        .catch(undefined)
        .parse(params.claimId),
    [params.claimId],
  );

  return claimId;
}
