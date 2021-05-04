import { all, fork } from 'redux-saga/effects';
import userSaga from './user';
import taperConfigSaga from './taperConfig';

export default function* rootSaga() {
  yield all([fork(userSaga), fork(taperConfigSaga)]);
}
