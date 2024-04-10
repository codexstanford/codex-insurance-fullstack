import React, { useState, useEffect } from 'react';

type FormState = {
    international: boolean;
    evacCoverage: string;
    evacCoverageWorkaround: boolean;
    repatriationCoverage: string;
    repatriationCoverageWorkaround: boolean;
    jVisaHolder: boolean;
    jVisaDeductible: string;
    jVisaDeductibleWorkaround: boolean;
    visaCopy: boolean;
    internationalTranslated: boolean;
    coverageStartDate: string;
    coverageEndDate: string;
    coversEntireAcademicYear: boolean;
    coversInpatientOutpatientMedicalSF: boolean;
    coversInpatientOutpatientMentalHealthSF: boolean;
    annualDeductibleLessThanOrEqualTo1000: boolean;
    specialEmployerPlanAnnualDeductible: boolean;
    annualOutOfPocketMaximumLessThanOrEqualTo9100: boolean;
    specialEmployerPlanAnnualOutOfPocketMaximum: boolean;
    providesEMBPPACA: boolean;
    covers100PercentPreventiveCarePPACA: boolean;
    exclusionsForPreExistingConditions: boolean;
    offersPrescriptionDrugCoverage: boolean;
    coverageForNonEmergencyAndEmergencyCare: boolean;
    lifetimeAggregateMaxBenefit: boolean;
  };

  const initialState: FormState = {
    international: false,
    evacCoverage: '',
    evacCoverageWorkaround: false,
    repatriationCoverage: '',
    repatriationCoverageWorkaround: false,
    jVisaHolder: false,
    jVisaDeductible: '',
    jVisaDeductibleWorkaround: false,
    visaCopy: false,
    internationalTranslated: false,
    coverageStartDate: '',
    coverageEndDate: '',
    coversEntireAcademicYear: false,
    coversInpatientOutpatientMedicalSF: false,
    coversInpatientOutpatientMentalHealthSF: false,
    annualDeductibleLessThanOrEqualTo1000: false,
    specialEmployerPlanAnnualDeductible: false,
    annualOutOfPocketMaximumLessThanOrEqualTo9100: false,
    specialEmployerPlanAnnualOutOfPocketMaximum: false,
    providesEMBPPACA: true, // Assuming true for US plans as mentioned
    covers100PercentPreventiveCarePPACA: true, // Assuming true for US plans as mentioned
    exclusionsForPreExistingConditions: false,
    offersPrescriptionDrugCoverage: false,
    coverageForNonEmergencyAndEmergencyCare: false,
    lifetimeAggregateMaxBenefit: false,
  };

type ButtonStatus = 'moreInfoRequired' | 'yes' | 'no';

