import produce from 'immer';
import {
  ADD_NEW_PATIENT_FAILURE,
  ADD_NEW_PATIENT_REQUEST,
  ADD_NEW_PATIENT_SUCCESS,
  AddNewPatientFailure,
  AddNewPatientRequest,
  AddNewPatientSuccess, LOAD_PATIENTS_FAILURE, LOAD_PATIENTS_REQUEST, LOAD_PATIENTS_SUCCESS,
  LoadPatientsFailureAction,
  LoadPatientsRequestAction,
  LoadPatientsSuccessAction,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginFailureAction,
  LoginRequestAction,
  LoginSuccessAction, SET_CURRENT_PATIENT, SetCurrentPatientAction,
} from '../actions/user';
import { Clinician, Patient } from '../../types';

export interface UserState {
  loggingIn: boolean;
  loggedIn: boolean;
  logInError: any;
  addingPatient: boolean;
  addedPatient: boolean;
  addPatientError: any;

  loadingPatients: boolean;
  loadedPatients: boolean;
  loadPatientsError: any;

  // patients: Omit<Patient, 'password'|'taperingConfigurations'>[];
  patients: Omit<Patient, 'password'>[];
  currentPatient: Omit<Patient, 'password'>|null;
  me: Omit<Clinician, 'password'>|null;
}

export const initialState: UserState = {
  loggingIn: false,
  loggedIn: false,
  logInError: null,

  addingPatient: false,
  addedPatient: false,
  addPatientError: null,

  loadingPatients: false,
  loadedPatients: false,
  loadPatientsError: null,

  patients: [],
  currentPatient: null,
  me: null,
};

type UserReducerAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | AddNewPatientRequest
  | AddNewPatientSuccess
  | AddNewPatientFailure
  | LoadPatientsRequestAction
  | LoadPatientsSuccessAction
  | LoadPatientsFailureAction
  | SetCurrentPatientAction;

const userReducer = (state: UserState = initialState, action: UserReducerAction): UserState => produce(state, (draft) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      draft.loggingIn = true;
      draft.loggedIn = false;
      draft.logInError = null;
      break;

    case LOGIN_SUCCESS:
      draft.loggingIn = false;
      draft.loggedIn = true;
      draft.me = action.data;
      break;

    case LOGIN_FAILURE:
      draft.loggingIn = false;
      draft.loggedIn = false;
      draft.logInError = action.error;
      break;

    case ADD_NEW_PATIENT_REQUEST:
      draft.addingPatient = true;
      draft.addedPatient = false;
      draft.addPatientError = null;
      break;

    case ADD_NEW_PATIENT_SUCCESS:
      draft.addingPatient = false;
      draft.addedPatient = true;
      break;

    case ADD_NEW_PATIENT_FAILURE:
      draft.addingPatient = false;
      draft.addPatientError = action.error;
      break;

    case LOAD_PATIENTS_REQUEST:
      draft.loadingPatients = true;
      draft.loadedPatients = false;
      draft.loadPatientsError = null;
      break;

    case LOAD_PATIENTS_SUCCESS:
      draft.loadingPatients = false;
      draft.loadedPatients = true;
      draft.patients = action.data;
      break;

    case LOAD_PATIENTS_FAILURE:
      draft.loadingPatients = false;
      draft.loadPatientsError = action.error;
      break;

    case SET_CURRENT_PATIENT:
      if (action.data === -1) {
        draft.currentPatient = null;
      }
      draft.currentPatient = draft.patients.find((patient) => patient.id === action.data)!;
      break;

    default:
      return state;
  }
});

export default userReducer;
