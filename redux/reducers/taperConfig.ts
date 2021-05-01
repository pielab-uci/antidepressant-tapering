import {Drug, PrescribedDrug, TaperingConfiguration} from "../../types";
import {
  ADD_TAPER_CONFIG_FAILURE,
  ADD_TAPER_CONFIG_REQUEST, ADD_TAPER_CONFIG_SUCCESS,
  AddTaperConfigFailureAction,
  AddTaperConfigRequestAction,
  AddTaperConfigSuccessAction, CLEAR_SCHEDULE, ClearScheduleAction, GENERATE_SCHEDULE, GenerateScheduleAction
} from "../actions/taperConfig";
import produce from "immer";
import {drugs} from "./drugs";
import {
  ADD_NEW_DRUG_FORM,
  AddNewDrugFormAction,
  REMOVE_DRUG_FORM,
  RemoveDrugFormAction
} from "../actions/taperConfig";
import {
  CHOOSE_BRAND,
  CHOOSE_FORM,
  ChooseBrandAction,
  ChooseFormAction,
  CURRENT_DOSAGE_CHANGE,
  CurrentDosageChangeAction,
  DRUG_NAME_CHANGE,
  DrugNameChangeAction,
  INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE,
  INTERVAL_UNIT_CHANGE,
  IntervalCountChangeAction,
  IntervalEndDateChangeAction,
  IntervalStartDateChangeAction,
  IntervalUnitChangeAction,
  NEXT_DOSAGE_CHANGE,
  NextDosageChangeAction, PrescriptionFormActions
} from "../../components/PrescriptionForm/actions";
import {add, format, isAfter, isWithinInterval} from "date-fns";
import {TableRow} from "../../components/ProjectedScheduleTable";
import scheduleGenerator from "./scheduleGenerator";

export interface TaperConfigState {
  drugs: Drug[];
  taperConfigs: TaperingConfiguration[];
  lastPrescriptionFormId: number;
  prescriptionFormIds: number[];
  prescribedDrugs: PrescribedDrug[];

  scheduleTableData: TableRow[];

  addingTaperConfig: boolean;
  addedTaperConfig: boolean;
  addingTaperConfigError: any;
}

export const initialState: TaperConfigState =
  {
    drugs,
    taperConfigs: [],
    lastPrescriptionFormId: 0,
    prescriptionFormIds: [0],
    prescribedDrugs: [{
      id: 0,
      name: '',
      brand: '',
      form: '',
      currentDosages: [],
      nextDosages: [],
      intervalStartDate: new Date(),
      intervalEndDate: null,
      intervalCount: 0,
      intervalUnit: "Days",
    }],
    scheduleTableData: [],
    addingTaperConfig: false,
    addedTaperConfig: false,
    addingTaperConfigError: null
  }


export type TaperConfigActions =
  | AddTaperConfigRequestAction
  | AddTaperConfigSuccessAction
  | AddTaperConfigFailureAction
  | AddNewDrugFormAction
  | RemoveDrugFormAction
  | GenerateScheduleAction
  | ClearScheduleAction
  | PrescriptionFormActions;



const taperConfigReducer = (state: TaperConfigState = initialState, action: TaperConfigActions) => {
  return produce(state, draft => {
    switch (action.type) {
      case ADD_TAPER_CONFIG_REQUEST:
        draft.addingTaperConfig = true;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = null;
        break;

      case ADD_TAPER_CONFIG_SUCCESS:
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = true;
        draft.taperConfigs.unshift(action.data);
        break;

      case ADD_TAPER_CONFIG_FAILURE:
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = action.error;
        break;

      case ADD_NEW_DRUG_FORM:
        draft.prescriptionFormIds.push(draft.lastPrescriptionFormId + 1);
        draft.prescribedDrugs.push({
          id: draft.lastPrescriptionFormId + 1,
          name: '',
          brand: '',
          form: '',
          currentDosages: [],
          nextDosages: [],
          intervalStartDate: new Date(),
          intervalEndDate: null,
          intervalCount: 0,
          intervalUnit: "Days",
        });
        draft.lastPrescriptionFormId += 1;
        break;

      case REMOVE_DRUG_FORM:
        draft.prescriptionFormIds = draft.prescriptionFormIds.filter(id => id !== action.data);
        draft.prescribedDrugs = draft.prescribedDrugs.filter(drug => drug.id !== action.data);
        break;

      case GENERATE_SCHEDULE:
        draft.scheduleTableData = scheduleGenerator(draft.prescribedDrugs);
        break;

      case CLEAR_SCHEDULE:
        draft.scheduleTableData = [];
        break;

      case DRUG_NAME_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.name = action.data.name;
        drug.brand = '';
        drug.form = '';
        drug.currentDosages = [];
        drug.nextDosages = [];
        break;
      }

      case CHOOSE_BRAND: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.brand = action.data.brand;
        drug.form = '';
        drug.currentDosages = [];
        drug.nextDosages = [];
        break;
      }

      case CHOOSE_FORM: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.form = action.data.form;
        drug.currentDosages = [];
        drug.nextDosages = [];
        break;
      }

      case CURRENT_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!
        const idx = drug.currentDosages.findIndex(curDosage => curDosage.dosage == action.data.dosage.dosage);
        if (idx === -1) {
          drug.currentDosages.push(action.data.dosage);
        } else {
          drug.currentDosages[idx] = action.data.dosage;
        }
        break;
      }

      case NEXT_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        const idx = drug.nextDosages.findIndex(nextDosage => nextDosage.dosage === action.data.dosage.dosage);
        if (idx === -1) {
          drug.nextDosages.push(action.data.dosage);
        } else {
          drug.nextDosages[idx] = action.data.dosage;
        }
        break;
      }

      case INTERVAL_START_DATE_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.intervalStartDate = action.data.date;
      }
        break;

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.intervalEndDate = action.data.date;
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.intervalUnit = action.data.unit;
        break;
      }

      case INTERVAL_COUNT_CHANGE: {
        const drug = draft.prescribedDrugs.find(drug => drug.id === action.data.id)!;
        drug.intervalCount = action.data.count;
        break;
      }

      default:
        return state;
    }
  })
}

export default taperConfigReducer;
