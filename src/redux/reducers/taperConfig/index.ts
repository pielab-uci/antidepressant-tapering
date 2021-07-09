import {
  Drug, PrescribedDrug, Prescription, TaperingConfiguration,
} from '../../../types';
import { Schedule } from '../../../components/Schedule/ProjectedSchedule';
import { ScheduleChartData } from '../utils';
import {
  AddNewDrugFormAction, AddOrUpdateTaperConfigAyncActions,
  ChangeMessageForPatient,
  ChangeNoteAndInstructions,
  ClearScheduleAction, EditProjectedScheduleFromModal,
  EmptyPrescribedDrugs,
  EmptyTaperConfigPage, FetchPrescribedDrugAsyncActions, FetchTaperConfigAsyncActions,
  FinalPrescriptionQuantityChange,
  GenerateScheduleAction,
  InitTaperConfigAction, OpenModalAction,
  RemoveDrugFormAction,
  ScheduleRowSelectedAction, SetIsInputComplete, ShareWithPatientAppAsyncActions, ShareWithPatientEmailAsyncActions,
  TableEditingAction,
  ToggleShareProjectedScheduleWithPatient, UpdateChartAction, ValidateInputCompletionAction,
} from '../../actions/taperConfig';
import { PrescriptionFormActions } from '../../../components/PrescriptionForm/actions';
import drugs from '../drugs';

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

type TaperConfigAsyncActions =
  | FetchTaperConfigAsyncActions
  | FetchPrescribedDrugAsyncActions
  | AddOrUpdateTaperConfigAyncActions
  | ShareWithPatientAppAsyncActions
  | ShareWithPatientEmailAsyncActions;

export type TaperConfigActions =
  | InitTaperConfigAction
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
  | OpenModalAction
  | ValidateInputCompletionAction
  | EditProjectedScheduleFromModal
  | PrescriptionFormActions
  | TaperConfigAsyncActions;

export const emptyPrescribedDrug = (id: number): PrescribedDrug => ({
  id,
  name: '',
  brand: '',
  form: '',
  halfLife: '',
  measureUnit: 'mg',
  isModal: false,
  applyInSchedule: true,
  minDosageUnit: 0,
  priorDosages: [],
  priorDosageSum: null,
  allowChangePriorDosage: true,
  upcomingDosages: [],
  upcomingDosageSum: null,
  targetDosage: 0,
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
