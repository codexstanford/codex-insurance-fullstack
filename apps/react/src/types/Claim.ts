export interface Claim {
    id: string;
    policyId: string;
    serviceType: string;
    claimantId: string;
    time: string;
    hospitalStart: string;
    hospitalEnd: string;
    hospitalName: string;
    reason: string;
    vaccine: string;
    vaccineBrand: string;
    vaccineDoseCount: number;
    consequenceOfOccupation: string;
    location: string;
    previousVaccinesPfizer: number;
    previousVaccinesModerna: number;
    previousVaccinesOther: number;
  }
  