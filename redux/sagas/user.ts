import { all, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginFailureAction,
  LoginRequestAction,
  LoginSuccessAction
} from "../actions/user";
import {User} from "../../types";


function* logIn(action: LoginRequestAction) {
  try {
  yield delay(1000);

  const dummyUser: Omit<User, 'password'> = {
    email: 'clinician@gmail.com',
    role: 'clinician',
    taperingConfigurations: [{ clinician: { email: 'clinician@gmail.com', role: 'clinician'}, patient: {email: 'patient@gmail.com', role: 'patient'}}]
  }
  yield put<LoginSuccessAction>({
    type: LOGIN_SUCCESS,
    data: dummyUser
  })
  } catch (err) {
    console.error(err);
    yield put<LoginFailureAction>({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield takeLatest(LOGIN_REQUEST, logIn);
}


export default function* userSaga() {
  yield all([fork(watchLogIn)])
};
