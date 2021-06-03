import { Key } from 'react';
import { CellEditingStoppedEvent, RowNode, ValueSetterParams } from 'ag-grid-community';
import { PrescribedDrug, TaperingConfiguration } from '../../types';

export const GENERATE_SCHEDULE = 'GENERATE_SCHEDULE' as const;
export const CLEAR_SCHEDULE = 'CLEAR_SCHEDULE' as const;

export interface GenerateScheduleAction {
  type: typeof GENERATE_SCHEDULE,
  data: PrescribedDrug[]
}

export interface ClearScheduleAction {
  type: typeof CLEAR_SCHEDULE
}

export const INIT_NEW_TAPER_CONFIG = 'INIT_NEW_TAPER_CONFIG' as const;

export interface InitTaperConfigAction {
  type: typeof INIT_NEW_TAPER_CONFIG,
  data: { clinicianId: number, patientId: number }
}
export const EMPTY_TAPER_CONFIG_PAGE = 'EMPTY_TAPER_CONFIG_PAGE' as const;

export interface EmptyTaperConfigPage {
  type: typeof EMPTY_TAPER_CONFIG_PAGE,
  // data: number;
}

export const EMPTY_PRESCRIBED_DRUGS = 'EMPTY_PRESCRIBED_DRUGS' as const;

export interface EmptyPrescribedDrugs {
  type: typeof EMPTY_PRESCRIBED_DRUGS
}

export const ADD_OR_UPDATE_TAPER_CONFIG_REQUEST = 'ADD_OR_UPDATE_TAPER_CONFIG_REQUEST' as const;
export const ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS = 'ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS' as const;
export const ADD_OR_UPDATE_TAPER_CONFIG_FAILURE = 'ADD_OR_UPDATE_TAPER_CONFIG_FAILURE' as const;

export interface AddOrUpdateTaperConfigRequestAction {
  type: typeof ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  data: { taperConfigId?: number, clinicianId: number, patientId: number, prescribedDrugs: PrescribedDrug[] };
}

export const addOrUpdateTaperConfigRequest = (data: AddOrUpdateTaperConfigRequestAction['data']):AddOrUpdateTaperConfigRequestAction => ({
  type: ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  data,
});

export interface AddOrUpdateTaperConfigSuccessAction {
  type: typeof ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  data: TaperingConfiguration
}

export interface AddOrUpdateTaperConfigFailureAction {
  type: typeof ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  error: any;
}

export type AddOrUpdateTaperConfigAyncActions =
  | AddOrUpdateTaperConfigRequestAction
  | AddOrUpdateTaperConfigSuccessAction
  | AddOrUpdateTaperConfigFailureAction;

export const ADD_NEW_DRUG_FORM = 'ADD_NEW_DRUG_FORM' as const;
export const REMOVE_DRUG_FORM = 'REMOVE_DRUG_FORM' as const;

export interface AddNewDrugFormAction {
  type: typeof ADD_NEW_DRUG_FORM
}

export interface RemoveDrugFormAction {
  type: typeof REMOVE_DRUG_FORM,
  data: number;
}

export const SCHEDULE_ROW_SELECTED = 'SCHEDULE_ROW_SELECTED' as const;

export interface ScheduleRowSelectedAction {
  type: typeof SCHEDULE_ROW_SELECTED,
  data: (number|null)[];
}

export const FETCH_TAPER_CONFIG_REQUEST = 'FETCH_TAPER_CONFIG_REQUEST' as const;
export const FETCH_TAPER_CONFIG_SUCCESS = 'FETCH_TAPER_CONFIG_SUCCESS' as const;
export const FETCH_TAPER_CONFIG_FAILURE = 'FETCH_TAPER_CONFIG_FAILURE' as const;

export interface FetchTaperConfigRequestAction {
  type: typeof FETCH_TAPER_CONFIG_REQUEST,
  data: number,
}

export interface FetchTaperConfigSuccessAction {
  type: typeof FETCH_TAPER_CONFIG_SUCCESS
  data: TaperingConfiguration;
}

export interface FetchTaperConfigFailureAction {
  type: typeof FETCH_TAPER_CONFIG_FAILURE
  error: any;
}

export type FetchTaperConfigAsyncActions =
  | FetchTaperConfigRequestAction
  | FetchTaperConfigSuccessAction
  | FetchTaperConfigFailureAction;

export const FETCH_PRESCRIBED_DRUGS_REQUEST = 'FETCH_PRESCRIBED_DRUGS_REQUEST' as const;
export const FETCH_PRESCRIBED_DRUGS_SUCCESS = 'FETCH_PRESCRIBED_DRUGS_SUCCESS' as const;
export const FETCH_PRESCRIBED_DRUGS_FAILURE = 'FETCH_PRESCRIBED_DRUGS_FAILURE' as const;

export interface FetchPrescribedDrugsRequestAction {
  type: typeof FETCH_PRESCRIBED_DRUGS_REQUEST,
  data: number; // tapering configuration id
}

export interface FetchPrescribedDrugsSuccessAction {
  type: typeof FETCH_PRESCRIBED_DRUGS_SUCCESS,
  data: PrescribedDrug[];
}

