import produce from 'immer';
import {
  add, differenceInCalendarDays, format, sub,
} from 'date-fns';
import { PrescriptionFormState } from './types';
import {
  ALLOW_SPLITTING_UNSCORED_TABLET,
  CHOOSE_BRAND,
  CHOOSE_FORM,
  PRIOR_DOSAGE_CHANGE,
  FETCH_DRUGS, INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE, LOAD_PRESCRIPTION_DATA,
  UPCOMING_DOSAGE_CHANGE,
  PRESCRIBED_QUANTITY_CHANGE,
  PrescriptionFormActions,
} from './actions';
import { CapsuleTabletDosage, isCapsuleOrTablet } from '../../types';
import CapsuleOrTabletDosages from '../CapsuleOrTabletDosages';

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
  priorDosagesQty: {},
  upcomingDosagesQty: {},
  allowSplittingUnscoredTablet: false,
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
        draft.chosenDrugForm = draft.drugFormOptions.find((form) => form.form === action.data.form)!;
        draft.dosageOptions = draft.chosenDrugForm.dosages;
        draft.priorDosagesQty = action.data.priorDosages.reduce(
          (prev: { [dosage: string]: number }, currentDosage) => {
            prev[currentDosage.dosage] = currentDosage.quantity;
            return prev;
          }, {},
        );
        draft.upcomingDosagesQty = action.data.upcomingDosages.reduce(
          (prev: { [dosage: string]: number }, nextDosage) => {
            prev[nextDosage.dosage] = nextDosage.quantity;
            return prev;
          }, {},
        );

        if (isCapsuleOrTablet(draft.chosenDrugForm)) {
          (draft.dosageOptions as CapsuleTabletDosage[]).forEach((dosage) => {
            if (!Object.keys(draft.priorDosagesQty).includes(dosage.dosage)) {
              draft.priorDosagesQty[dosage.dosage] = 0;
            }

            if (!Object.keys(draft.upcomingDosagesQty).includes(dosage.dosage)) {
              draft.upcomingDosagesQty[dosage.dosage] = 0;
            }
          });
        }
        draft.intervalStartDate = action.data.intervalStartDate;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalCount = action.data.intervalCount;
        draft.intervalUnit = action.data.intervalUnit;
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
        draft.intervalUnit = 'Days';
        draft.intervalCount = 0;
        draft.intervalEndDate = null;
        draft.priorDosagesQty = {};
        draft.upcomingDosagesQty = {};
        draft.prescribedDosagesQty = {};
        break;
      }

      case CHOOSE_FORM: {
        const chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
        draft.chosenDrugForm = chosenDrugForm;
        if (isCapsuleOrTablet(chosenDrugForm)) {
          draft.dosageOptions = chosenDrugForm.dosages;
          draft.minDosageUnit = Math.min(...draft.dosageOptions.map((dosage) => parseFloat(dosage.dosage))) / 2;
          draft.availableDosageOptions = [...new Set(draft.dosageOptions.flatMap((option) => {
            if (option.isScored) {
              return [`${parseFloat(option.dosage) / 2}${draft.chosenDrugForm!.measureUnit}`, option.dosage];
            }
            return option.dosage;
          }))];

          draft.priorDosagesQty = {};
          draft.upcomingDosagesQty = {};
          draft.prescribedDosagesQty = {};

          chosenDrugForm.dosages.forEach((dosage) => {
            draft.priorDosagesQty[dosage.dosage] = 0;
            draft.upcomingDosagesQty[dosage.dosage] = 0;
            draft.prescribedDosagesQty[dosage.dosage] = 0;
          });
        } else {

        }

        break;
      }

      case PRIOR_DOSAGE_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.priorDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case UPCOMING_DOSAGE_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.upcomingDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
          draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity * draft.intervalDurationDays;
        }
        break;

      case PRESCRIBED_QUANTITY_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case ALLOW_SPLITTING_UNSCORED_TABLET:
        draft.allowSplittingUnscoredTablet = action.data.allow;
        if (!action.data.allow) {
          Object.entries(draft.priorDosagesQty).forEach(([k, v]) => {
            draft.priorDosagesQty[k] = Math.floor(v);
          });
          Object.entries(draft.upcomingDosagesQty).forEach(([k, v]) => {
            draft.upcomingDosagesQty[k] = Math.floor(v);
          });
        }
        break;

      case INTERVAL_START_DATE_CHANGE:
        draft.intervalStartDate = new Date(action.data.date.valueOf() + action.data.date.getTimezoneOffset() * 60 * 1000);
        draft.intervalUnit = 'Days';
        if (draft.intervalEndDate) {
          draft.intervalCount = differenceInCalendarDays(draft.intervalEndDate, draft.intervalStartDate) + 1;
        }
        draft.intervalDurationDays = draft.intervalCount;
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.upcomingDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_END_DATE_CHANGE:
        // draft.intervalEndDate = action.data.date;
        if (action.data.date) {
          draft.intervalEndDate = new Date(action.data.date.valueOf() + action.data.date?.getTimezoneOffset() * 60 * 1000);
        } else {
          draft.intervalEndDate = action.data.date;
        }
        draft.intervalUnit = 'Days';
        draft.intervalDurationDays = differenceInCalendarDays(draft.intervalEndDate!, draft.intervalStartDate) + 1;
        draft.intervalCount = draft.intervalDurationDays;
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.upcomingDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_UNIT_CHANGE:
        draft.intervalUnit = action.data.unit;
        draft.intervalEndDate = sub(add(draft.intervalStartDate, { [draft.intervalUnit.toLowerCase()]: draft.intervalCount }), { days: 1 });
        draft.intervalDurationDays = differenceInCalendarDays(draft.intervalEndDate, draft.intervalStartDate) + 1;
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.upcomingDosagesQty[key] * draft.intervalDurationDays;
        });
        break;

      case INTERVAL_COUNT_CHANGE:
        draft.intervalCount = action.data.count;
        if (draft.intervalCount === 0) {
          draft.intervalEndDate = null;
          draft.intervalDurationDays = 0;
        } else {
          draft.intervalEndDate = sub(add(draft.intervalStartDate, {
            [draft.intervalUnit.toLowerCase()]: draft.intervalCount,
          }), { days: 1 });
          draft.intervalDurationDays = differenceInCalendarDays(draft.intervalEndDate, draft.intervalStartDate) + 1;
        }
        Object.keys(draft.prescribedDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.upcomingDosagesQty[key] * draft.intervalDurationDays;
        });
        break;
    }
  });
};

export type PrescriptionFormReducer = typeof reducer;
