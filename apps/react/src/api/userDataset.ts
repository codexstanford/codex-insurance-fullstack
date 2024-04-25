import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROUTES, UserDataset } from "common";
import { useMemo } from "react";
import toast from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/*                                    HTTP                                    */
/* -------------------------------------------------------------------------- */

export const fetchUserDataset = async (
  userId: number,
): Promise<ReturnType<typeof definemorefacts>> => {
  const response = await fetch(`${ROUTES.API_USER_DATASET}/${userId}`);

  const { epilogDataset } = (await response.json()) as UserDataset;

  const dataset = definemorefacts([], readdata(epilogDataset || ""));

  console.log("Fetched userDataset", epilogDataset);

  return dataset;
};

export const postUserDataset = async (
  userId: number,
  epilogDataset: ReturnType<typeof definemorefacts>,
): Promise<any> => {
  const response = await fetch(`${ROUTES.API_USER_DATASET}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ epilogDataset: grindem(zniquify(epilogDataset)) }),
  });
  return await response.json();
};

/* -------------------------------------------------------------------------- */
/*                                 React Query                                */
/* -------------------------------------------------------------------------- */

export const useUserDataset = (userId: number) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ["userDataset", userId], [userId]);

  const query = useQuery({
    queryKey,
    queryFn: () => fetchUserDataset(userId),
    enabled: userId !== -1,
  });

  const mutation = useMutation({
    mutationKey: ["userDataset", userId],
    mutationFn: (epilogDataset: ReturnType<typeof definemorefacts>) =>
      toast.promise(postUserDataset(userId, epilogDataset), {
        loading: "Saving...",
        success: "Saved!",
        error: "Could not save",
      }),
    onSuccess: () => {
      console.log("Invalidating query", queryKey);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const returnValue = useMemo(
    () => ({
      query,
      mutation,
      userDataset: query.data,
    }),
    [query, query.data, mutation],
  );

  return returnValue;
};
