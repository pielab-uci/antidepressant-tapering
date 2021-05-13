import { all, fork } from 'redux-saga/effects';
import userSaga from './userSaga';
import taperConfigSaga from './taperConfigSaga';

export default function* rootSaga() {
  yield all([fork(userSaga), fork(taperConfigSaga)]);
}
