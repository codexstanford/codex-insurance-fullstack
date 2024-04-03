import { ROUTES } from "common";
import { useContext, useMemo } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ResourceList from "../components/ResourceList";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { getExistingIds } from "../utils/epilogUtils";

export default function ClaimListPage() {
  const dataset = useContext(UserDatasetContext);

  if (!dataset) throw new Error("UserDatasetContext not found");

  const claimIds = useMemo(() => getExistingIds("claim", dataset), [dataset]);

  const claimItems = useMemo(
    () => claimIds.map((id) => ({ id, label: id })),
    [claimIds],
  );

  <ResourceList
    heading="Claims"
    items={claimItems}
    linkToOverivew={ROUTES.CLAIM}
    linkAddNewTo={ROUTES.INDEX}
    expanded={true}
  />;

  return (
    <Container
      makeBoxed="narrow"
      addVerticalPadding={true}
      makeGutter={true}
      className="gap-10"
    >
      <Heading level={1}>Claims</Heading>
      <ResourceList
        heading="Claims"
        items={claimItems}
        linkToOverivew={ROUTES.CLAIM}
        linkAddNewTo={ROUTES.INDEX}
        expanded={true}
      />
    </Container>
  );
}
