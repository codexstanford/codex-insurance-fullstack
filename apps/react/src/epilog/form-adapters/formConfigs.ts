import { CONTRACEPTIVE_OPTIONS, LOCATIONS, VACCINE_OPTIONS, VACCINE_HISTORY_OPTIONS } from "../../consts/options.const";

export interface FormFieldConfig {
    id: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'checkbox' | 'number' | 'array';
    options?: Array<{ label: string; value: any }>;
    defaultValue?: any;
    mapping: string;
    additionalText?: string;
}

  
  export interface FormConfig {
    fields: FormFieldConfig[];
  }

export const configs = {
    covidVaccine: {
        fields: [
            {
                id: 'dob',
                label: 'Date of Birth',
                type: 'date',
                mapping: 'person.dob',
            },
            {
                id: 'isPersonImmunocompromised',
                label: 'Are you immunocompromised?',
                type: 'select',
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                ],
                mapping: 'person.immunocompromised'
            },
            {
                id: 'vaccinationHistory_vaccineTypes',
                label: 'Vaccination History',
                type: 'array', 
                options: VACCINE_HISTORY_OPTIONS,
                mapping: 'claim.vaccination_history',
                additionalText: "Add an entry for each Covid vaccine you've received. If you received it before September 11, 2023, indicate its type. If it was the most recent formulation (i.e. received since September 11, 2023), indicate that instead."
            },
            {
                id: 'vaccineBrand',
                label: 'What brand of vaccine did you receive?',
                type: 'select',
                options: VACCINE_OPTIONS,
                mapping: 'claim.vaccine_brand'
            },
            {
                id: 'when',
                label: 'When was the vaccination performed?',
                type: 'date',
                mapping: 'claim.when'
            },
            {
                id: 'where',
                label: 'Where was the vaccine administered?',
                type: 'select',
                options: LOCATIONS,
                mapping: 'claim.where'
            }
        ]
    },
    contraceptives: {
        fields: [
            //{
            //    id: 'policyType',
            //    label: 'Policy Type',
            //    type: 'select',
            //    options: [
            //        { label: 'Cardinal Care', value: 'cardinal' },
            //        { label: 'Kaiser HMO', value: 'kaiser' }
            //    ],
            //    mapping: 'policy.type'
            //},
            {
                id: 'contraceptiveService',
                label: 'What contraceptive service did you have performed?',
                type: 'select',
                options: CONTRACEPTIVE_OPTIONS,
                mapping: 'claim.contraceptive_service'
            },
            {
                id: 'when',
                label: 'When was the service performed?',
                type: 'date',
                mapping: 'claim.time'
            },
            {
                id: 'where',
                label: 'Where was the service performed?',
                type: 'select',
                options: LOCATIONS.map(loc => ({ label: loc.label, value: loc.id })),
                mapping: 'claim.location'
            }
        ]
    }
} as { [key: string]: FormConfig };

export default configs;
