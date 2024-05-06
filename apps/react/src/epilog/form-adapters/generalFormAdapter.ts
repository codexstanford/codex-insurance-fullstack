import {
    dateToString,
    stringToDate,
    timeOfDateToString,
    getFirstOrNextId,
    getNextId,
    getPolicyOfClaim,
    getExistingIds,
} from "../../utils/epilogUtils";
import { configs, FormConfig } from "./formConfigs";

type Dataset = ReturnType<typeof definemorefacts>; 

interface BasicOption {
  id: string;
  label: string;
}

interface FormValues {
  person: BasicOption;
  policy: BasicOption;
  claim: BasicOption;
  [key: string]: any; 
}


class GeneralFormAdapter {
  private policyType: string;
  private dataset: Dataset;
  private claimId: string;
  private personId: string;
  private policyId: string;

  constructor(policyType: string, dataset: Dataset, claimId?: string, forceNewClaimId: boolean = false) {
    console.log(`Constructor called with claimId: ${claimId} and forceNewClaimId: ${forceNewClaimId}`);
    this.policyType = policyType;
    console.log("initial dataset", grindem(dataset));
    console.log("typeof dataset", typeof dataset);
    this.dataset = dataset; // Assume dataset is properly formatted as an object of arrays

    if (claimId && !forceNewClaimId) {
        this.claimId = claimId;
    } else {
        console.log("datasetArray before getnextId", grindem(dataset));
        console.log("existing ids check", getExistingIds("claim", dataset));
        this.claimId = getNextId("claim", dataset);
        console.log("claim Id after getnextId", this.claimId);
    }
    console.log("Initialized Claim ID:", this.claimId);
    this.personId = this.findOrAssignPersonId(dataset);
    this.policyId = getPolicyOfClaim(this.claimId, dataset) || getFirstOrNextId("policy", dataset);
}


  private findOrAssignPersonId(datasetArray: string[][]): string {
    return getFirstOrNextId("person", datasetArray);
  }

  public refreshClaimId(): void {
    const datasetArray: string[][] = Object.entries(this.dataset).map(([key, value]) => 
        [key, value ? value.toString() : '']);
    this.claimId = getNextId("claim", datasetArray); // Force new claim ID
}

public epilogToFormValues(dataset?: Dataset): FormValues {
    this.dataset = dataset || this.dataset;
    const datasetArray = this.dataset;

    // Refresh claim ID each time form values are initialized
    this.claimId = getNextId("claim", datasetArray);

    const formConfig: FormConfig | undefined = configs[this.policyType];
    if (!formConfig) {
      throw new Error(`Form configuration not found for policy type '${this.policyType}'`);
    }

    const fields = formConfig.fields;
    let formValues: FormValues = {
      person: { id: this.personId, label: this.personId },
      policy: { id: this.policyId, label: this.policyId },
      claim: { id: this.claimId, label: this.claimId }
    };

    fields.forEach(field => {
      let value = this.dataset[field.mapping] || field.defaultValue;
      if (field.type === 'date' && typeof value === 'string') {
        value = stringToDate(value);
      }
      formValues[field.id] = value;
    });

    console.log("Form Values on Initialization with New Claim ID:", formValues);
    return formValues;
}


  public formValuesToEpilog(values: FormValues): { dataset: string[][], epilogString: string } {
    const formConfig: FormConfig | undefined = configs[this.policyType];
    if (!formConfig) {
      throw new Error(`Form configuration not found for policy type '${this.policyType}'`);
    }
    const fields = formConfig.fields;
    let epilogString = "";
  
    fields.forEach(field => {
      let value = values[field.id];
      if (field.type === 'date' && value instanceof Date) {
        value = dateToString(value); 
      } else if (field.type === 'date' && value) {
        value = timeOfDateToString(value);
      }
      if (value !== undefined) {
        epilogString += `${field.mapping}(${this.claimId}, ${value})\n`;
      }
    });
  
    epilogString += `person(${this.personId})\n`;
    epilogString += `policy(${this.policyId})\n`;
    epilogString += `claim(${this.claimId})\n`;
  
    // Generate the dataset for useIsCovered
    const dataset = definemorefacts([], readdata(epilogString));
  
    return { dataset, epilogString }; // return both the dataset and the plain string
  }  
}

export default GeneralFormAdapter;
