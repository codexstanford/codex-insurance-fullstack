export function removeFromDataset(
  id: string,
  dataset: ReturnType<typeof definemorefacts>,
) {
  return dataset.filter((fact) => !fact.includes(id));
}
