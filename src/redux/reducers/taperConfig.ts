import produce from 'immer';
import { RowNode } from 'ag-grid-community';
import {
  Drug, PrescribedDrug, Prescription, TaperingConfiguration, ValueOf,
} from '../../types';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  CLEAR_SCHEDULE,
  ClearScheduleAction,
  GENERATE_SCHEDULE,
  GenerateScheduleAction,
  SHARE_WITH_PATIENT_APP_FAILURE,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_APP_SUCCESS,
  SHARE_WITH_PATIENT_EMAIL_FAILURE,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_SUCCESS,
  ADD_NEW_DRUG_FORM,
  AddNewDrugFormAction,
  REMOVE_DRUG_FORM,
  RemoveDrugFormAction,
  ToggleShareProjectedScheduleWithPatient,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
  CHANGE_MESSAGE_FOR_PATIENT,
  ChangeMessageForPatient,
  ScheduleRowSelectedAction,
  SCHEDULE_ROW_SELECTED,
  InitTaperConfigAction,
  INIT_NEW_TAPER_CONFIG,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyTaperConfigPage,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_PRESCRIBED_DRUGS_FAILURE,
  EMPTY_PRESCRIBED_DRUGS,
  EmptyPrescribedDrugs,
  ChangeNoteAndInstructions,
  CHANGE_NOTE_AND_INSTRUCTIONS,
  PRESCRIBED_QUANTITY_CHANGE,
  PrescribedQuantityChange,
  AddOrUpdateTaperConfigAyncActions,
  FetchTaperConfigAsyncActions,
  FetchPrescribedDrugAsyncActions,
  ShareWithPatientAppAsyncActions,
  ShareWithPatientEmailAsyncActions,
  TableEditingAction,
  TABLE_DOSAGE_EDITED,
  TABLE_START_DATE_EDITED,
  TABLE_END_DATE_EDITED,
} from '../actions/taperConfig';
import drugs from './drugs';

import {
  CHOOSE_BRAND,
  CHOOSE_FORM,
  PRIOR_DOSAGE_CHANGE,
  INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE,
  INTERVAL_UNIT_CHANGE,
  ALLOW_SPLITTING_UNSCORED_TABLET,
  UPCOMING_DOSAGE_CHANGE,
  PrescriptionFormActions,
} from '../../components/PrescriptionForm/actions';
import { Schedule } from '../../components/Schedule/ProjectedSchedule';
import {
  chartDataConverter,
  ScheduleChartData,
  scheduleGenerator,
  generateInstructionsForPatientFromSchedule,
  isCompleteDrugInput,
  generateInstructionsForPharmacy,
} from './utils';

export interface TaperConfigState {
  clinicianId: number;
  patientId: number;
  drugs: Drug[];
  taperConfigs: TaperingConfiguration[];
  taperConfigId: number | null;
  taperConfigCreatedAt: Date | null;
  lastPrescriptionFormId: number;
  prescriptionFormIds: number[];
  prescribedDrugs: PrescribedDrug[] | null;
  isSaved: boolean;

  projectedSchedule: Schedule;
  scheduleChartData: ScheduleChartData;
  tableSelectedRows: (number | null)[];
  finalPrescription: Prescription;
  isInputComplete: boolean;

  intervalDurationDays: number,

  instructionsForPatient: string;
  instructionsForPharmacy: string;

  shareProjectedScheduleWithPatient: boolean;
  showInstructionsForPatient: boolean;

  fetchingTaperConfig: boolean;
  fetchedTaperConfig: boolean;
  fetchingTaperConfigError: any;

  fetchingPrescribedDrugs: boolean;
  fetchedPrescribedDrugs: boolean;
  fetchingPrescribedDrugsError: any;

  addingTaperConfig: boolean;
  addedTaperConfig: boolean;
  addingTaperConfigError: any;

  sharingWithPatientApp: boolean;
  sharedWithPatientApp: boolean;
  sharingWithPatientAppError: any;

  sharingWithPatientEmail: boolean;
  sharedWithPatientEmail: boolean;
  sharingWithPatientEmailError: any;
}

