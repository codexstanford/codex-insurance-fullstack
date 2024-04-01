const PRESERVED_USER_DATASET_KEY = "preservedUserDataset";

export const setPreservedUserDataset = (
  dataset: ReturnType<typeof definemorefacts>,
) => {
  localStorage.setItem(PRESERVED_USER_DATASET_KEY, JSON.stringify(dataset));
};

export const getPreservedUserDataset = () => {
  const dataset = localStorage.getItem(PRESERVED_USER_DATASET_KEY);
  if (dataset) {
    return JSON.parse(dataset) as ReturnType<typeof definemorefacts>;
  }
  return null;
};
