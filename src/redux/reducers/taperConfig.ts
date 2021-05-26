import produce from 'immer';
import { add, differenceInCalendarDays, sub } from 'date-fns';
import { Key } from 'react';
import {
  Drug, isCapsuleOrTablet, PrescribedDrug, TaperingConfiguration,
} from '../../types';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddOrUpdateTaperConfigFailureAction,
  AddOrUpdateTaperConfigRequestAction,
  AddOrUpdateTaperConfigSuccessAction,
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
  ShareWithPatientAppFailure,
  ShareWithPatientAppRequest,
  ShareWithPatientAppSuccess,
  ShareWithPatientEmailFailure,
  ShareWithPatientEmailRequest,
  ShareWithPatientEmailSuccess,
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
  FetchTaperConfigRequestAction,
  FetchTaperConfigSuccessAction,
  FetchTaperConfigFailureAction,
  FETCH_TAPER_CONFIG_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyTaperConfigPage,
  FetchPrescribedDrugsRequestAction,
  FetchPrescribedDrugsSuccessAction,
  FetchPrescribedDrugsFailureAction,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_PRESCRIBED_DRUGS_FAILURE,
  EMPTY_PRESCRIBED_DRUGS,
  EmptyPrescribedDrugs,
  ChangeNoteAndInstructions,
  CHANGE_NOTE_AND_INSTRUCTIONS,
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
  UPCOMING_DOSAGE_CHANGE, PRESCRIBED_QUANTITY_CHANGE,
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
  calcMinimumQuantityForDosage,
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
  scheduleSelectedRowKeys: Key[];
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
  scheduleSelectedRowKeys: [],
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
  | FetchTaperConfigRequestAction
  | FetchTaperConfigSuccessAction
  | FetchTaperConfigFailureAction
  | FetchPrescribedDrugsRequestAction
  | FetchPrescribedDrugsSuccessAction
  | FetchPrescribedDrugsFailureAction
  | AddOrUpdateTaperConfigRequestAction
  | AddOrUpdateTaperConfigSuccessAction
  | AddOrUpdateTaperConfigFailureAction
  | AddNewDrugFormAction
  | RemoveDrugFormAction
  | GenerateScheduleAction
  | ClearScheduleAction
  | ScheduleRowSelectedAction
  | ChangeMessageForPatient
  | ChangeNoteAndInstructions
  | ToggleShareProjectedScheduleWithPatient
  | ShareWithPatientAppRequest
  | ShareWithPatientAppSuccess
  | ShareWithPatientAppFailure
  | ShareWithPatientEmailRequest
  | ShareWithPatientEmailSuccess
  | ShareWithPatientEmailFailure
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
  prescribedDosages: {},
  intervalStartDate: new Date(),
  intervalEndDate: null,
  intervalCount: 0,
  intervalUnit: 'Days',
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
        break;

      case EMPTY_PRESCRIBED_DRUGS:
        draft.isInputComplete = false;
        draft.prescribedDrugs = null;
        draft.projectedSchedule = { drugs: [], data: [] };
        draft.instructionsForPatient = '';
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
        draft.scheduleSelectedRowKeys = draft.projectedSchedule.data
          .map((row, i) => (row.selected ? i : null))
          .filter((key) => key !== null) as number[];
        draft.projectedSchedule.data.forEach((row, i) => {
          if (row.selected) {
            draft.scheduleSelectedRowKeys.push(i);
          }
        });
        draft.instructionsForPatient = generateInstructionsForPatientFromSchedule(draft.projectedSchedule);
        draft.instructionsForPharmacy = generateInstructionsForPharmacy(draft.prescribedDrugs);
        draft.showInstructionsForPatient = true;
        draft.isSaved = false;
        break;
      }

      case CLEAR_SCHEDULE:
        draft.projectedSchedule = { data: [], drugs: [] };
        draft.scheduleChartData = [];
        draft.scheduleSelectedRowKeys = [];
        draft.showInstructionsForPatient = false;
        draft.instructionsForPharmacy = '';
        draft.instructionsForPatient = '';
        draft.isSaved = false;
        break;

      case SCHEDULE_ROW_SELECTED:
        draft.scheduleSelectedRowKeys = action.data;
        draft.projectedSchedule.data.forEach((row, i) => {
          if (action.data.includes(i)) {
            draft.projectedSchedule.data[i].selected = true;
          } else {
            draft.projectedSchedule.data[i].selected = false;
          }
        });
        draft.instructionsForPatient = generateInstructionsForPatientFromSchedule(draft.projectedSchedule);
        draft.isSaved = false;
        break;

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
        drug.prescribedDosages = {};
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
        drug.prescribedDosages = {};
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

        if (isCapsuleOrTablet(drug)) {
          drug.prescribedDosages[action.data.dosage.dosage] = action.data.dosage.quantity;
        } else {
          const dosageSum = drug.upcomingDosages[0].quantity / drug.oralDosageInfo!.rate.mg * drug.oralDosageInfo!.rate.ml;
          drug.prescribedDosages = calcMinimumQuantityForDosage(drug.oralDosageInfo!.bottles, dosageSum, null);
        }

        draft.isSaved = false;
        break;
      }

      case PRESCRIBED_QUANTITY_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.prescribedDosages[action.data.dosage.dosage] = action.data.dosage.quantity;
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
          drug.intervalCount = differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) + 1;
        }
        draft.isSaved = false;
        break;
      }

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalEndDate = action.data.date;
        drug.intervalUnit = 'Days';
        drug.intervalCount = differenceInCalendarDays(drug.intervalEndDate!, drug.intervalStartDate) + 1;
        draft.isSaved = false;
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalUnit = action.data.unit;
        drug.intervalEndDate = sub(
          add(drug.intervalStartDate, { [drug.intervalUnit.toLowerCase()]: drug.intervalCount }),
          { days: 1 },
        );
        draft.isSaved = false;
        break;
      }

      case INTERVAL_COUNT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalCount = action.data.count;
        drug.intervalEndDate = sub(
          add(drug.intervalStartDate, { [drug.intervalUnit.toLowerCase()]: drug.intervalCount }),
          { days: 1 },
        );
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

      default:
        return state;
    }
  });
};

export default taperConfigReducer;
