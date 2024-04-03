import { ROUTES } from "common";
import { useContext, useMemo } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ResourceList from "../components/ResourceList";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { ID_PREFIX, getExistingIds } from "../utils/epilogUtils";

export default function ResourceListPage({
  resourceType,
  heading,
  linkToListPage,
}: {
  resourceType: ID_PREFIX;
  heading: string;
  linkToListPage: string;
}) {
  const dataset = useContext(UserDatasetContext);

  if (!dataset) throw new Error("UserDatasetContext not found");

  const ids = useMemo(
    () => getExistingIds(resourceType, dataset),
    [resourceType, dataset],
  );

  const items = useMemo(() => ids.map((id) => ({ id, label: id })), [ids]);

  return (
    <Container
      makeBoxed="narrow"
      addVerticalPadding={true}
      makeGutter={true}
      className="gap-10"
    >
      <Heading level={1}>{heading}</Heading>
      <ResourceList
        items={items}
        linkToListPage={linkToListPage}
        linkToAddNew={linkToListPage + "/" + ROUTES.NEW_KEYOWRD}
        expanded={true}
      />
    </Container>
  );
}
