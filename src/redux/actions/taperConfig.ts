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
  data: { startDate: Date, endDate: Date };
}

export const changeMessageForPatient = (data: { startDate: Date, endDate: Date }): ChangeMessageForPatient => ({
  type: CHANGE_MESSAGE_FOR_PATIENT,
  data,
});

export const INTERVAL_START_DATE_CHANGE = 'INTERVAL_START_DATE_CHANGE' as const;

export interface IntervalStartDateChangeAction {
  type: typeof INTERVAL_START_DATE_CHANGE,
  data: { date: Date, intervalDurationDays?: number } ;
}

export const intervalStartDateChange = (data: { date: Date, intervalDurationDays?: number }): IntervalStartDateChangeAction => ({
  type: INTERVAL_START_DATE_CHANGE,
  data,
});

export const INTERVAL_END_DATE_CHANGE = 'INTERVAL_END_DATE_CHANGE' as const;

export interface IntervalEndDateChangeAction {
  type: typeof INTERVAL_END_DATE_CHANGE,
  data: { date: Date | null; intervalDurationDays?: number }
}

export const intervalEndDateChange = (data: { date: Date | null, intervalDurationDays?: number }): IntervalEndDateChangeAction => ({
  type: INTERVAL_END_DATE_CHANGE,
  data,
});

export const INTERVAL_COUNT_CHANGE = 'INTERVAL_COUNT_CHANGE' as const;

export interface IntervalCountChangeAction {
  type: typeof INTERVAL_COUNT_CHANGE,
  data: { count: number, intervalDurationDays?: number }
}

export const intervalCountChange = (data: { count: number, intervalDurationDays?: number }): IntervalCountChangeAction => ({
  type: INTERVAL_COUNT_CHANGE,
  data,
});

export const INTERVAL_UNIT_CHANGE = 'INTERVAL_UNIT_CHANGE' as const;

export interface IntervalUnitChangeAction {
  type: typeof INTERVAL_UNIT_CHANGE;
  data: { unit: 'Days' | 'Weeks' | 'Months', intervalDurationDays?: number }
}

export const intervalUnitChange = (data: { unit: 'Days' | 'Weeks' | 'Months', intervalDurationDays?: number }): IntervalUnitChangeAction => ({
  type: INTERVAL_UNIT_CHANGE,
  data,
});

export type IntervalConfigActions =
  | IntervalStartDateChangeAction
  | IntervalEndDateChangeAction
  | IntervalUnitChangeAction
  | IntervalCountChangeAction;
