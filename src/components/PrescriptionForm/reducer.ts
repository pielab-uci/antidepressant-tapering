import produce from 'immer';
import { differenceInDays } from 'date-fns';
import { PrescriptionFormState } from './types';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM, CURRENT_DOSAGE_CHANGE, DRUG_NAME_CHANGE, FETCH_DRUGS,
  INTERVAL_COUNT_CHANGE, INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE,
  NEXT_DOSAGE_CHANGE, PRESCRIBED_QUANTITY_CHANGE,
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
  currentDosagesQty: {},
  nextDosagesQty: {},
  prescribedDosagesQty: {},
  intervalCount: 0,
  intervalUnit: 'Days',
  intervalStartDate: new Date(),
  intervalEndDate: null,
  intervalDurationDays: 0,
};

export const reducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => produce(state, (draft) => {
  switch (action.type) {
    case FETCH_DRUGS:
      draft.drugs = action.data;
      break;

    case DRUG_NAME_CHANGE: {
      const newDrug = draft.drugs!.find((drug) => drug.name === action.data.name)!;
      draft.chosenDrug = newDrug;
      draft.chosenBrand = null;
      draft.chosenDrugForm = null;
      draft.drugFormOptions = [];
      draft.brandOptions = newDrug.options;
      break;
    }

    case CHOOSE_BRAND: {
      const chosenBrandOption = draft.brandOptions!.find(
        (brand) => brand.brand === action.data.brand,
      )!;

      draft.chosenBrand = chosenBrandOption;
      draft.drugFormOptions = chosenBrandOption.forms;
      break;
    }

    case CHOOSE_FORM: {
      const chosenDrugForm = draft.drugFormOptions!.find((form) => form.form === action.data.form)!;
      draft.chosenDrugForm = chosenDrugForm;
      draft.dosageOptions = chosenDrugForm.dosages;
      chosenDrugForm.dosages.forEach((dosage) => {
        draft.currentDosagesQty[dosage] = 0;
        draft.nextDosagesQty[dosage] = 0;
      });
      break;
    }

    case CURRENT_DOSAGE_CHANGE:
      if (action.data.dosage.quantity >= 0) {
        draft.currentDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
      }
      break;

    case NEXT_DOSAGE_CHANGE:
      if (!(action.data.dosage.quantity < 0)) {
        draft.nextDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
        draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity * draft.intervalDurationDays;
      }
      break;

    case PRESCRIBED_QUANTITY_CHANGE:
      if (!(action.data.dosage.quantity < 0)
        && (action.data.dosage.quantity < draft.nextDosagesQty[action.data.dosage.dosage] * draft.intervalDurationDays)) {
        draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
      }
      break;

    case INTERVAL_START_DATE_CHANGE:
      draft.intervalStartDate = action.data.date;
      if (draft.intervalEndDate) {
        draft.intervalDurationDays = differenceInDays(draft.intervalEndDate, draft.intervalStartDate);
        Object.keys(draft.nextDosagesQty).forEach((key) => {
          draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * draft.intervalDurationDays;
        });
      }
      break;

    case INTERVAL_END_DATE_CHANGE:
      draft.intervalEndDate = action.data.date;
      draft.intervalDurationDays = differenceInDays(action.data.date!, draft.intervalStartDate);
      Object.keys(draft.nextDosagesQty).forEach((key) => {
        draft.prescribedDosagesQty[key] = draft.nextDosagesQty[key] * draft.intervalDurationDays;
      });
      break;

    case INTERVAL_UNIT_CHANGE:
      draft.intervalUnit = action.data.unit;
      break;

    case INTERVAL_COUNT_CHANGE:
      draft.intervalCount = action.data.count;
      break;
  }
});

export type PrescriptionFormReducer = typeof reducer;