export const initialState: TaperConfigState = {
  drugs,
  clinicianId: -1,
  patientId: -1,
  taperConfigs: [],
  taperConfigId: null,
  taperConfigCreatedAt: null,
  lastPrescriptionFormId: 0,
  prescriptionFormIds: [0],
  isSaved: false,
  prescribedDrugs: null,

  projectedSchedule: { data: [], drugs: [] },
  scheduleChartData: [],
  tableSelectedRows: [],
  finalPrescription: [],
  isInputComplete: false,

  intervalDurationDays: 0,

  instructionsForPatient: '',
  instructionsForPharmacy: '',

  shareProjectedScheduleWithPatient: false,
  showInstructionsForPatient: false,

  fetchingTaperConfig: false,
  fetchedTaperConfig: false,
  fetchingTaperConfigError: null,

  fetchingPrescribedDrugs: false,
  fetchedPrescribedDrugs: false,
  fetchingPrescribedDrugsError: null,

  addingTaperConfig: false,
  addedTaperConfig: false,
  addingTaperConfigError: null,

  sharingWithPatientApp: false,
  sharedWithPatientApp: false,
  sharingWithPatientAppError: null,

  sharingWithPatientEmail: false,
  sharedWithPatientEmail: false,
  sharingWithPatientEmailError: null,
};

export type TaperConfigActions =
  | InitTaperConfigAction
  | EmptyTaperConfigPage
  | EmptyPrescribedDrugs
  | FetchTaperConfigAsyncActions
  | FetchPrescribedDrugAsyncActions
  | AddOrUpdateTaperConfigAyncActions
  | AddNewDrugFormAction
  | RemoveDrugFormAction
  | GenerateScheduleAction
  | ClearScheduleAction
  | ScheduleRowSelectedAction
  | ChangeMessageForPatient
  | ChangeNoteAndInstructions
  | ToggleShareProjectedScheduleWithPatient
  | ShareWithPatientAppAsyncActions
  | ShareWithPatientEmailAsyncActions
  | PrescribedQuantityChange
  | TableEditingAction
  | PrescriptionFormActions;

const emptyPrescribedDrug = (id: number): PrescribedDrug => ({
  id,
  name: '',
  brand: '',
  form: '',
  measureUnit: 'mg',
  minDosageUnit: 0,
  priorDosages: [],
  upcomingDosages: [],
  availableDosageOptions: [],
  regularDosageOptions: [],
  allowSplittingUnscoredTablet: false,
  intervalStartDate: new Date(),
  intervalEndDate: null,
  intervalCount: 0,
  intervalUnit: 'Days',
  intervalDurationDays: 0,
  prevVisit: false,
  prescribedAt: new Date(),
});

