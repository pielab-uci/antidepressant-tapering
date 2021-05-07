import { TaperingConfiguration } from '../../types';

export const ADD_TAPER_CONFIG_REQUEST = 'ADD_TAPER_CONFIG_REQUEST' as const;
export const ADD_TAPER_CONFIG_SUCCESS = 'ADD_TAPER_CONFIG_SUCCESS' as const;
export const ADD_TAPER_CONFIG_FAILURE = 'ADD_TAPER_CONFIG_FAILURE' as const;

export interface AddTaperConfigRequestAction {
  type: typeof ADD_TAPER_CONFIG_REQUEST,
  data: any;
}

export interface AddTaperConfigSuccessAction {
  type: typeof ADD_TAPER_CONFIG_SUCCESS,
  data: TaperingConfiguration
}

export interface AddTaperConfigFailureAction {
  type: typeof ADD_TAPER_CONFIG_FAILURE,
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

export interface GenerateScheduleAction {
  type: typeof GENERATE_SCHEDULE
}

export interface ClearScheduleAction {
  type: typeof CLEAR_SCHEDULE
}

export const FETCH_PAST_SCHEDULE_DATA_REQUEST = 'FETCH_PAST_SCHEDULE_DATA_REQUEST' as const;
export const FETCH_PAST_SCHEDULE_DATA_SUCCESS = 'FETCH_PAST_SCHEDULE_DATA_SUCCESS' as const;
export const FETCH_PAST_SCHEDULE_DATA_FAILURE = 'FETCH_PAST_CHART_DATA_FAILURE' as const;

export interface FetchPastScheduleDataRequest {
  type: typeof FETCH_PAST_SCHEDULE_DATA_REQUEST,
  data: Date,
}

export interface FetchPastScheduleDataSuccess {
  type: typeof FETCH_PAST_SCHEDULE_DATA_SUCCESS
}

export interface FetchPastScheduleDataFailure {
  type: typeof FETCH_PAST_SCHEDULE_DATA_FAILURE
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
