import { Key } from 'react';
import { PrescribedDrug, TaperingConfiguration } from '../../types';

export const SET_CLINICIAN_PATIENT = 'SET_CLINICIAN_PATIENT' as const;

export interface SetClinicianPatientAction {
  type: typeof SET_CLINICIAN_PATIENT,
  data: { clinicianId: number, patientId: number }
}

export const ADD_OR_UPDATE_TAPER_CONFIG_REQUEST = 'ADD_TAPER_CONFIG_REQUEST' as const;
export const ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS = 'ADD_TAPER_CONFIG_SUCCESS' as const;
export const ADD_OR_UPDATE_TAPER_CONFIG_FAILURE = 'ADD_TAPER_CONFIG_FAILURE' as const;

export interface AddOrUpdateTaperConfigRequestAction {
  type: typeof ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  data: { clinicianId: number, patientId: number, prescribedDrugs: PrescribedDrug[] };
}

export const addOrUpdateTaperConfigRequest = (data: { clinicianId: number, patientId: number, prescribedDrugs: PrescribedDrug[] }):AddOrUpdateTaperConfigRequestAction => ({
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

export const ADD_NEW_DRUG_FORM = 'ADD_NEW_DRUG_FORM' as const;
export const REMOVE_DRUG_FORM = 'REMOVE_DRUG_FORM' as const;

export interface AddNewDrugFormAction {
  type: typeof ADD_NEW_DRUG_FORM
}

export interface RemoveDrugFormAction {
  type: typeof REMOVE_DRUG_FORM,
  data: number;
}

export const GENERATE_SCHEDULE = 'GENERATE_SCHEDULE' as const;
export const CLEAR_SCHEDULE = 'CLEAR_SCHEDULE' as const;
export const SCHEDULE_ROW_SELECTED = 'SCHEDULE_ROW_SELECTED' as const;

export interface GenerateScheduleAction {
  type: typeof GENERATE_SCHEDULE
}

export interface ClearScheduleAction {
  type: typeof CLEAR_SCHEDULE
}

export interface ScheduleRowSelectedAction {
  type: typeof SCHEDULE_ROW_SELECTED,
  // data: (TableRow & { startDate: Date, endDate: Date, key: number })[]
  data: Key[]
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

export const TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT = 'TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT' as const;

export interface ToggleShareProjectedScheduleWithPatient {
  type: typeof TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT;
}

export const CHANGE_MESSAGE_FOR_PATIENT = 'CHANGE_MESSAGE_FOR_PATIENT' as const;
export interface ChangeMessageForPatient {
  type: typeof CHANGE_MESSAGE_FOR_PATIENT,
  data: string;
}

export const changeMessageForPatient = (data:string): ChangeMessageForPatient => ({
  type: CHANGE_MESSAGE_FOR_PATIENT,
  data,
});
