import { ROUTES } from "common";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Heading from "../components/Heading";
import Modal from "../components/Modal";
import ResourceList from "../components/ResourceList";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import useIdParam from "../hooks/useClaimIdParam";
import { ID_PREFIX, getExistingIds } from "../utils/epilogUtils";
import { NEW_KEYOWRD } from "common/src/routes";
import { LoginContext } from "../contexts/loginContext";
import { useUserDataset } from "../api/userDataset";
import { removeFromDataset } from "../utils/removeFromDataset";

export default function ResourceListPage({
  resourceType,
  heading,
  linkToListPage,
}: {
  resourceType: ID_PREFIX;
  heading: string;
  linkToListPage: string;
}) {
  /* -------------------------------------------------------------------------- */
  /*                                  Get items                                 */
  /* -------------------------------------------------------------------------- */
  const sessionUser = useContext(LoginContext);
  const dataset = useContext(UserDatasetContext);

  if (!sessionUser || !dataset)
    throw new Error("LoginContext or UserDatasetContext not found");

  const ids = useMemo(
    () => getExistingIds(resourceType, dataset),
    [resourceType, dataset],
  );

  const items = useMemo(() => ids.map((id) => ({ id, label: id })), [ids]);

  /* -------------------------------------------------------------------------- */
  /*                                Delete items                                */
  /* -------------------------------------------------------------------------- */

  const { mutation } = useUserDataset(sessionUser.id);

  const onClickRemoveClaim = useCallback(
    (claimId: string) => {
      const newDataset = removeFromDataset(claimId, dataset);
      mutation.mutate(newDataset);
    },
    [dataset, mutation],
  );

  /* -------------------------------------------------------------------------- */
  /*                                    Modal                                   */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();

  const idParam = useIdParam(resourceType);

  // We need to cache the last not undefined idParam because on close of the modal,
  // the user will get redirected to the list page, and the idParam will be undefined.
  // But during the transition animation, we still need to know the idParam
  // to keep the form in the modal rendered until the transition animation is over.

  const [lastIdParam, setLastIdParam] = useState<string | undefined>();

  useEffect(() => {
    if (idParam) setLastIdParam(idParam);
  }, [idParam, setLastIdParam]);

  const isModalOpen = !!idParam;

  const onModalClose = useCallback(
    () => navigate(linkToListPage),
    [navigate, linkToListPage],
  );

  // TODO Instead of just closing the modal, add save functionality
  const modalButtonInput = useMemo(
    () => ({ label: "Save", onClick: () => onModalClose() }),
    [onModalClose],
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
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
          onClickRemove={
            resourceType === "claim" ? onClickRemoveClaim : undefined
          }
        />
      </Container>
      <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
        title={
          lastIdParam === NEW_KEYOWRD
            ? `Create new ${resourceType}`
            : `Edit ${lastIdParam}`
        }
        button={modalButtonInput}
      >
        TODO: Add form here. The steps would be:
        <br />
        1. Create the HTML form as in
        src/components/forms/Covid19VaccineForm.tsx
        <br />
        2. Create a form adapter like in
        src/epilog/form-adapters/covid19VaccineAdapter.ts to handle epilog to
        HTML form value coversion and vice versa.
        <br />
        3. In modalButtonInput (in this file, above), add a onClick function
        that will save the form data. Because this page of the app will be only
        visible to logged in users, all you need to know can be found in
        src/pages/ClaimSingle.tsx, starting at line 61.
      </Modal>
    </>
  );
}
