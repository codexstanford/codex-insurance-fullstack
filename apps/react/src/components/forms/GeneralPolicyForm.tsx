import React, { useMemo, useCallback, Fragment } from 'react';
import { useForm, Controller, ControllerRenderProps, useFieldArray } from 'react-hook-form';
import InputDate from '../InputDate';
import InputSelectButtons from '../InputSelectButtons';
import GeneralFormAdapter from '../../epilog/form-adapters/generalFormAdapter';
import EpilogFormContainer from '../../components/EpilogFormContainer';
import useIsCovered from '../../hooks/useIsCovered';
import Constraint from '../../components/Constraint';
import ConstraintContainer from '../../components/ConstraintContainer';
import { configs, FormFieldConfig } from '../../epilog/form-adapters/formConfigs';  
import { MinusIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../utils/classNames";


interface GeneralPolicyFormProps {
    policyType: string;
    defaultValues: any; // Define a more specific interface if possible
    onClickSave: (data: string) => void;
  }
  
  const GeneralPolicyForm: React.FC<GeneralPolicyFormProps> = ({
    policyType,
    defaultValues,
    onClickSave,
  }) => {
    const safeDefaultValues = defaultValues || {};
    const adapter = useMemo(() => new GeneralFormAdapter(policyType, defaultValues), [policyType, defaultValues]);
    const formConfig = configs[policyType];
    if (!formConfig) {
      throw new Error(`No form configuration found for policy type: ${policyType}`);
    }
  
    const { control, handleSubmit, getValues, watch } = useForm({
        defaultValues: adapter.epilogToFormValues(), 
    });

    const formFields = useMemo(() => formConfig.fields, [formConfig]);

    const fieldArrays = formFields.filter(field => field.type === 'array').reduce((acc, field) => {
        acc[field.id] = useFieldArray({
            control,
            name: field.id
        });
        return acc;
    }, {});
  
    const onClickSaveCallback = useCallback(() => {
        const formData = getValues();
        onClickSave(formData); // Pass the whole form data object instead of just epilogString
      }, [getValues, onClickSave]);
    
    
    
  
    const allInputsEntered = useMemo(() => {
      const formValues = getValues();
      return formFields.every(field => formValues[field.id] !== null && formValues[field.id] !== undefined);
    }, [watch(), formFields, getValues]);
  
    const { dataset } = useMemo(() => adapter.formValuesToEpilog(getValues()), [watch()]);
    const isCovered = useIsCovered(defaultValues.claim.id + "", dataset); 
  
    return (
        <EpilogFormContainer
            title={`${policyType} Form`}
            onSave={handleSubmit(onClickSaveCallback)}
            isCovered={allInputsEntered ? isCovered : undefined}
        >
            <ConstraintContainer>
                {formFields.map((field) => {
                    if (field.type === 'array' && fieldArrays[field.id]) {
                        return (
                            <Constraint key={field.id} label={field.label}>
                                {field.additionalText && <p>{field.additionalText}</p>}
                                {fieldArrays[field.id].fields.map((fieldEntry, index) => (
                                    <Controller
                                        key={fieldEntry.id}
                                        name={`${field.id}.${index}`}
                                        control={control}
                                        render={({ field: controlField }) => (
                                            <div className="flex items-center">
                                                <InputSelectButtons {...controlField} options={field.options || []} />
                                                <button
                                                    type="button"
                                                    onClick={() => fieldArrays[field.id].remove(index)}
                                                    className="ml-2 p-1 border rounded"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fieldArrays[field.id].append({ value: '' })}
                                    className="mt-2 p-1 border rounded"
                                >
                                    Add Entry
                                </button>
                            </Constraint>
                        );
                    } else {
                        return (
                            <Constraint key={field.id} label={field.label}>
                                <Controller
                                    name={field.id}
                                    control={control}
                                    render={({ field: controlField }) => renderField(controlField, field) || <Fragment />}
                                />
                            </Constraint>
                        );
                    }
                })}
            </ConstraintContainer>
        </EpilogFormContainer>
    );
  };
  
  function renderField(field: ControllerRenderProps<any, string>, config: FormFieldConfig) {
    switch (config.type) {
      case 'date':
        return <InputDate {...field} />;
      case 'select':
        return <InputSelectButtons {...field} options={config.options || []} />;
      case 'text':
        return <input type="text" {...field} />;
      case 'checkbox':
        return <input type="checkbox" {...field} />;
      case 'number':
        return <input type="number" {...field} />;
      default:
        return <Fragment />;
    }
  }
  
  export default GeneralPolicyForm;