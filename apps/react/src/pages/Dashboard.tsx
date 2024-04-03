import { useContext, useMemo } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ResourceList from "../components/ResourceList";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { getExistingIds } from "../utils/epilogUtils";
import { ROUTES } from "common";

export default function Dasboard() {
  const dataset = useContext(UserDatasetContext);

  if (!dataset) throw new Error("UserDatasetContext not found");

  const claimIds = useMemo(() => getExistingIds("claim", dataset), [dataset]);
  const policyIds = useMemo(() => getExistingIds("policy", dataset), [dataset]);
  const personIds = useMemo(() => getExistingIds("person", dataset), [dataset]);

  const claimItems = useMemo(
    () => claimIds.map((id) => ({ id, label: id })),
    [claimIds],
  );

  const policyItems = useMemo(
    () => policyIds.map((id) => ({ id, label: id })),
    [policyIds],
  );

  const personItems = useMemo(
    () => personIds.map((id) => ({ id, label: id })),
    [personIds],
  );

  return (
    <>
      <Container
        makeBoxed="narrow"
        addVerticalPadding={true}
        makeGutter={true}
        className="gap-10"
      >
        <Heading level={1}>Dashboard</Heading>
        <ResourceList
          heading="Claims"
          items={claimItems}
          linkToOverivew={ROUTES.CLAIM}
          linkAddNewTo={ROUTES.INDEX}
        />
        <ResourceList
          heading="Policies"
          items={policyItems}
          linkToOverivew={ROUTES.POLICY}
        />
        <ResourceList
          heading="People"
          items={personItems}
          linkToOverivew={ROUTES.PERSON}
        />
      </Container>
    </>
  );
}