const WaiveCardinalCare = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>('moreInfoRequired');

  console.log("buttonStatus", buttonStatus);

  // Handle input changes for various form elements
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parseInt(value) || 0,
      }));
    } else if (type === 'button') {
      // Toggle the boolean for workaround fields when 'Yes' or 'No' is clicked
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: !prevFormData[name],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };  

  // Example of a simple form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setButtonStatus('yes');
    } else {
      setButtonStatus('no');
    }
  };


  const handleYesNoClick = (field) => {
    handleChange({
      target: {
        name: field,
        value: formData[field] ? 'No' : 'Yes', // Toggle between 'Yes' and 'No'
        type: 'button',
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // A simple function to validate form data (adjust according to your validation rules)
  const validateForm = () => {
    // Start by checking if all required fields are filled
    const allFieldsFilled = Object.values(formData).every(field => {
      if (typeof field === 'boolean') return true; // checkboxes can be false
      return field !== ''; // text/date fields should not be empty
    });
  
    // Return false immediately if not all fields are filled
    if (!allFieldsFilled) return false;
  
    // Now, we apply the specific rules for coverage
    let covered = true;
  
    // Check for international student specific rules
    if (formData.international) {
      covered = covered &&
                formData.evacCoverageWorkaround &&
                formData.repatriationCoverageWorkaround &&
                formData.visaCopy &&
                formData.internationalTranslated &&
                (formData.jVisaHolder ? formData.jVisaDeductibleWorkaround : true);
    }
  
    // Common requirements for all students
    const academicYearCovered = formData.coversEntireAcademicYear; // Simplification of date logic
    const sfBayCareCovered = formData.coversInpatientOutpatientMedicalSF && formData.coversInpatientOutpatientMentalHealthSF;
    const deductibleCovered = formData.annualDeductibleLessThanOrEqualTo1000 || formData.specialEmployerPlanAnnualDeductible;
    const oopCovered = formData.annualOutOfPocketMaximumLessThanOrEqualTo9100 || formData.specialEmployerPlanAnnualOutOfPocketMaximum;
    const conditionsCovered = !formData.exclusionsForPreExistingConditions;
  
    covered = covered &&
              academicYearCovered &&
              sfBayCareCovered &&
              deductibleCovered &&
              oopCovered &&
              formData.providesEMBPPACA &&
              formData.covers100PercentPreventiveCarePPACA &&
              conditionsCovered &&
              formData.offersPrescriptionDrugCoverage &&
              formData.coverageForNonEmergencyAndEmergencyCare &&
              formData.lifetimeAggregateMaxBenefit;
  
    return covered;
  };

  const allFieldsFilled = () => {
    return Object.values(formData).every(field => {
      if (typeof field === 'boolean') return true; // checkboxes can be false and still considered 'filled'
      return field !== ''; // ensure text fields are not empty
    });
  };

  useEffect(() => {
    if (!allFieldsFilled()) {
      setButtonStatus('moreInfoRequired');
    } else {
      // All fields are filled, now check if the form data meets the criteria
      const isCovered = validateForm();
      setButtonStatus(isCovered ? 'yes' : 'no');
    }
  }, [formData]);

  const formStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    alignItems: 'center',
    backgroundColor: buttonStatus === 'moreInfoRequired' ? '#cccccc' : buttonStatus === 'yes' ? '#4CAF50' : '#F44336', // Grey for more info, green for yes, red for no
  };

  const titleStyle = {
    fontSize: '32px', // Adjusted for a larger banner
    fontWeight: 'bold',
    flex: '1',
    marginLeft: '20px',
  };

  const infoButtonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '20px',
  };

  const labelStyle = {
    display: 'block',
    margin: '10px 0 20px',
    fontSize: '20px',
    fontWeight: 'normal',
  };


  const buttonStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '10px 15px',
    backgroundColor: '#000000', // Adjust to match the actual button color
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  };

  const inputContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: 'calc(50% - 10px)', // Subtract margin
    height: '40px',
    padding: '5px 10px',
    fontSize: '16px',
    borderColor: '#cccccc',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '4px',
  };

  return (
    <div>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Can I waive goodbye to Cardinal Care?</h1>
        <button style={infoButtonStyle}>
          {buttonStatus === 'moreInfoRequired' ? 'More Info Required' : buttonStatus}
        </button>
      </header>
    <form onSubmit={handleSubmit} style={formStyle}>
      <label style={labelStyle}>
        Are you an international student?
      <div style={inputContainerStyle}>
        <input
          type="button"
          value="Yes"
          onClick={() => setFormData({ ...formData, international: true })}
          style={{ ...inputStyle, backgroundColor: formData.international ? '#cccccc' : '#ffffff' }}
        />
        <input
          type="button"
          value="No"
          onClick={() => setFormData({ ...formData, international: false })}
          style={{ ...inputStyle, backgroundColor: !formData.international ? '#cccccc' : '#ffffff' }}
        />
      </div>
      </label>

      <div style={{ display: formData.international ? 'block' : 'none' }}>
        <strong>Additional Questions For International Students</strong>
        
        <div>
        <label style={labelStyle}>
          How much medical evacuation coverage to your home country do you have?
          <br />
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFF', border: '1px solid #CCC', borderRadius: '4px', padding: '5px 10px' }}>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>$</span>
            <input
                type="text"
                name="evacCoverage"
                value={formData.evacCoverage}
                onChange={handleChange}
                placeholder="Enter amount"
                style={{
                flexGrow: 1,
                border: '2px solid #DDD', // Slightly darker border for the input field
                outline: 'none',
                color: '#333',
                fontSize: '16px',
                padding: '5px', // Added padding for better text alignment
                borderRadius: '4px', // Matching border radius for consistency
                backgroundColor: 'transparent', // Ensure the input background matches the div background
                }}
            />
        </div>
        </label>
          <label style={labelStyle}>Do you have $50,000 emergency evacuation coverage to home country?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, evacCoverageWorkaround: true })}

            style={{ ...inputStyle, backgroundColor: formData.evacCoverageWorkaround ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, evacCoverageWorkaround: false })}
            style={{ ...inputStyle, backgroundColor: !formData.evacCoverageWorkaround ? '#cccccc' : '#ffffff' }}
            />
        </div>
        </label>
        </div>
        <div>
        <label style={labelStyle}>
        How much repatriation coverage to your home country do you have?:
        <br />
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFF', border: '1px solid #CCC', borderRadius: '4px', padding: '5px 10px' }}>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>$</span>
            <input
                type="text"
                name="repatriationCoverage"
                value={formData.repatriationCoverage}
                onChange={handleChange}
                placeholder="Enter amount"
                style={{
                flexGrow: 1,
                border: '2px solid #DDD', // Slightly darker border for the input field
                outline: 'none',
                color: '#333',
                fontSize: '16px',
                padding: '5px', // Added padding for better text alignment
                borderRadius: '4px', // Matching border radius for consistency
                backgroundColor: 'transparent', // Ensure the input background matches the div background
                }}
            />
        </div>
        </label>
        <label style={labelStyle}>
            Do you have $25,000 repatriation coverage to home country?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, repatriationCoverageWorkaround: true })}
            style={{ ...inputStyle, backgroundColor: formData.repatriationCoverageWorkaround ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, evacCoverageWorkaround: false })}
            style={{ ...inputStyle, backgroundColor: !formData.repatriationCoverageWorkaround ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>
        </div>
        
        <div>
        <label style={labelStyle}>
          Are you a J Visa holder?
        <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, jVisaHolder: true })}

            style={{ ...inputStyle, backgroundColor: formData.jVisaHolder ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, jVisaHolder: false })}
            style={{ ...inputStyle, backgroundColor: !formData.jVisaHolder ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>
            <div style={{ display: formData.jVisaHolder ? 'block' : 'none' }}>
            <label style={labelStyle}>
            If you are a J Visa holder, what is your insurance deductible?
            <br />
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFF', border: '1px solid #CCC', borderRadius: '4px', padding: '5px 10px' }}>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>$</span>
            <input
                type="text"
                name="jVisaDeductible"
                value={formData.jVisaDeductible}
                onChange={handleChange}
                placeholder="Enter amount"
                style={{
                flexGrow: 1,
                border: '2px solid #DDD', // Slightly darker border for the input field
                outline: 'none',
                color: '#333',
                fontSize: '16px',
                padding: '5px', // Added padding for better text alignment
                borderRadius: '4px', // Matching border radius for consistency
                backgroundColor: 'transparent', // Ensure the input background matches the div background
                }}
            />
            </div>
            </label>
            <label style={labelStyle}>
                Do you have an Insurance Deductible of $500 or less?
            <div style={inputContainerStyle}>
                <input
                type="button"
                value="Yes"
                onClick={() => setFormData({ ...formData, jVisaDeductibleWorkaround: true })}

                style={{ ...inputStyle, backgroundColor: formData.jVisaDeductibleWorkaround ? '#cccccc' : '#ffffff' }}
                />
                <input
                type="button"
                value="No"
                onClick={() => setFormData({ ...formData, jVisaDeductibleWorkaround: false })}
                style={{ ...inputStyle, backgroundColor: !formData.jVisaDeductibleWorkaround ? '#cccccc' : '#ffffff' }}
                />
                </div>
                </label>
            </div>
        </div>
        <div>
        <label style={labelStyle}>
        Can you submit a copy of your Visa?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, visaCopy: true })}

            style={{ ...inputStyle, backgroundColor: formData.visaCopy ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, visaCopy: false })}
            style={{ ...inputStyle, backgroundColor: !formData.visaCopy ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>
            <label style={labelStyle}>
            Can you submit a copy of all policy documents expressed in English, and under U.S. dollars?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, internationalTranslated: true })}

            style={{ ...inputStyle, backgroundColor: formData.internationalTranslated ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, internationalTranslated: false })}
            style={{ ...inputStyle, backgroundColor: !formData.internationalTranslated ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>
        </div>
      </div>
      <label style={labelStyle}>
        Coverage Start Date
        <div style={inputContainerStyle}>
            <input
            type="date"
            name="coverageStartDate"
            value={formData.coverageStartDate}
            onChange={handleChange}
            style={inputStyle}
            />
        </div>
        </label>

        <label style={labelStyle}>
        Coverage End Date
        <div style={inputContainerStyle}>
            <input
            type="date"
            name="coverageEndDate"
            value={formData.coverageEndDate}
            onChange={handleChange}
            style={inputStyle}
            />
        </div>
        </label>

        <label style={labelStyle}>
        Does it Cover the Entire Academic Year?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, coversEntireAcademicYear: true })}
            style={{ ...inputStyle, backgroundColor: formData.coversEntireAcademicYear ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, coversEntireAcademicYear: false })}
            style={{ ...inputStyle, backgroundColor: !formData.coversEntireAcademicYear ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
        Does it Cover Inpatient and Outpatient Medical Care in the San Francisco Bay Area?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, coversInpatientOutpatientMedicalSF: true })}
            style={{ ...inputStyle, backgroundColor: formData.coversInpatientOutpatientMedicalSF ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, coversInpatientOutpatientMedicalSF: false })}
            style={{ ...inputStyle, backgroundColor: !formData.coversInpatientOutpatientMedicalSF ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
        Does it Cover Inpatient and Outpatient Mental Health Care in the San Francisco Bay Area? 
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, coversInpatientOutpatientMentalHealthSF: true })}
            style={{ ...inputStyle, backgroundColor: formData.coversInpatientOutpatientMentalHealthSF ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, coversInpatientOutpatientMentalHealthSF: false })}
            style={{ ...inputStyle, backgroundColor: !formData.coversInpatientOutpatientMentalHealthSF ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Is your annual deductible $1000 USD or less?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, annualDeductibleLessThanOrEqualTo1000: true })}
            style={{ ...inputStyle, backgroundColor: formData.annualDeductibleLessThanOrEqualTo1000 ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, annualDeductibleLessThanOrEqualTo1000: false })}
            style={{ ...inputStyle, backgroundColor: !formData.annualDeductibleLessThanOrEqualTo1000 ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Do you have a special employer plan with an annual deductible above $1000?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, specialEmployerPlanAnnualDeductible: true })}
            style={{ ...inputStyle, backgroundColor: formData.specialEmployerPlanAnnualDeductible ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, specialEmployerPlanAnnualDeductible: false })}
            style={{ ...inputStyle, backgroundColor: !formData.specialEmployerPlanAnnualDeductible ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Is your annual out of pocket maximum $9100 USD or less?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, annualOutOfPocketMaximumLessThanOrEqualTo9100: true })}
            style={{ ...inputStyle, backgroundColor: formData.annualOutOfPocketMaximumLessThanOrEqualTo9100 ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, annualOutOfPocketMaximumLessThanOrEqualTo9100: false })}
            style={{ ...inputStyle, backgroundColor: !formData.annualOutOfPocketMaximumLessThanOrEqualTo9100 ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Do you have a special employer plan with an annual out of pocket maximum above $9100?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, specialEmployerPlanAnnualOutOfPocketMaximum: true })}
            style={{ ...inputStyle, backgroundColor: formData.specialEmployerPlanAnnualOutOfPocketMaximum ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, specialEmployerPlanAnnualOutOfPocketMaximum: false })}
            style={{ ...inputStyle, backgroundColor: !formData.specialEmployerPlanAnnualOutOfPocketMaximum ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Does it provide the Essential Minimum Benefits required by the Patient Protection and Affordable Care Act (PPACA) with no annual or lifetime maximums
          (Assume US-based policies do, for now.)
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, providesEMBPPACA: true })}
            style={{ ...inputStyle, backgroundColor: formData.providesEMBPPACA ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, providesEMBPPACA: false })}
            style={{ ...inputStyle, backgroundColor: !formData.providesEMBPPACA ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Does it cover 100% of Preventive Care as defined by the PPACA? 
          (Assume US-based policies do, for now.)
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, covers100PercentPreventiveCarePPACA: true })}
            style={{ ...inputStyle, backgroundColor: formData.covers100PercentPreventiveCarePPACA ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, covers100PercentPreventiveCarePPACA: false })}
            style={{ ...inputStyle, backgroundColor: !formData.covers100PercentPreventiveCarePPACA ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Does it contain ANY exclusions for pre-existing conditions?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, exclusionsForPreExistingConditions: true })}
            style={{ ...inputStyle, backgroundColor: formData.exclusionsForPreExistingConditions ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, exclusionsForPreExistingConditions: false })}
            style={{ ...inputStyle, backgroundColor: !formData.exclusionsForPreExistingConditions ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Does it offer Prescription Drug Coverage?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, offersPrescriptionDrugCoverage: true })}
            style={{ ...inputStyle, backgroundColor: formData.offersPrescriptionDrugCoverage ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, offersPrescriptionDrugCoverage: false })}
            style={{ ...inputStyle, backgroundColor: !formData.offersPrescriptionDrugCoverage ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Does it offer coverage for both non-emergency AND emergency care?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, coverageForNonEmergencyAndEmergencyCare: true })}
            style={{ ...inputStyle, backgroundColor: formData.coverageForNonEmergencyAndEmergencyCare ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, coverageForNonEmergencyAndEmergencyCare: false })}
            style={{ ...inputStyle, backgroundColor: !formData.coverageForNonEmergencyAndEmergencyCare ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>

            <label style={labelStyle}>
            Does it have a lifetime aggregate maximum benefit of at least $2,000,000 USD?
          <div style={inputContainerStyle}>
            <input
            type="button"
            value="Yes"
            onClick={() => setFormData({ ...formData, lifetimeAggregateMaxBenefit: true })}
            style={{ ...inputStyle, backgroundColor: formData.lifetimeAggregateMaxBenefit ? '#cccccc' : '#ffffff' }}
            />
            <input
            type="button"
            value="No"
            onClick={() => setFormData({ ...formData, lifetimeAggregateMaxBenefit: false })}
            style={{ ...inputStyle, backgroundColor: !formData.lifetimeAggregateMaxBenefit ? '#cccccc' : '#ffffff' }}
            />
            </div>
            </label>
    </form>
    </div>
  );
};

export default WaiveCardinalCare;