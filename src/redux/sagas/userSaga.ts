import {
  all, delay, fork, put, takeLatest,
} from 'redux-saga/effects';
import {
  ADD_NEW_PATIENT_FAILURE, ADD_NEW_PATIENT_REQUEST,
  ADD_NEW_PATIENT_SUCCESS,
  AddNewPatientFailure,
  AddNewPatientRequest,
  AddNewPatientSuccess,
  LoadPatientsRequestAction,
  LoadPatientsSuccessAction,
  LoadPatientsFailureAction,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginFailureAction,
  LoginRequestAction,
  LoginSuccessAction, LOAD_PATIENTS_SUCCESS, LOAD_PATIENTS_FAILURE, LOAD_PATIENTS_REQUEST,

} from '../actions/user';
import { Clinician, Patient } from '../../types';
import {
  christian, xiao, sally, john,
} from './dummies';

function loginAPI(action: LoginRequestAction): { data: Omit<Clinician, 'password'> } {
  return { data: christian };
}

function* logIn(action: LoginRequestAction) {
  try {
    // yield delay(1000);
    const result = loginAPI(action);

    yield put<LoginSuccessAction>({
      type: LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put<LoginFailureAction>({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

function addPatientAPI(action: AddNewPatientRequest): { data: Omit<Patient, 'password'> } {
  return { data: xiao };
}

function* addPatient(action: AddNewPatientRequest) {
  try {
    // yield delay(1000);
    const result = addPatientAPI(action);

    yield put<AddNewPatientSuccess>({
      type: ADD_NEW_PATIENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put<AddNewPatientFailure>({
      type: ADD_NEW_PATIENT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPatientsAPI(action: LoadPatientsRequestAction): { data: Omit<Patient, 'password'>[] } {
  return { data: [sally, john, xiao] };
}

function* loadPatients(action: LoadPatientsRequestAction) {
  try {
    // yield delay(1000);
    const result = loadPatientsAPI(action);

    yield put<LoadPatientsSuccessAction>({
      type: LOAD_PATIENTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put<LoadPatientsFailureAction>({
      type: LOAD_PATIENTS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield takeLatest(LOGIN_REQUEST, logIn);
}

function* watchAddPatient() {
  yield takeLatest(ADD_NEW_PATIENT_REQUEST, addPatient);
}

function* watchLoadPatients() {
  yield takeLatest(LOAD_PATIENTS_REQUEST, loadPatients);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchAddPatient), fork(watchLoadPatients)]);
}
