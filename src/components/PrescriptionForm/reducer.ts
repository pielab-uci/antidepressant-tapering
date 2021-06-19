import produce from 'immer';
import { PrescriptionFormState } from './types';
import {
  ALLOW_SPLITTING_UNSCORED_TABLET,
  CHOOSE_BRAND,
  CHOOSE_FORM,
  FETCH_DRUGS,
  INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE,
  INTERVAL_UNIT_CHANGE,
  LOAD_PRESCRIPTION_DATA,
  PrescriptionFormActions,
  PRIOR_DOSAGE_CHANGE,
  SET_TARGET_DOSAGE,
  UPCOMING_DOSAGE_CHANGE,
} from './actions';
import { CapsuleOrTabletDosage, isCapsuleOrTablet } from '../../types';

export const initialState: PrescriptionFormState = {
  drugs: null,
  chosenDrug: null,
  chosenBrand: null,
  chosenDrugForm: null,
  brandOptions: [],
  drugFormOptions: [],
  dosageOptions: [],
  availableDosageOptions: [],
  regularDosageOptions: [],
  minDosageUnit: 0,
  priorDosagesQty: {},
  upcomingDosagesQty: {},
  targetDosage: 0,
  allowSplittingUnscoredTablet: false,
  oralDosageInfo: null,
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
          (draft.dosageOptions as CapsuleOrTabletDosage[]).forEach((dosage) => {
            if (!Object.keys(draft.priorDosagesQty).includes(dosage.dosage)) {
              draft.priorDosagesQty[dosage.dosage] = 0;
            }

            if (!Object.keys(draft.upcomingDosagesQty).includes(dosage.dosage)) {
              draft.upcomingDosagesQty[dosage.dosage] = 0;
            }
          });
          draft.oralDosageInfo = null;
        }
        draft.intervalStartDate = action.data.intervalStartDate;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalCount = action.data.intervalCount;
        draft.intervalUnit = action.data.intervalUnit;
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
        draft.priorDosagesQty = {};
        draft.oralDosageInfo = null;
        draft.upcomingDosagesQty = {};
        break;
      }

      case CHOOSE_FORM: {
        const chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
        draft.chosenDrugForm = chosenDrugForm;
        draft.priorDosagesQty = {};
        draft.upcomingDosagesQty = {};

        draft.minDosageUnit = action.data.minDosageUnit;
        draft.regularDosageOptions = action.data.regularDosageOptions;
        draft.availableDosageOptions = action.data.availableDosageOptions;
        draft.oralDosageInfo = action.data.oralDosageInfo;
        draft.dosageOptions = chosenDrugForm.dosages;

        if (isCapsuleOrTablet(chosenDrugForm)) {
          chosenDrugForm.dosages.forEach((dosage) => {
            draft.priorDosagesQty[dosage.dosage] = 0;
            draft.upcomingDosagesQty[dosage.dosage] = 0;
          });
        } else {
          draft.priorDosagesQty['1mg'] = 0;
          draft.upcomingDosagesQty['1mg'] = 0;
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
        }
        break;

      case SET_TARGET_DOSAGE:
        draft.targetDosage = action.data.dosage;
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
          draft.intervalCount = action.data.intervalDurationDays;
          draft.intervalDurationDays = action.data.intervalDurationDays;
        }
        break;

      case INTERVAL_END_DATE_CHANGE:
        draft.intervalEndDate = action.data.date;
        draft.intervalUnit = 'Days';
        draft.intervalDurationDays = action.data.intervalDurationDays;
        draft.intervalCount = draft.intervalDurationDays;
        break;

      case INTERVAL_UNIT_CHANGE:
        draft.intervalUnit = action.data.unit;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalDurationDays = action.data.intervalDurationDays;
        break;

      case INTERVAL_COUNT_CHANGE:
        draft.intervalCount = action.data.count;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalDurationDays = action.data.intervalDurationDays;
        break;
    }
  });
};

export type PrescriptionFormReducer = typeof reducer;