export interface FetchPrescribedDrugsFailureAction {
  type: typeof FETCH_PRESCRIBED_DRUGS_FAILURE,
  error: any;
}

export type FetchPrescribedDrugAsyncActions =
  | FetchPrescribedDrugsRequestAction
  | FetchPrescribedDrugsSuccessAction
  | FetchPrescribedDrugsFailureAction;

export const SHARE_WITH_PATIENT_APP_REQUEST = 'SHARE_WITH_PATIENT_APP_REQUEST' as const;
export const SHARE_WITH_PATIENT_APP_SUCCESS = 'SHARE_WITH_PATIENT_APP_SUCCESS' as const;
export const SHARE_WITH_PATIENT_APP_FAILURE = 'SHARE_WITH_PATIENT_APP_FAILURE' as const;

export interface ShareWithPatientAppRequest {
  type: typeof SHARE_WITH_PATIENT_APP_REQUEST;
  data: { patientId: number; clinicianId: number }
}

export interface ShareWithPatientAppSuccess {
  type: typeof SHARE_WITH_PATIENT_APP_SUCCESS;
}

export interface ShareWithPatientAppFailure {
  type: typeof SHARE_WITH_PATIENT_APP_FAILURE,
  error: any;
}

export type ShareWithPatientAppAsyncActions =
  | ShareWithPatientAppRequest
  | ShareWithPatientAppSuccess
  | ShareWithPatientAppFailure;

export const SHARE_WITH_PATIENT_EMAIL_REQUEST = 'SHARE_WITH_PATIENT_EMAIL_REQUEST' as const;
export const SHARE_WITH_PATIENT_EMAIL_SUCCESS = 'SHARE_WITH_PATIENT_EMAIL_SUCCESS' as const;
export const SHARE_WITH_PATIENT_EMAIL_FAILURE = 'SHARE_WITH_PATIENT_EMAIL_FAILURE' as const;

export interface ShareWithPatientEmailRequest {
  type: typeof SHARE_WITH_PATIENT_EMAIL_REQUEST,
  data: { patientId: number; clinicianId: number }
}

export interface ShareWithPatientEmailSuccess {
  type: typeof SHARE_WITH_PATIENT_EMAIL_SUCCESS
}

export interface ShareWithPatientEmailFailure {
  type: typeof SHARE_WITH_PATIENT_EMAIL_FAILURE;
  error: any;
}

export type ShareWithPatientEmailAsyncActions =
  | ShareWithPatientEmailRequest
  | ShareWithPatientEmailSuccess
  | ShareWithPatientEmailFailure;

export const TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT = 'TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT' as const;

export interface ToggleShareProjectedScheduleWithPatient {
  type: typeof TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT;
}

export const CHANGE_MESSAGE_FOR_PATIENT = 'CHANGE_MESSAGE_FOR_PATIENT' as const;
export interface ChangeMessageForPatient {
  type: typeof CHANGE_MESSAGE_FOR_PATIENT,
  data: string;
}

export const changeMessageForPatient = (data:ChangeMessageForPatient['data']): ChangeMessageForPatient => ({
  type: CHANGE_MESSAGE_FOR_PATIENT,
  data,
});

export const CHANGE_NOTE_AND_INSTRUCTIONS = 'CHANGE_NOTE_AND_INSTRUCTIONS' as const;
export interface ChangeNoteAndInstructions {
  type: typeof CHANGE_NOTE_AND_INSTRUCTIONS,
  data: string;
}

export const changeNoteAndInstructions = (data: ChangeNoteAndInstructions['data']): ChangeNoteAndInstructions => ({
  type: CHANGE_NOTE_AND_INSTRUCTIONS,
  data,
});

export const PRESCRIBED_QUANTITY_CHANGE = 'PRESCRIBED_QUANTITY_CHANGE' as const;

export interface PrescribedQuantityChange {
  type: typeof PRESCRIBED_QUANTITY_CHANGE,
  data: { id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number }
}

export const prescribedQuantityChange = (data: PrescribedQuantityChange['data']): PrescribedQuantityChange => ({
  type: PRESCRIBED_QUANTITY_CHANGE,
  data,
});

export const TABLE_START_DATE_EDITED = 'TABLE_START_DATE_EDITED' as const;

export interface TableStartDateEditedAction {
  type: typeof TABLE_START_DATE_EDITED;
  data: CellEditingStoppedEvent;
}

export const TABLE_END_DATE_EDITED = 'TABLE_END_DATE_EDITED' as const;

export interface TableEndDateEditedAction {
  type: typeof TABLE_END_DATE_EDITED,
  data: CellEditingStoppedEvent;
}

export const TABLE_DOSAGE_EDITED = 'TABLE_DOSAGE_EDITED' as const;

export interface TableDosageEditedAction {
  type: typeof TABLE_DOSAGE_EDITED,
  data: CellEditingStoppedEvent;
}

export type TableEditingAction =
  | TableStartDateEditedAction
  | TableEndDateEditedAction
  | TableDosageEditedAction;
