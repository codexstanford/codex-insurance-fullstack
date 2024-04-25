/**
 * @deprecated Use instead: http://epilog.stanford.edu/documentation/epilogjs/eliminatefacts.php
 */
export function removeFromDataset(
  id: string,
  dataset: ReturnType<typeof definemorefacts>,
) {
  return dataset.filter((fact) => !fact.includes(id));
}
