import produce from 'immer';
import add from 'date-fns/esm/add';
import differenceInCalendarDays from 'date-fns/esm/differenceInCalendarDays';
import isBefore from 'date-fns/esm/isBefore';
import sub from 'date-fns/esm/sub';
import isAfter from 'date-fns/esm/isAfter';
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
  CURRENT_DOSAGE_CHANGE,
  SET_GOAL_DOSAGE, SET_GROWTH,
  NEXT_DOSAGE_CHANGE,
} from './actions';
import { PillDosage, isCapsuleOrTablet, OralFormNames } from '../../types';

export const initialState: PrescriptionFormState = {
  drugs: null,
  chosenDrug: null,
  chosenBrand: null,
  chosenDrugForm: null,
  currentDosageForm: null,
  nextDosageForm: null,
  brandOptions: [],
  drugFormOptions: [],
  dosageOptions: [],
  currentDosageOptions: [],
  nextDosageOptions: [],
  availableDosageOptions: [],
  regularDosageOptions: [],
  minDosageUnit: 0,
  currentDosagesQty: {},
  isModal: false,
  currentDosageSum: 0,
  nextDosagesQty: {},
  nextDosageSum: 0,
  goalDosage: 0,
  allowSplittingUnscoredTablet: false,
  oralDosageInfo: null,
  currentOralDosageInfo: null,
  nextOralDosageInfo: null,
  intervalStartDate: (() => {
    const date = new Date();
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
  })(),
  intervalEndDate: (() => {
    const date = new Date();
    return add(new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000), { days: 6 });
  })(),
  intervalCount: 7,
  intervalUnit: 'Days',
  intervalDurationDays: 7,
  growth: 'linear',
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
        draft.currentDosageForm = action.data.currentDosageForm;
        draft.nextDosageForm = action.data.nextDosageForm;
        draft.currentDosageOptions = draft.drugFormOptions.find((form) => form.form === draft.currentDosageForm)!.dosages;
        draft.nextDosageOptions = draft.drugFormOptions.find((form) => form.form === draft.nextDosageForm)!.dosages;
        draft.dosageOptions = draft.chosenDrugForm.dosages;
        draft.allowSplittingUnscoredTablet = action.data.allowSplittingUnscoredTablet;
        draft.goalDosage = action.data.targetDosage;
        draft.currentDosagesQty = action.data.currentDosages.reduce(
          (prev: { [dosage: string]: number }, currentDosage) => {
            prev[currentDosage.dosage] = currentDosage.quantity;
            return prev;
          }, {},
        );
        draft.currentDosageSum = action.data.currentDosageSum;
        draft.nextDosagesQty = action.data.nextDosages.reduce(
          (prev: { [dosage: string]: number }, nextDosage) => {
            prev[nextDosage.dosage] = nextDosage.quantity;
            return prev;
          }, {},
        );
        draft.nextDosageSum = action.data.nextDosageSum;
        if (isCapsuleOrTablet(draft.chosenDrugForm)) {
          (draft.dosageOptions as PillDosage[]).forEach((dosage) => {
            if (!Object.keys(draft.currentDosagesQty).includes(dosage.dosage)) {
              draft.currentDosagesQty[dosage.dosage] = 0;
            }

            if (!Object.keys(draft.nextDosagesQty).includes(dosage.dosage)) {
              draft.nextDosagesQty[dosage.dosage] = 0;
            }
          });
        }
        draft.oralDosageInfo = action.data.oralDosageInfo || null;
        draft.currentOralDosageInfo = action.data.currentOralDosageInfo || null;
        draft.nextOralDosageInfo = action.data.nextOralDosageInfo || null;
        draft.isModal = action.data.isModal;
        draft.intervalStartDate = action.data.intervalStartDate;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalCount = action.data.intervalCount;
        draft.intervalUnit = action.data.intervalUnit;
        draft.growth = action.data.growth;
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
        if (!draft.isModal) {
          draft.currentDosageForm = null;
          draft.nextDosageForm = null;
          draft.currentOralDosageInfo = null;
          draft.nextOralDosageInfo = null;
          draft.nextDosageSum = 0;
        } else {
          draft.nextDosageForm = null;
          draft.nextOralDosageInfo = null;
          draft.nextDosageSum = 0;
        }

        draft.currentDosageForm = null;
        draft.goalDosage = 0;
        draft.drugFormOptions = chosenBrandOption.forms;
        draft.currentDosagesQty = {};
        draft.currentDosageSum = 0;
        draft.oralDosageInfo = null;
        draft.nextDosagesQty = {};
        break;
      }

      case CHOOSE_FORM: {
        const chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
        draft.chosenDrugForm = chosenDrugForm;
        draft.nextDosagesQty = {};
        draft.nextDosageSum = 0;
        draft.minDosageUnit = action.data.minDosageUnit;
        draft.regularDosageOptions = action.data.regularDosageOptions;
        draft.availableDosageOptions = action.data.availableDosageOptions;

        draft.dosageOptions = chosenDrugForm.dosages;

        draft.nextDosageForm = chosenDrugForm.form;
        draft.nextDosageOptions = chosenDrugForm.dosages;

        if (isCapsuleOrTablet(chosenDrugForm)) {
          chosenDrugForm.dosages.forEach((dosage) => {
            draft.nextDosagesQty[dosage.dosage] = 0;
          });
        } else {
          draft.nextDosagesQty['1mg'] = 0;
        }

        if (!draft.isModal) {
          draft.currentDosagesQty = {};
          draft.currentDosageSum = 0;
          draft.currentDosageForm = chosenDrugForm.form;
          draft.currentDosageOptions = chosenDrugForm.dosages;

          if (isCapsuleOrTablet(chosenDrugForm)) {
            chosenDrugForm.dosages.forEach((dosage) => {
              draft.currentDosagesQty[dosage.dosage] = 0;
            });
          } else {
            draft.currentDosagesQty['1mg'] = 0;
          }
          /** have to keep oralDosageInfo when currentDrugForm or nextDrugForm is an oral form. */
          draft.oralDosageInfo = action.data.oralDosageInfo;
          draft.currentOralDosageInfo = action.data.oralDosageInfo;
          draft.nextOralDosageInfo = action.data.oralDosageInfo;
        } else {
          draft.nextOralDosageInfo = action.data.oralDosageInfo;
        }
        //  if (action.data.oralDosageInfo === null && draft.currentDosageForm !== 'oral solution' && draft.currentDosageForm !== 'oral suspension'
        //     && draft.nextDosageForm !== 'oral solution' && draft.nextDosageForm !== 'oral suspension') {
        //   draft.oralDosageInfo = action.data.oralDosageInfo;
        // }

        if (draft.isModal) {
          if (draft.currentDosageForm !== 'oral solution' && draft.currentDosageForm !== 'oral suspension') {
            draft.oralDosageInfo = action.data.oralDosageInfo;
          }
        }

        break;
      }

      case CURRENT_DOSAGE_CHANGE: {
        if (action.data.dosage.quantity >= 0) {
          draft.currentDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
          draft.currentDosageSum = Object.entries(draft.currentDosagesQty).reduce((prev, [k, v]) => {
            return prev + parseFloat(k) * v;
          }, 0);

          if (draft.nextDosageSum > draft.currentDosageSum) {
            draft.goalDosage = draft.nextDosageSum;
          } else if (draft.nextDosageSum < draft.currentDosageSum) {
            draft.goalDosage = 0;
          } else {
            draft.goalDosage = draft.currentDosageSum;
          }
        }
        break;
      }

      case NEXT_DOSAGE_CHANGE: {
        if (action.data.dosage.quantity >= 0) {
          draft.nextDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
          draft.nextDosageSum = Object.entries(draft.nextDosagesQty).reduce((prev, [k, v]) => {
            return prev + parseFloat(k) * v;
          }, 0);

          if (draft.currentDosageSum < draft.nextDosageSum) {
            draft.goalDosage = draft.nextDosageSum;
          } else if (draft.currentDosageSum > draft.nextDosageSum) {
            if (!draft.isModal) {
              draft.goalDosage = 0;
            }
          } else {
            draft.goalDosage = draft.nextDosageSum;
          }
        }
        break;
      }

      case SET_GOAL_DOSAGE:
        draft.goalDosage = action.data.dosage;
        break;

      case ALLOW_SPLITTING_UNSCORED_TABLET:
        draft.allowSplittingUnscoredTablet = action.data.allow;
        if (action.data.allow) {
          draft.availableDosageOptions = [...new Set((draft.dosageOptions as PillDosage[]).map((option) => {
            if (option.isScored) {
              return option.dosage;
            }
            return [`${parseFloat(option.dosage) / 2}mg`, option.dosage];
          }).flat())];
        } else {
          draft.availableDosageOptions = draft.regularDosageOptions!;
          Object.entries(draft.currentDosagesQty).forEach(([k, v]) => {
            draft.currentDosagesQty[k] = Math.floor(v);
          });
          Object.entries(draft.nextDosagesQty).forEach(([k, v]) => {
            draft.nextDosagesQty[k] = Math.floor(v);
          });
        }

        break;

      case INTERVAL_START_DATE_CHANGE:
        draft.intervalStartDate = action.data.intervalStartDate;
        draft.intervalEndDate = action.data.intervalEndDate || draft.intervalEndDate;
        draft.intervalUnit = action.data.intervalUnit || draft.intervalUnit;
        draft.intervalDurationDays = action.data.intervalDurationDays || draft.intervalDurationDays;
        draft.intervalCount = action.data.intervalCount || draft.intervalCount;
        break;

      case INTERVAL_END_DATE_CHANGE:
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalStartDate = action.data.intervalStartDate || draft.intervalStartDate;
        draft.intervalUnit = action.data.intervalUnit || draft.intervalUnit;
        draft.intervalDurationDays = action.data.intervalDurationDays || draft.intervalDurationDays;
        draft.intervalCount = action.data.intervalCount || draft.intervalCount;
        break;

      case INTERVAL_UNIT_CHANGE:
        draft.intervalUnit = action.data.unit;
        draft.intervalCount = action.data.intervalCount;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalDurationDays = action.data.intervalDurationDays;
        break;

      case INTERVAL_COUNT_CHANGE:
        draft.intervalCount = action.data.count;
        draft.intervalEndDate = action.data.intervalEndDate;
        draft.intervalDurationDays = action.data.intervalDurationDays;
        break;

      case SET_GROWTH:
        draft.growth = action.data.growth;
        break;
    }
  });
};

export type PrescriptionFormReducer = typeof reducer;
