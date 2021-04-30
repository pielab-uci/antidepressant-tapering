import {PrescriptionFormState} from "./types";
import produce from "immer";
import {
  CHOOSE_BRAND,
  CHOOSE_FORM, CURRENT_DOSAGE_CHANGE, DRUG_NAME_CHANGE, FETCH_DRUGS,
  INTERVAL_COUNT_CHANGE, INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE,
  NEXT_DOSAGE_CHANGE,
  PrescriptionFormActions
} from "./actions";

export const initialState: PrescriptionFormState = {
  drugs: null,
  chosenDrug: null,
  chosenBrand: null,
  chosenDrugForm: null,
  brandOptions: [],
  drugFormOptions: [],
  dosageOptions: [],
  currentDosages: {},
  nextDosages: {},
  intervalCount: 0,
  intervalUnit: "Days",
  intervalStartDate: new Date(),
  intervalEndDate: null
}

export const reducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => {
  return produce(state, draft => {
    switch (action.type) {
      case FETCH_DRUGS:
        draft.drugs = action.data;
        break;

      case DRUG_NAME_CHANGE:
        const newDrug = draft.drugs!.find(drug => drug.name === action.data.name)!;
        draft.chosenDrug = newDrug;
        draft.chosenBrand = null;
        draft.chosenDrugForm = null;
        draft.drugFormOptions = [];
        draft.brandOptions = newDrug.options;
        break;

      case CHOOSE_BRAND:
        const chosenBrandOption = draft.brandOptions!.find(brand => brand.brand === action.data.brand)!;
        draft.chosenBrand = chosenBrandOption;
        draft.drugFormOptions = chosenBrandOption.forms;
        break;

      case CHOOSE_FORM:
        const chosenDrugForm = draft.drugFormOptions!.find(form => form.form === action.data.form)!;
        draft.chosenDrugForm = chosenDrugForm;
        draft.dosageOptions = chosenDrugForm.dosages;
        chosenDrugForm.dosages.forEach(dosage => {
          draft.currentDosages[dosage] = 0;
          draft.nextDosages[dosage] = 0;
        });
        break;

      case CURRENT_DOSAGE_CHANGE:
        if (action.data.dosage.quantity >= 0) {
          draft.currentDosages[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case NEXT_DOSAGE_CHANGE:
        if (!(action.data.dosage.quantity < 0)) {
          draft.nextDosages[action.data.dosage.dosage] = action.data.dosage.quantity;
        }
        break;

      case INTERVAL_START_DATE_CHANGE:
        draft.intervalStartDate = action.data.date;
        break;

      case INTERVAL_END_DATE_CHANGE:
        draft.intervalEndDate = action.data.date;
        break;

      case INTERVAL_UNIT_CHANGE:
        draft.intervalUnit = action.data.unit;
        break;

      case INTERVAL_COUNT_CHANGE:
        draft.intervalCount = action.data.count;
        break;

      default:
        return state;
    }
  })
}

export type PrescriptionFormReducer = typeof reducer;
