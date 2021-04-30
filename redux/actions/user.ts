import {Clinician, Patient} from '../../types';

export const LOGIN_REQUEST = "LOGIN_REQUEST" as const;
export const LOGIN_SUCCESS = "LOGIN_SUCCESS" as const;
export const LOGIN_FAILURE = "LOGIN_FAILURE" as const;

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  data: { email: string; password: string }
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  data: Omit<Clinician, "password">
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  error: any;
}

export const ADD_NEW_PATIENT_REQUEST = "ADD_NEW_PATIENT" as const;
export const ADD_NEW_PATIENT_SUCCESS = "ADD_NEW_PATIENT_SUCCESS" as const;
export const ADD_NEW_PATIENT_FAILURE = "ADD_NEW_PATIENT_FAILURE" as const;

export interface AddNewPatientRequest {
  type: typeof ADD_NEW_PATIENT_REQUEST,
  data: {name: string; email: string}
}

export interface AddNewPatientSuccess {
  type: typeof ADD_NEW_PATIENT_SUCCESS,
  data: Omit<Patient, "password">
};

export interface AddNewPatientFailure {
  type: typeof ADD_NEW_PATIENT_FAILURE,
  error: any;
};

