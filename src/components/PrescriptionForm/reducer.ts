import produce from 'immer';
import { add, differenceInCalendarDays } from 'date-fns';
import { PrescriptionFormState } from './types';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM,
  CURRENT_DOSAGE_CHANGE,
  DRUG_NAME_CHANGE,
  FETCH_DRUGS, INTERVAL_COUNT_CHANGE,
  INTERVAL_DURATION_IN_DAYS_CHANGE, INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE,
  NEXT_DOSAGE_CHANGE,
  PRESCRIBED_QUANTITY_CHANGE,
  PrescriptionFormActions,
} from './actions';

export const initialState: PrescriptionFormState = {
  drugs: null,
  chosenDrug: null,
  chosenBrand: null,
  chosenDrugForm: null,
  brandOptions: [],
  drugFormOptions: [],
  dosageOptions: [],
  minDosageUnit: 0,
  currentDosagesQty: {},
  nextDosagesQty: {},
  prescribedDosagesQty: {},
  intervalStartDate: new Date(),
  intervalEndDate: null,
  intervalCount: 0,
  intervalUnit: 'Days',
  intervalDurationDays: 0,
};

export const reducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case FETCH_DRUGS:
        draft.drugs = action.data.drugs;
        draft.brandOptions = draft.drugs.flatMap((drug) => drug.options);
        // draft.brandOptions = draft.drugs.map((drug) => ({ drug, options: drug.options});
        break;

      case DRUG_NAME_CHANGE: {
        const chosenDrugIdx = draft.drugs!.findIndex((drug) => drug.name === action.data.name)!;
        draft.chosenDrug = draft.drugs![chosenDrugIdx];
        draft.drugs!.splice(0, 0, draft.drugs!.splice(chosenDrugIdx, 1)[0]);

        draft.chosenBrand = null;
        draft.chosenDrugForm = null;
        draft.drugFormOptions = [];
        draft.prescribedDosagesQty = {};

        break;
      }

      case CHOOSE_BRAND: {
        const chosenBrandOption = draft.brandOptions!.find(
          (brand) => brand.brand === action.data.brand,
        )!;
        const chosenDrugIdx = draft.drugs!.findIndex((drug) => {
          return drug.options.find(
            (option) => option.brand === action.data.brand,
          );
        });
        draft.chosenDrug = draft.drugs![chosenDrugIdx];
        draft.drugs!.splice(0, 0, draft.drugs!.splice(chosenDrugIdx, 1)[0]);
        draft.chosenBrand = chosenBrandOption;
        draft.drugFormOptions = chosenBrandOption.forms;
        draft.prescribedDosagesQty = {};
        break;
      }

      case CHOOSE_FORM: {
        const chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
        draft.chosenDrugForm = chosenDrugForm;
        draft.dosageOptions = chosenDrugForm.dosages;
        draft.minDosageUnit = Math.min(...draft.dosageOptions.map((dosage) => parseFloat(dosage))) / 2;
        chosenDrugForm.dosages.forEach((dosage) => {
          draft.currentDosagesQty[dosage] = 0;
          draft.nextDosagesQty[dosage] = 0;
          draft.prescribedDosagesQty[dosage] = 0;
        });
        break;
      }

      case CURRENT_DOSAGE_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.currentDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case NEXT_DOSAGE_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.nextDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
          draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity * draft.intervalDurationDays;
        }
        break;

      case PRESCRIBED_QUANTITY_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case INTERVAL_START_DATE_CHANGE:
        draft.intervalStartDate = action.data.date;
        draft.intervalUnit = 'Days';
        if (draft.intervalEndDate) {
          draft.intervalCount = differenceInCalendarDays(draft.intervalEndDate, draft.intervalStartDate);
        }
        draft.intervalDurationDays = draft.intervalCount;
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_END_DATE_CHANGE:
        draft.intervalEndDate = action.data.date;
        draft.intervalUnit = 'Days';
        draft.intervalCount = differenceInCalendarDays(draft.intervalEndDate!, draft.intervalStartDate);
        draft.intervalDurationDays = draft.intervalCount;
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_UNIT_CHANGE:
        draft.intervalUnit = action.data.unit;
        draft.intervalEndDate = add(draft.intervalStartDate, { [draft.intervalUnit.toLowerCase()]: draft.intervalCount });
        draft.intervalDurationDays = differenceInCalendarDays(draft.intervalEndDate, draft.intervalStartDate);
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_COUNT_CHANGE:
        draft.intervalCount = action.data.count;
        draft.intervalEndDate = add(draft.intervalStartDate, { [draft.intervalUnit.toLowerCase()]: draft.intervalCount });
        draft.intervalDurationDays = differenceInCalendarDays(draft.intervalEndDate, draft.intervalStartDate);
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_DURATION_IN_DAYS_CHANGE:
        // Object.keys(draft.prescribedDosagesQty).forEach((key) => {
        //   draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * action.data.durationDays;
        // });
        // Object.entries(draft.prescribedDosagesQty).forEach(([k, v]) => {
        //   draft.prescribedDosagesQty[k] = draft.nextDosagesQty[k] * action.data!.durationDays;
        // });
        break;
    }
  });
};

export type PrescriptionFormReducer = typeof reducer;
