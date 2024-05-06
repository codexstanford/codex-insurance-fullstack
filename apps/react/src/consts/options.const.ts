import { BasicOption } from "../types/basicOption";
import { compfindsReturnToBasicOptions } from "../utils/epilogUtils";
import { EPILOG_COMMON_DATASET } from "./dataset.const";

// http://logicprogramming.stanford.edu/epilog/documentation/epilogjs/compfinds.php

export const LOCATIONS = (() => {
  const query = read("valid_location.name_string(X, Y)");

  const locationNames = compfinds(query, query, EPILOG_COMMON_DATASET, []);

  return compfindsReturnToBasicOptions(locationNames);
})();

export const CONTRACEPTIVE_OPTIONS = (() => {
  const query = read("fda_approved.name_string(X, Y)");

  const contraceptiveNames = compfinds(query, query, EPILOG_COMMON_DATASET, []);

  return compfindsReturnToBasicOptions(contraceptiveNames);
})();

export const YES_OR_NO = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
] satisfies BasicOption[];


export const VACCINE_OPTIONS: BasicOption[] = [
    { id: 'moderna', label: 'Moderna' },
    { id: 'pfizer', label: 'Pfizer' },
    { id: 'other', label: 'Other' }
  ];
  
  export const VACCINE_HISTORY_OPTIONS: BasicOption[] = [
    { id: 'moderna', label: 'Moderna' },
    { id: 'pfizer', label: 'Pfizer' },
    { id: 'other', label: 'Other' },
    { id: 'new_formulation', label: 'Since September 11, 2023' }
  ];

  