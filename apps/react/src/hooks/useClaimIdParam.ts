import { useMemo } from "react";
import { useParams } from "react-router-dom";
import z from "zod";
import { ID_PREFIX } from "../utils/epilogUtils";
import { ROUTES_ID_PARAM_PLACEHOLDER } from "../consts/routes.const";
import { NEW_KEYOWRD } from "common/src/routes";

export default function useIdParam(idPrefix: ID_PREFIX) {
  const params = useParams();

  const id = useMemo(
    () =>
      z
        .string()
        .startsWith(idPrefix)
        .refine((str) => {
          const claimIndex = str.split(idPrefix)[1];
          return (
            typeof claimIndex !== "undefined" && !isNaN(Number(claimIndex))
          );
        })
        .optional()
        .catch(undefined)
        .parse(params[ROUTES_ID_PARAM_PLACEHOLDER]),
    [params[ROUTES_ID_PARAM_PLACEHOLDER]],
  );

  if (params[ROUTES_ID_PARAM_PLACEHOLDER] === NEW_KEYOWRD) return NEW_KEYOWRD;

  return id;
}
