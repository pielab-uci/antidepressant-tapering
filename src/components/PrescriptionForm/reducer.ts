import produce from 'immer';
import { add, differenceInCalendarDays } from 'date-fns';
import { PrescriptionFormState } from './types';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM, CURRENT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT,
  CURRENT_DOSAGE_CHANGE,
  FETCH_DRUGS, INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE, LOAD_PRESCRIPTION_DATA,
  NEXT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT,
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
  availableDosageOptions: [],
  minDosageUnit: 0,
  currentDosagesQty: {},
  nextDosagesQty: {},
  currentDosageAllowSplittingUnscoredUnit: false,
  nextDosageAllowSplittingUnscoredUnit: false,
  prescribedDosagesQty: {},
  intervalStartDate: new Date(),
  intervalEndDate: null,
  intervalCount: 0,
  intervalUnit: 'Days',
  intervalDurationDays: 0,
};

export const reducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => {
  console.log('action: ', action);
  return produce(state, (draft) => {
    switch (action.type) {
      case FETCH_DRUGS:
        draft.drugs = action.data.drugs;
        draft.brandOptions = draft.drugs.flatMap((drug) => drug.options);
        break;

      case LOAD_PRESCRIPTION_DATA: {
        draft.chosenDrug = draft.drugs!.find((drug) => drug.name === action.data.name);
        draft.chosenBrand = draft.brandOptions!.find((brand) => brand.brand === action.data.brand)!;
        draft.drugFormOptions = draft.chosenBrand.forms;
        draft.chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
        draft.dosageOptions = draft.chosenDrugForm.dosages;
        draft.currentDosagesQty = action.data.currentDosages.reduce(
          (prev: { [dosage: string]: number }, currentDosage) => {
            prev[currentDosage.dosage] = currentDosage.quantity;
            return prev;
          }, {},
        );
        draft.nextDosagesQty = action.data.nextDosages.reduce(
          (prev: { [dosage: string]: number }, nextDosage) => {
            prev[nextDosage.dosage] = nextDosage.quantity;
            return prev;
          }, {},
        );
        draft.dosageOptions.forEach((dosage) => {
          if (!Object.keys(draft.currentDosagesQty).includes(dosage.dosage)) {
            draft.currentDosagesQty[dosage.dosage] = 0;
          }

          if (!Object.keys(draft.nextDosagesQty).includes(dosage.dosage)) {
            draft.nextDosagesQty[dosage.dosage] = 0;
          }
        });
        draft.intervalStartDate = action.data.intervalStartDate;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalCount = action.data.intervalCount;
        draft.intervalUnit = action.data.intervalUnit;
        draft.currentDosageAllowSplittingUnscoredUnit = action.data.currentAllowSplittingUnscoredDosageUnit;
        draft.nextDosageAllowSplittingUnscoredUnit = action.data.nextAllowSplittingUnscoredDosageUnit;
        draft.prescribedDosagesQty = action.data.prescribedDosages;
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
        draft.chosenDrugForm = null;
        draft.drugFormOptions = chosenBrandOption.forms;
        draft.currentDosagesQty = {};
        draft.nextDosagesQty = {};
        draft.prescribedDosagesQty = {};
        break;
      }

      case CHOOSE_FORM: {
        const chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
        draft.chosenDrugForm = chosenDrugForm;
        draft.dosageOptions = chosenDrugForm.dosages;
        draft.minDosageUnit = Math.min(...draft.dosageOptions.map((dosage) => parseFloat(dosage.dosage))) / 2;
        draft.availableDosageOptions = [...new Set(draft.dosageOptions.flatMap((option) => {
          if (option.isScored) {
            return [`${parseFloat(option.dosage) / 2}${draft.chosenDrugForm!.measureUnit}`, option.dosage];
          }
          return option.dosage;
        }))];

        draft.currentDosagesQty = {};
        draft.nextDosagesQty = {};
        draft.prescribedDosagesQty = {};

        chosenDrugForm.dosages.forEach((dosage) => {
          draft.currentDosagesQty[dosage.dosage] = 0;
          draft.nextDosagesQty[dosage.dosage] = 0;
          draft.prescribedDosagesQty[dosage.dosage] = 0;
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

      case CURRENT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT:
        draft.currentDosageAllowSplittingUnscoredUnit = action.data.allow;
        if (!action.data.allow) {
          Object.entries(draft.currentDosagesQty).forEach(([k, v]) => {
            draft.currentDosagesQty[k] = Math.floor(v);
          });
        }
        break;

      case NEXT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT:
        draft.nextDosageAllowSplittingUnscoredUnit = action.data.allow;
        if (!action.data.allow) {
          Object.entries(draft.nextDosagesQty).forEach(([k, v]) => {
            draft.nextDosagesQty[k] = Math.floor(v);
          });
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
    }
  });
};

export type PrescriptionFormReducer = typeof reducer;
