import { useCallback, useContext, useMemo } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ResourceList from "../components/ResourceList";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { getExistingIds, getPersonDetailsById, getClaimDetailsById } from "../utils/epilogUtils";
import { ROUTES } from "common";
import { LoginContext } from "../contexts/loginContext";
import { useUserDataset } from "../api/userDataset";
import { removeFromDataset } from "../utils/removeFromDataset";

export default function Dashboard() {
  const sessionUser = useContext(LoginContext);
  const dataset = useContext(UserDatasetContext);
  // console.log("dataset", dataset);

  if (!sessionUser || !dataset)
    throw new Error("LoginContext or UserDatasetContext not found");

  const claimIds = useMemo(() => getExistingIds("claim", dataset), [dataset]);
  const policyIds = useMemo(() => getExistingIds("policy", dataset), [dataset]);
  const personIds = useMemo(() => getExistingIds("person", dataset), [dataset]);

  const policyItems = useMemo(
    () => policyIds.map((id) => ({ id, label: id })),
    [policyIds],
  );

  const personItems = useMemo(() => personIds.map((id) => {
    const details = getPersonDetailsById(id, dataset);
  
    // If details exist, structure them with separate fields
    if (details) {
      return {
        id: details.id, // Assuming you always have an ID
        label: details.id,
        dob: details.dob,
        occupation: details.occupation,
        immunocompromised: details.immunocompromised
      };
    } else {
      // Provide a fallback structure for missing details
      return {
        id: id,
        label: id,
        dob: 'Unknown',
        occupation: 'Unknown',
        immunocompromised: 'Unknown'
      };
    }
  }), [personIds, dataset]);

  const claimItems = useMemo(() => claimIds.map((id) => {
    let serviceTypeToLabel = (serviceType : string) : string | false => {
      let serviceTypeToLabelMap = new Map<string, string> ([
        ["contraceptives", "Contraceptives"],
        ["covidVaccine", "COVID-19 Vaccine"],
      ]);
  
      return serviceTypeToLabelMap.has(serviceType) ? serviceTypeToLabelMap.get(serviceType) as string : false;
      }

    const details = getClaimDetailsById(id, dataset); // Use getClaimDetailsById
    return details ? {
      id: details.id,
      label: serviceTypeToLabel(details.serviceType) || 'Unknown Service Type',
      policyId: details.policyId || 'Unknown Policy',
      claimantId: details.claimantId || 'Unknown Claimant',
      time: details.time || 'Unknown Time',
      hospitalStart: details.hospitalStart || 'Unknown Start Time',
      hospitalEnd: details.hospitalEnd || 'Unknown End Time',
      hospitalName: details.hospitalName || 'Unknown Hospital',
      vaccine: details.vaccine || 'Unknown Vaccine',
      vaccineBrand: details.vaccineBrand || 'Unknown Brand',
      vaccineDoseCount: details.vaccineDoseCount || 0,
      consequenceOfOccupation: details.consequenceOfOccupation || 'Unknown',
      location: details.location || 'Unknown Location',
      previousVaccinesPfizer: details.previousVaccinesPfizer || 0,
      previousVaccinesModerna: details.previousVaccinesModerna || 0,
      previousVaccinesOther: details.previousVaccinesOther || 0,
    } : {
      id,
      label: 'Missing Details',
      // Default values for missing claim details
    };
  }), [claimIds, dataset]);


  // console.log("claimItems", claimItems);
  // console.log("personItems", personItems);

  const { mutation } = useUserDataset(sessionUser.id);

  const onClickRemoveClaim = useCallback(
    (claimId: string) => {
      const newDataset = removeFromDataset(claimId, dataset);
      mutation.mutate(newDataset);
    },
    [dataset, mutation],
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
          linkToListPage={ROUTES.CLAIM}
          linkToAddNew={ROUTES.CLAIM_NEW}
          onClickRemove={onClickRemoveClaim}
        />
        {/*<ResourceList
          heading="Policies"
          items={policyItems}
          linkToListPage={ROUTES.POLICY}
          linkToAddNew={ROUTES.POLICY_NEW}
        />
        <ResourceList
          heading="People"
          items={personItems}
          linkToListPage={ROUTES.PERSON}
          linkToAddNew={ROUTES.PERSON_NEW}
  />*/}
      </Container>
    </>
  );
}
