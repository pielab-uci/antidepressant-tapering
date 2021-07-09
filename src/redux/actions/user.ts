import { Clinician, Patient } from '../../types';

export const LOGIN_REQUEST = 'LOGIN_REQUEST' as const;
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' as const;
export const LOGIN_FAILURE = 'LOGIN_FAILURE' as const;

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  data: { email: string; password: string }
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  data: Omit<Clinician, 'password'>
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  error: any;
}

export type LoginActions =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction;

export const ADD_NEW_PATIENT_REQUEST = 'ADD_NEW_PATIENT' as const;
export const ADD_NEW_PATIENT_SUCCESS = 'ADD_NEW_PATIENT_SUCCESS' as const;
export const ADD_NEW_PATIENT_FAILURE = 'ADD_NEW_PATIENT_FAILURE' as const;

export interface AddNewPatientRequest {
  type: typeof ADD_NEW_PATIENT_REQUEST,
  data: { name: string; email: string }
}

export interface AddNewPatientSuccess {
  type: typeof ADD_NEW_PATIENT_SUCCESS,
  data: Omit<Patient, 'password'>
}

export interface AddNewPatientFailure {
  type: typeof ADD_NEW_PATIENT_FAILURE,
  error: any;
}

export type AddNewPatientActions =
  | AddNewPatientRequest
  | AddNewPatientSuccess
  | AddNewPatientFailure;

export const LOAD_PATIENTS_REQUEST = 'LOAD_PATIENTS_REQUEST' as const;
export const LOAD_PATIENTS_SUCCESS = 'LOAD_PATIENTS_SUCCESS' as const;
export const LOAD_PATIENTS_FAILURE = 'LOAD_PATIENTS_FAILURE' as const;

export interface LoadPatientsRequestAction {
  type: typeof LOAD_PATIENTS_REQUEST,
  data: number; // clinician id
}

export interface LoadPatientsSuccessAction {
  type: typeof LOAD_PATIENTS_SUCCESS,
  // data: Omit<Patient, 'password'|'taperConfigurations'>[];
  data: Omit<Patient, 'password'>[]
}

export interface LoadPatientsFailureAction {
  type: typeof LOAD_PATIENTS_FAILURE,
  error: any;
}

export type LoadPatientsActions =
  | LoadPatientsRequestAction
  | LoadPatientsSuccessAction
  | LoadPatientsFailureAction;

export const SET_CURRENT_PATIENT = 'SET_CURRENT_PATIENT' as const;

export interface SetCurrentPatientAction {
  type: typeof SET_CURRENT_PATIENT,
  data: number;
}

export const CHANGE_PATIENT_NOTES = 'CHANGE_PATIENT_NOTES' as const;

export interface ChangePatientNotes {
  type: typeof CHANGE_PATIENT_NOTES,
  data: string
}

export const SAVE_PATIENT_NOTES_REQUEST = 'SAVE_PATIENT_NOTES_REQUEST' as const;
export const SAVE_PATIENT_NOTES_SUCCESS = 'SAVE_PATIENT_NOTES_SUCCESS' as const;
export const SAVE_PATIENT_NOTES_FAILURE = 'SAVE_PATIENT_NOTES_FAILURE' as const;

export interface SavePatientNotesRequestAction {
  type: typeof SAVE_PATIENT_NOTES_REQUEST,
  data: { notes: string, patientId: number }
}

export interface SavePatientNotesSuccessAction {
  type: typeof SAVE_PATIENT_NOTES_SUCCESS
  data: { notes: string, patientId: number }
}

export interface SavePatientNotesFailureAction {
  type: typeof SAVE_PATIENT_NOTES_FAILURE,
  error: any,
}

export type SavePatientNotesActions =
  | SavePatientNotesRequestAction
  | SavePatientNotesSuccessAction
  | SavePatientNotesFailureAction;
