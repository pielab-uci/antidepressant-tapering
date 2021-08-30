import add from 'date-fns/esm/add';
import {
  Drug, PrescribedDrug, Prescription, TaperingConfiguration,
} from '../../../types';
import { Schedule } from '../../../components/Schedule/ProjectedSchedule';
import { ScheduleChartData } from '../../../utils/taperConfig';
import {
  AddNewDrugFormAction, AddOrUpdateTaperConfigAyncActions,
  ChangeMessageForPatient,
  ChangeNoteAndInstructions,
  ClearScheduleAction, EditProjectedScheduleFromModal,
  EmptyPrescribedDrugs,
  EmptyTaperConfigPage, FetchPrescribedDrugAsyncActions, FetchTaperConfigAsyncActions,
  FinalPrescriptionQuantityChange,
  GenerateScheduleAction,
  InitNewTaperConfigAction, OpenModalAction,
  RemoveDrugFormAction,
  ScheduleRowSelectedAction, SetIsInputComplete, ShareWithPatientAppAsyncActions, ShareWithPatientEmailAsyncActions,
  TableEditingAction,
  ToggleShareProjectedScheduleWithPatient, UpdateChartAction, ValidateInputCompletionAction,
} from '../../actions/taperConfig';
import { PrescriptionFormActions, SetGrowthAction } from '../../../components/PrescriptionForm/actions';
import drugs from '../drugs';
import { SetCurrentPatientAction } from '../../actions/user';

export interface TaperConfigState {
  clinicianId: number;
  patientId: number;
  drugs: Drug[];
  chosenDrugs: { [prescribedDrugId: number]: { drug: string, brand: string } };
  taperConfigs: TaperingConfiguration[];
  currentTaperConfigId: number | null;
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

type TaperConfigAsyncActions =
  | FetchTaperConfigAsyncActions
  | FetchPrescribedDrugAsyncActions
  | AddOrUpdateTaperConfigAyncActions
  | ShareWithPatientAppAsyncActions
  | ShareWithPatientEmailAsyncActions;

export type TaperConfigActions =
  | InitNewTaperConfigAction
  | EmptyTaperConfigPage
  | EmptyPrescribedDrugs
  | AddNewDrugFormAction
  | RemoveDrugFormAction
  | GenerateScheduleAction
  | ClearScheduleAction
  | ScheduleRowSelectedAction
  | ChangeMessageForPatient
  | ChangeNoteAndInstructions
  | ToggleShareProjectedScheduleWithPatient
  | FinalPrescriptionQuantityChange
  | TableEditingAction
  | UpdateChartAction
  | SetIsInputComplete
  | SetGrowthAction
  | OpenModalAction
  | SetCurrentPatientAction
  | ValidateInputCompletionAction
  | EditProjectedScheduleFromModal
  | PrescriptionFormActions
  | TaperConfigAsyncActions;

export const emptyPrescribedDrug = (id: number): PrescribedDrug => ({
  id,
  name: '',
  brand: '',
  form: null,
  currentDosageForm: null,
  nextDosageForm: null,
  currentOralDosageInfo: null,
  nextOralDosageInfo: null,
  oralDosageInfo: null,
  halfLife: '',
  measureUnit: 'mg',
  isModal: false,
  applyInSchedule: true,
  minDosageUnit: 0,
  currentDosages: [],
  currentDosageSum: 0,
  allowChangePriorDosage: true,
  nextDosages: [],
  nextDosageSum: 0,
  targetDosage: 0,
  growth: 'linear',
  availableDosageOptions: [],
  regularDosageOptions: [],
  allowSplittingUnscoredTablet: false,
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
  prevVisit: false,
  prescribedAt: new Date(),
});

export const initialState: TaperConfigState = {
  drugs,
  clinicianId: -1,
  patientId: -1,
  taperConfigs: [],
  chosenDrugs: [],
  currentTaperConfigId: null,
  taperConfigCreatedAt: null,
  lastPrescriptionFormId: 0,
  prescriptionFormIds: [0],
  isSaved: false,
  prescribedDrugs: null,

  projectedSchedule: { data: [], drugs: [] },
  scheduleChartData: [],
  tableSelectedRows: [],
  finalPrescription: {},
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
