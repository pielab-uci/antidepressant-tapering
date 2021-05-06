import produce from 'immer';
import { PrescriptionFormState } from './types';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM, CURRENT_DOSAGE_CHANGE, DRUG_NAME_CHANGE, FETCH_DRUGS, INTERVAL_DURATION_IN_DAYS_CHANGE,
  NEXT_DOSAGE_CHANGE, PRESCRIBED_QUANTITY_CHANGE,
  PrescriptionFormActions,
} from './actions';
import {
  INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE,
} from '../../redux/actions/taperConfig';

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
};

export const reducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => {
  return produce(state, (draft) => {
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
          draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity * action.data.intervalDurationDays;
        }
        break;

      case PRESCRIBED_QUANTITY_CHANGE:
        console.log('PRESCRIBED QUANTITY CHANGE  in PrescriptionForm');
        if (!(action.data.dosage.quantity < 0)
          && (action.data.dosage.quantity <= draft.nextDosagesQty[action.data.dosage.dosage] * action.data.intervalDurationDays)) {
          draft.prescribedDosagesQty[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case INTERVAL_DURATION_IN_DAYS_CHANGE:
        Object.entries(draft.prescribedDosagesQty).forEach(([k, v]) => {
          draft.prescribedDosagesQty[k] = draft.nextDosagesQty[k] * action.data!;
        });
        break;
    }
  });
};

export type PrescriptionFormReducer = typeof reducer;