const taperConfigReducer = (state: TaperConfigState = initialState, action: TaperConfigActions) => {
  console.log('taperConfigAction: ', action);
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT_NEW_TAPER_CONFIG:
        draft.clinicianId = action.data.clinicianId;
        draft.patientId = action.data.patientId;
        draft.taperConfigCreatedAt = null;
        draft.lastPrescriptionFormId += 1;
        draft.prescribedDrugs = [emptyPrescribedDrug(draft.lastPrescriptionFormId)];
        draft.isSaved = false;
        break;

      case EMPTY_TAPER_CONFIG_PAGE:
        draft.taperConfigId = null;
        draft.taperConfigCreatedAt = null;
        draft.scheduleChartData = [];
        draft.isInputComplete = false;
        draft.prescribedDrugs = draft.prescribedDrugs!.filter((drug) => isCompleteDrugInput(drug));
        draft.projectedSchedule = { drugs: [], data: [] };
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        break;

      case EMPTY_PRESCRIBED_DRUGS:
        draft.isInputComplete = false;
        draft.prescribedDrugs = null;
        draft.projectedSchedule = { drugs: [], data: [] };
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        draft.scheduleChartData = [];
        break;

      case ADD_OR_UPDATE_TAPER_CONFIG_REQUEST:
        draft.addingTaperConfig = true;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = null;
        break;

      case ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS: {
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = true;
        draft.taperConfigId = action.data.id;
        draft.taperConfigCreatedAt = action.data.createdAt;
        draft.prescribedDrugs!.forEach((drug) => {
          drug.prescribedAt = action.data.createdAt;
        });
        draft.isSaved = true;
        break;
      }

      case ADD_OR_UPDATE_TAPER_CONFIG_FAILURE:
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = action.error;
        break;

      case FETCH_TAPER_CONFIG_REQUEST:
        draft.fetchingTaperConfig = true;
        draft.fetchedTaperConfig = false;
        draft.fetchingTaperConfigError = null;
        break;

      case FETCH_TAPER_CONFIG_SUCCESS:
        draft.fetchingTaperConfig = false;
        draft.fetchedTaperConfig = true;
        draft.clinicianId = action.data.clinicianId;
        draft.patientId = action.data.patientId;
        draft.prescribedDrugs = action.data.prescribedDrugs;
        draft.lastPrescriptionFormId = Math.max(...action.data.prescribedDrugs.map((drug) => drug.id));
        draft.isSaved = false;
        break;

      case FETCH_TAPER_CONFIG_FAILURE:
        draft.fetchingTaperConfig = false;
        draft.fetchingTaperConfigError = action.error;
        break;

      case FETCH_PRESCRIBED_DRUGS_REQUEST:
        draft.fetchingPrescribedDrugs = true;
        draft.fetchedPrescribedDrugs = false;
        draft.fetchingPrescribedDrugsError = false;
        break;

      case FETCH_PRESCRIBED_DRUGS_SUCCESS:
        draft.fetchingPrescribedDrugs = false;
        draft.fetchedPrescribedDrugs = true;
        draft.prescribedDrugs = action.data;
        break;

      case FETCH_PRESCRIBED_DRUGS_FAILURE:
        draft.fetchingPrescribedDrugs = false;
        draft.fetchingPrescribedDrugsError = action.error;
        break;

      case ADD_NEW_DRUG_FORM:
        draft.prescriptionFormIds.push(draft.lastPrescriptionFormId + 1);
        draft.prescribedDrugs!.push(emptyPrescribedDrug(draft.lastPrescriptionFormId + 1));
        draft.isInputComplete = false;
        draft.lastPrescriptionFormId += 1;
        draft.showInstructionsForPatient = false;
        draft.isSaved = false;
        break;

      case REMOVE_DRUG_FORM:
        draft.prescriptionFormIds = draft.prescriptionFormIds.filter((id) => id !== action.data);
        draft.prescribedDrugs = draft.prescribedDrugs!.filter((drug) => drug.id !== action.data);
        draft.isSaved = false;
        break;

      case GENERATE_SCHEDULE: {
        draft.projectedSchedule = scheduleGenerator(action.data);
        draft.scheduleChartData = chartDataConverter(draft.projectedSchedule);
        draft.instructionsForPatient = generateInstructionsForPatientFromSchedule(draft.projectedSchedule);
        draft.instructionsForPharmacy = generateInstructionsForPharmacy(draft.prescribedDrugs);
        draft.showInstructionsForPatient = true;
        draft.isSaved = false;
        break;
      }

      case CLEAR_SCHEDULE:
        draft.projectedSchedule = { data: [], drugs: [] };
        draft.scheduleChartData = [];
        // draft.scheduleSelectedRowKeys = [];
        draft.showInstructionsForPatient = false;
        draft.instructionsForPharmacy = '';
        draft.instructionsForPatient = '';
        draft.isSaved = false;
        break;

      case SCHEDULE_ROW_SELECTED: {
        draft.tableSelectedRows = action.data;
        draft.projectedSchedule.data.forEach((row, i) => {
          if (draft.tableSelectedRows.includes(i)) {
            row.selected = true;
          } else {
            row.selected = false;
          }
        });
        draft.finalPrescription = draft.projectedSchedule.data
          .filter((row, i) => draft.tableSelectedRows.includes(i))
          .reduce((prev, row) => {
            if (!prev[row.prescribedDrugId]) {
              const obj: ValueOf<Prescription> = { name: '', brand: '', dosageQty: {} };
              obj.name = row.drug;
              obj.brand = row.brand;
              obj.dosageQty = Object.entries(row.initiallyCalculatedDosages)
                .reduce((dosages, [dosage, qty]) => {
                  if (!dosages[dosage]) {
                    dosages[dosage] = qty * row.intervalDurationDays;
                  } else {
                    dosages[dosage] += qty * row.intervalDurationDays;
                  }
                  return dosages;
                }, {} as { [dosage: string]: number });
              prev[row.prescribedDrugId] = obj;
            } else {
              Object.entries(row.initiallyCalculatedDosages)
                .forEach(([dosage, qty]) => {
                  if (!prev[row.prescribedDrugId].dosageQty[dosage]) {
                    prev[row.prescribedDrugId].dosageQty[dosage] = qty * row.intervalDurationDays;
                  } else {
                    prev[row.prescribedDrugId].dosageQty[dosage] += qty * row.intervalDurationDays;
                  }
                });
            }

            return prev;
          }, {} as Prescription);
        break;
      }

      case CHANGE_MESSAGE_FOR_PATIENT:
        draft.instructionsForPatient = action.data;
        break;

      case CHANGE_NOTE_AND_INSTRUCTIONS:
        draft.instructionsForPharmacy = action.data;
        break;

      case TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT:
        draft.shareProjectedScheduleWithPatient = !draft.shareProjectedScheduleWithPatient;
        break;

      case CHOOSE_BRAND: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.name = draft.drugs.find(
          (d) => d.options.find(
            (option) => option.brand === action.data.brand,
          ),
        )!.name;
        drug.brand = action.data.brand;
        drug.form = '';
        drug.oralDosageInfo = null;
        drug.priorDosages = [];
        drug.upcomingDosages = [];
        draft.isInputComplete = false;
        draft.isSaved = false;
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        draft.showInstructionsForPatient = false;
        break;
      }

      case CHOOSE_FORM: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.form = action.data.form;
        drug.minDosageUnit = action.data.minDosageUnit!;
        drug.priorDosages = [];
        drug.upcomingDosages = [];
        drug.availableDosageOptions = action.data.availableDosageOptions!;
        drug.regularDosageOptions = action.data.regularDosageOptions!;
        draft.isInputComplete = false;
        draft.isSaved = false;
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';

        if (drug.form === 'oral solution' || drug.form === 'oral suspension') {
          drug.oralDosageInfo = action.data.oralDosageInfo;
        } else {
          drug.oralDosageInfo = null;
        }

        break;
      }

      case PRIOR_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const idx = drug.priorDosages.findIndex(
          (curDosage) => curDosage.dosage === action.data.dosage.dosage,
        );

        if (idx === -1) {
          drug.priorDosages.push(action.data.dosage);
        } else {
          drug.priorDosages[idx] = action.data.dosage;
        }
        draft.isSaved = false;
        break;
      }

      case UPCOMING_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const idx = drug.upcomingDosages.findIndex(
          (nextDosage) => nextDosage.dosage === action.data.dosage.dosage,
        );

        if (idx === -1) {
          drug.upcomingDosages.push(action.data.dosage);
        } else {
          drug.upcomingDosages[idx] = action.data.dosage;
        }

        draft.isSaved = false;
        break;
      }

      case PRESCRIBED_QUANTITY_CHANGE: {
        // TODO: change finalPrescription in this event
        // draft.finalPrescription
        draft.isSaved = false;
        break;
      }

      case ALLOW_SPLITTING_UNSCORED_TABLET: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.allowSplittingUnscoredTablet = action.data.allow;
        draft.isSaved = false;
        break;
      }

      case INTERVAL_START_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalStartDate = new Date(action.data.date.valueOf() + action.data.date.getTimezoneOffset() * 60 * 1000);

        if (drug.intervalEndDate) {
          drug.intervalUnit = 'Days';
          drug.intervalCount = action.data.intervalDurationDays;
          drug.intervalDurationDays = action.data.intervalDurationDays;
        }
        draft.isSaved = false;
        break;
      }

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalEndDate = action.data.date;
        drug.intervalUnit = 'Days';
        drug.intervalCount = action.data.intervalDurationDays;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isSaved = false;
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalUnit = action.data.unit;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isSaved = false;
        break;
      }

      case INTERVAL_COUNT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalCount = action.data.count;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isSaved = false;
        break;
      }

      case SHARE_WITH_PATIENT_APP_REQUEST:
        draft.sharingWithPatientApp = true;
        draft.sharedWithPatientApp = false;
        draft.sharingWithPatientAppError = null;
        break;

      case SHARE_WITH_PATIENT_APP_SUCCESS:
        draft.sharingWithPatientApp = false;
        draft.sharedWithPatientApp = true;
        break;

      case SHARE_WITH_PATIENT_APP_FAILURE:
        draft.sharingWithPatientApp = false;
        draft.sharingWithPatientAppError = action.error;
        break;

      case SHARE_WITH_PATIENT_EMAIL_REQUEST:
        draft.sharingWithPatientEmail = true;
        draft.sharedWithPatientEmail = false;
        draft.sharingWithPatientEmailError = null;
        break;

      case SHARE_WITH_PATIENT_EMAIL_SUCCESS:
        draft.sharingWithPatientEmail = false;
        draft.sharedWithPatientEmail = true;
        break;

      case SHARE_WITH_PATIENT_EMAIL_FAILURE:
        draft.sharingWithPatientEmail = false;
        draft.sharingWithPatientEmailError = action.error;
        break;

      case TABLE_DOSAGE_EDITED:
        if (action.data.rowIndex !== null) {
          draft.projectedSchedule.data[action.data.rowIndex].dosage = parseFloat(action.data.newValue);
        }
        break;

      case TABLE_START_DATE_EDITED:
        if (action.data.rowIndex !== null) {
          draft.projectedSchedule.data[action.data.rowIndex].startDate = action.data.newValue;
        }
        break;

      case TABLE_END_DATE_EDITED:
        if (action.data.rowIndex !== null) {
          draft.projectedSchedule.data[action.data.rowIndex].endDate = action.data.newValue;
        }
        break;

      default:
        return state;
    }
  });
};
export default taperConfigReducer;
