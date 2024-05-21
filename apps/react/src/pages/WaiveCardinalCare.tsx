import { useCallback, useContext, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { getButtonClassNames } from "../components/Button";
import Constraint from "../components/Constraint";
import Container from "../components/Container";
import FormDataSpy from "../components/FormDataSpy";
import Input from "../components/Input";
import InputDate from "../components/InputDate";
import InputSelectButtons from "../components/InputSelectButtons";
import {
  SIDEBAR_COLLAPSED_NAVBAR_LEFT,
  SIDEBAR_NOT_COLLAPSED_NAVBAR_LEFT,
  Z_INDEX_NAVBAR,
} from "../consts/classes.const";
import { YES_OR_NO, isNo, isYes } from "../consts/options.const";
import { BasicOption } from "../types/basicOption";
import { classNames } from "../utils/classNames";
import { IsSidebarCollapsedContext } from "../contexts/isSidebarCollapsedContext";
import useSessionUser from "../hooks/useSessionUser";

/* -------------------------------------------------------------------------- */
/*                                 Form Schema                                */
/* -------------------------------------------------------------------------- */

type FormValues = {
  international: BasicOption | null;
  /* ------------------------------ I18n student ------------------------------ */
  evacCoverage: number;
  repatriationCoverage: number;
  jVisaHolder: BasicOption | null;
  jVisaDeductible: number;
  visaCopy: BasicOption | null;
  internationalTranslated: BasicOption | null;
  /* --------------------------------- Further -------------------------------- */
  coverageStartDate: Date;
  coverageEndDate: Date;
  coversInpatientOutpatientMedicalSF: BasicOption | null;
  coversInpatientOutpatientMentalHealthSF: BasicOption | null;
  annualDeductible: number;
  specialEmployerPlanAnnualDeductible: BasicOption | null;
  annualOutOfPocketMaximum: number;
  specialEmployerPlanAnnualOutOfPocketMaximum: BasicOption | null;
  providesEMBPPACA: BasicOption | null;
  covers100PercentPreventiveCarePPACA: BasicOption | null;
  exclusionsForPreExistingConditions: BasicOption | null;
  offersPrescriptionDrugCoverage: BasicOption | null;
  coverageForNonEmergencyAndEmergencyCare: BasicOption | null;
  lifetimeAggregateMaxBenefit: BasicOption | null;
};

const INTERNATIONAL_FIELDS = [
  "evacCoverage",
  "repatriationCoverage",
  "jVisaHolder",
  "jVisaDeductible",
  "visaCopy",
  "internationalTranslated",
] as const satisfies (keyof FormValues)[];

const DEFAULT_DATE = new Date();

const DEFAULT_VALUES: FormValues = {
  international: null,
  /* ------------------------------ I18n student ------------------------------ */
  evacCoverage: 0,
  repatriationCoverage: 0,
  jVisaHolder: null,
  jVisaDeductible: 0,
  visaCopy: null,
  internationalTranslated: null,
  /* --------------------------------- Common --------------------------------- */
  coverageStartDate: DEFAULT_DATE,
  coverageEndDate: DEFAULT_DATE,
  coversInpatientOutpatientMedicalSF: null,
  coversInpatientOutpatientMentalHealthSF: null,
  annualDeductible: 0,
  specialEmployerPlanAnnualDeductible: null,
  annualOutOfPocketMaximum: 0,
  specialEmployerPlanAnnualOutOfPocketMaximum: null,
  providesEMBPPACA: null, // Assuming true for US plans as mentioned
  covers100PercentPreventiveCarePPACA: null, // Assuming true for US plans as mentioned
  exclusionsForPreExistingConditions: null,
  offersPrescriptionDrugCoverage: null,
  coverageForNonEmergencyAndEmergencyCare: null,
  lifetimeAggregateMaxBenefit: null,
};

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export default function WaiveCardinalCarePage() {
  /* ---------------------------------- Hooks --------------------------------- */
  const user = useSessionUser();
  const isUserLoggedIn = Boolean(user);

  const { isSidebarCollapsed } = useContext(IsSidebarCollapsedContext);

  const { control, watch, getValues } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  /* ------------------------------ Record filter ----------------------------- */

  // This function is used to filter out fields that are not displayed.
  // This is useful when trying to find out which fields still have to be filled
  // and which fields should influence the waiver decision.
  const formDataFilterFunction = useCallback(
    (
      [key, value]: [key: keyof FormValues | string, value: any],
      shouldFilterNulls = false,
    ) => {
      const { international, jVisaHolder } = getValues();

      if (shouldFilterNulls && value === null) return false;

      if (
        !isYes(international) &&
        (INTERNATIONAL_FIELDS as string[]).includes(key)
      ) {
        return false;
      }

      if (!isYes(jVisaHolder) && key === "jVisaDeductible") {
        return false;
      }

      return true;
    },
    [getValues],
  );

  /* ------------------------------ Fields filled ----------------------------- */

  const isFieldFilledRecord: Partial<Record<keyof FormValues, boolean>> =
    useMemo(() => {
      const formData = getValues();

      const isFieldFilledRecord = Object.fromEntries(
        Object.entries(formData)
          .filter((keyValuePair) => formDataFilterFunction(keyValuePair))
          .map(([key, value]) => {
            if (value instanceof Date) {
              return [key, value.getTime() !== DEFAULT_DATE.getTime()]; // Make sure dates have been changed.
            }

            return [key, Boolean(value)]; // i.e., not null or 0
          }),
      ) as Partial<Record<keyof FormValues, boolean>>;

      console.debug("isFieldFilledRecord", isFieldFilledRecord);

      return isFieldFilledRecord;
    }, [JSON.stringify(watch())]);

  const nextFieldToFill = useMemo(() => {
    const undefinedOrNextFieldToFillEntry = Object.entries(
      isFieldFilledRecord,
    ).find(([, isFilled]) => !isFilled);

    console.debug(
      "undefinedOrNextFieldToFillEntry",
      undefinedOrNextFieldToFillEntry,
    );

    return Array.isArray(undefinedOrNextFieldToFillEntry)
      ? undefinedOrNextFieldToFillEntry[0] // Key of the field
      : undefined;
  }, [isFieldFilledRecord]);

  const areAllFieldsFilled = typeof nextFieldToFill === "undefined";

  /* ---------------- Fields' influence on the waiver decision ---------------- */

  const doesFieldAllowWaiveRecord: Record<keyof FormValues, boolean | null> =
    useMemo(() => {
      // Destructure fields
      const {
        evacCoverage,
        repatriationCoverage,
        jVisaDeductible,
        visaCopy,
        internationalTranslated,
        coverageStartDate,
        coverageEndDate,
        coversInpatientOutpatientMedicalSF,
        coversInpatientOutpatientMentalHealthSF,
        annualDeductible,
        specialEmployerPlanAnnualDeductible,
        annualOutOfPocketMaximum,
        specialEmployerPlanAnnualOutOfPocketMaximum,
        providesEMBPPACA,
        covers100PercentPreventiveCarePPACA,
        exclusionsForPreExistingConditions,
        offersPrescriptionDrugCoverage,
        coverageForNonEmergencyAndEmergencyCare,
        lifetimeAggregateMaxBenefit,
      } = getValues();

      const academicStart = new Date("2023-09-26");
      const academicEnd = new Date("2024-06-12");

      const isDeductibleCovered =
        annualDeductible <= 1000 || isYes(specialEmployerPlanAnnualDeductible);

      const isOopCovered =
        annualOutOfPocketMaximum <= 9100 ||
        isYes(specialEmployerPlanAnnualOutOfPocketMaximum);

      // Return them

      const doesFieldAllowWaiveRecord = {
        international: null, // Null because field doesn't affect the waiver decision.
        evacCoverage: evacCoverage >= 50000,
        repatriationCoverage: repatriationCoverage >= 25000,
        jVisaHolder: null, // Null because field doesn't affect the waiver decision.
        jVisaDeductible: jVisaDeductible <= 500,
        visaCopy: isYes(visaCopy),
        internationalTranslated: isYes(internationalTranslated),
        coverageStartDate:
          coverageStartDate.getTime() < academicStart.getTime(),
        coverageEndDate: coverageEndDate.getTime() > academicEnd.getTime(),
        coversInpatientOutpatientMedicalSF: isYes(
          coversInpatientOutpatientMedicalSF,
        ),
        coversInpatientOutpatientMentalHealthSF: isYes(
          coversInpatientOutpatientMentalHealthSF,
        ),
        annualDeductible: isDeductibleCovered,
        specialEmployerPlanAnnualDeductible: isDeductibleCovered,
        annualOutOfPocketMaximum: isOopCovered,
        specialEmployerPlanAnnualOutOfPocketMaximum: isOopCovered,
        providesEMBPPACA: isYes(providesEMBPPACA),
        covers100PercentPreventiveCarePPACA: isYes(
          covers100PercentPreventiveCarePPACA,
        ),
        exclusionsForPreExistingConditions: isNo(
          exclusionsForPreExistingConditions,
        ),
        offersPrescriptionDrugCoverage: isYes(offersPrescriptionDrugCoverage),
        coverageForNonEmergencyAndEmergencyCare: isYes(
          coverageForNonEmergencyAndEmergencyCare,
        ),
        lifetimeAggregateMaxBenefit: isYes(lifetimeAggregateMaxBenefit),
      };

      console.debug("doesFieldAllowWaiveRecord", doesFieldAllowWaiveRecord);

      return doesFieldAllowWaiveRecord;
    }, [JSON.stringify(watch())]);

  const canWaive = useMemo(() => {
    const filteredEntries = Object.fromEntries(
      Object.entries(doesFieldAllowWaiveRecord).filter(
        (keyValuePair) => formDataFilterFunction(keyValuePair, true), // Unlike above, filter null values this time because they shouldn't affect the waiver decision.
      ) as [keyof FormValues, boolean][],
    ) as Partial<Record<keyof FormValues, boolean>>;

    const canWaive = Object.values(filteredEntries).reduce(
      (acc, value) => acc && value,
    );

    console.debug("canWaive", canWaive);

    return canWaive;
  }, [doesFieldAllowWaiveRecord]);

  /* ------------------------------ Field display ----------------------------- */

  const getFieldClassNames = useCallback(
    (key: keyof FormValues) => {
      if (isFieldFilledRecord[key]) {
        if (doesFieldAllowWaiveRecord[key] === false)
          return "[&_input]:bg-red-400 [&_input]:border-red-400 [&_button.selected]:bg-red-400 [&_button.selected]:border-red-400";

        if (doesFieldAllowWaiveRecord[key] === true)
          return "opacity-50 [&_input]:bg-green-400 [&_input]:border-green-400 [&_button.selected]:bg-green-400 [&_button.selected]:border-green-400";
      }

      if (key === nextFieldToFill) return "";

      return "opacity-50";
    },
    [isFieldFilledRecord, doesFieldAllowWaiveRecord],
  );

  /* ----------------------------- View conditions ---------------------------- */

  const shouldShowInternationalSection = isYes(watch("international"));
  const shouldShowJVisaDeductible = isYes(watch("jVisaHolder"));

  /* --------------------------------- Render --------------------------------- */

  return (
    <>
      <Container
        className={classNames(
          Z_INDEX_NAVBAR,
          "fixed right-0 top-16 p-3",
          [!isUserLoggedIn, "left-0"],
          [isUserLoggedIn && isSidebarCollapsed, SIDEBAR_COLLAPSED_NAVBAR_LEFT],
          [
            isUserLoggedIn && !isSidebarCollapsed,
            SIDEBAR_NOT_COLLAPSED_NAVBAR_LEFT,
          ],
          [!areAllFieldsFilled, "bg-gray-200"],
          [areAllFieldsFilled && canWaive, "bg-green-400"],
          [areAllFieldsFilled && !canWaive, "bg-red-400"],
        )}
      >
        <h1 className="flex-1 text-xl">
          Can I waive goodbye to Cardinal Care?
        </h1>
        <div
          className={classNames(
            getButtonClassNames("white"),
            "hover:bg-white cursor-auto",
            [areAllFieldsFilled && canWaive, "text-green-400"],
            [areAllFieldsFilled && !canWaive, "text-red-400"],
          )}
        >
          {!areAllFieldsFilled ? "More Info Required" : canWaive ? "Yes" : "No"}
        </div>
      </Container>
      <Container
        makeBoxed="narrow"
        addVerticalPadding={true}
        makeGutter={true}
        className="max-w-3xl mt-20"
      >
        <Constraint
          id="international"
          label={"Are you an international student?"}
          className={getFieldClassNames("international")}
        >
          <Controller
            name="international"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        {/* ------------------------------ I18n student ------------------------------ */}
        {shouldShowInternationalSection && (
          <Container makeGutter={true} className="border-2 border-gray-200 p-3">
            <h2 className="text-center font-bold">
              Additional Questions For International Students
            </h2>
            <Constraint
              id="evacCoverage"
              label={
                "How much medical evacuation coverage to your home country do you have?"
              }
              className={getFieldClassNames("evacCoverage")}
            >
              <Controller
                name="evacCoverage"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Input type="number" {...field} />
                )}
              />
            </Constraint>
            <Constraint
              id="repatriationCoverage"
              label={
                "How much repatriation coverage to your home country do you have?"
              }
              className={getFieldClassNames("repatriationCoverage")}
            >
              <Controller
                name="repatriationCoverage"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Input type="number" {...field} />
                )}
              />
            </Constraint>
            <Constraint
              id="jVisaHolder"
              label={"Are you a J-Visa holder?"}
              className={getFieldClassNames("jVisaHolder")}
            >
              <Controller
                name="jVisaHolder"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <InputSelectButtons {...field} options={YES_OR_NO} />
                )}
              />
            </Constraint>
            {shouldShowJVisaDeductible && (
              <Constraint
                id="jVisaDeductible"
                label={"What is your insurance deductible?"}
                className={getFieldClassNames("jVisaDeductible")}
              >
                <Controller
                  name="jVisaDeductible"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <Input type="number" {...field} />
                  )}
                />
              </Constraint>
            )}
            <Constraint
              id="visaCopy"
              label={"Can you submit a copy of your Visa?"}
              className={getFieldClassNames("visaCopy")}
            >
              <Controller
                name="visaCopy"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <InputSelectButtons {...field} options={YES_OR_NO} />
                )}
              />
            </Constraint>
            <Constraint
              id="internationalTranslated"
              label={
                "Can you submit a copy of all policy documents expressed in English, and under U.S. dollars?"
              }
              className={getFieldClassNames("internationalTranslated")}
            >
              <Controller
                name="internationalTranslated"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <InputSelectButtons {...field} options={YES_OR_NO} />
                )}
              />
            </Constraint>
          </Container>
        )}
        {/* --------------------------------- Further -------------------------------- */}
        <Constraint
          id="coverageStartDate"
          label={"Coverage Start Date"}
          className={getFieldClassNames("coverageStartDate")}
        >
          <Controller
            name="coverageStartDate"
            control={control}
            render={({ field: { ref, ...field } }) => <InputDate {...field} />}
          />
        </Constraint>
        <Constraint
          id="coverageEndDate"
          label={"Coverage End Date"}
          className={getFieldClassNames("coverageEndDate")}
        >
          <Controller
            name="coverageEndDate"
            control={control}
            render={({ field: { ref, ...field } }) => <InputDate {...field} />}
          />
        </Constraint>
        <Constraint
          id="coversInpatientOutpatientMedicalSF"
          label={
            "Does it Cover Inpatient and Outpatient Medical Care in the San Francisco Bay Area?"
          }
          className={getFieldClassNames("coversInpatientOutpatientMedicalSF")}
        >
          <Controller
            name="coversInpatientOutpatientMedicalSF"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="coversInpatientOutpatientMentalHealthSF"
          label={
            "Does it Cover Inpatient and Outpatient Mental Health Care in the San Francisco Bay Area?"
          }
          className={getFieldClassNames(
            "coversInpatientOutpatientMentalHealthSF",
          )}
        >
          <Controller
            name="coversInpatientOutpatientMentalHealthSF"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="annualDeductible"
          label={"What is your annual deductible?"}
          className={getFieldClassNames("annualDeductible")}
        >
          <Controller
            name="annualDeductible"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input type="number" {...field} />
            )}
          />
        </Constraint>
        <Constraint
          id="specialEmployerPlanAnnualDeductible"
          label={
            "Do you have a special employer plan with an annual deductible above $1,000?"
          }
          className={getFieldClassNames("specialEmployerPlanAnnualDeductible")}
        >
          <Controller
            name="specialEmployerPlanAnnualDeductible"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="annualOutOfPocketMaximum"
          label={"What is your annual out of pocket maximum?"}
          className={getFieldClassNames("annualOutOfPocketMaximum")}
        >
          <Controller
            name="annualOutOfPocketMaximum"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input type="number" {...field} />
            )}
          />
        </Constraint>
        <Constraint
          id="specialEmployerPlanAnnualOutOfPocketMaximum"
          label={
            "Do you have a special employer plan with an annual out of pocket maximum above $9,100?"
          }
          className={getFieldClassNames(
            "specialEmployerPlanAnnualOutOfPocketMaximum",
          )}
        >
          <Controller
            name="specialEmployerPlanAnnualOutOfPocketMaximum"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="providesEMBPPACA"
          label={
            "Does it provide the Essential Minimum Benefits required by the Patient Protection and Affordable Care Act (PPACA) with no annual or lifetime maximums? (Virtually all major US-based policies do.)"
          }
          className={getFieldClassNames("providesEMBPPACA")}
        >
          <Controller
            name="providesEMBPPACA"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="covers100PercentPreventiveCarePPACA"
          label={
            "Does it cover 100% of Preventive Care as defined by the PPACA?"
          }
          className={getFieldClassNames("covers100PercentPreventiveCarePPACA")}
        >
          <Controller
            name="covers100PercentPreventiveCarePPACA"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="exclusionsForPreExistingConditions"
          label={"Does it contain ANY exclusions for pre-existing conditions?"}
          className={getFieldClassNames("exclusionsForPreExistingConditions")}
        >
          <Controller
            name="exclusionsForPreExistingConditions"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="offersPrescriptionDrugCoverage"
          label={"Does it offer Prescription Drug Coverage?"}
          className={getFieldClassNames("offersPrescriptionDrugCoverage")}
        >
          <Controller
            name="offersPrescriptionDrugCoverage"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="coverageForNonEmergencyAndEmergencyCare"
          label={
            "Does it offer coverage for both non-emergency AND emergency care?"
          }
          className={getFieldClassNames(
            "coverageForNonEmergencyAndEmergencyCare",
          )}
        >
          <Controller
            name="coverageForNonEmergencyAndEmergencyCare"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <Constraint
          id="lifetimeAggregateMaxBenefit"
          label={
            "Does it have a lifetime aggregate maximum benefit of at least $2,000,000 USD, OR a maximum per condition/per lifetime benefit of $500,000 USD?"
          }
          className={getFieldClassNames("lifetimeAggregateMaxBenefit")}
        >
          <Controller
            name="lifetimeAggregateMaxBenefit"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <InputSelectButtons {...field} options={YES_OR_NO} />
            )}
          />
        </Constraint>
        <FormDataSpy data={watch()} />
      </Container>
    </>
  );
}
