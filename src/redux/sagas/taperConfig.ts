import {
  all, put, fork, takeLatest, delay,
} from 'redux-saga/effects';
import { Schedule } from '../../components/ProjectedSchedule';
import {
  FETCH_PAST_SCHEDULE_DATA_FAILURE, FETCH_PAST_SCHEDULE_DATA_REQUEST,
  FETCH_PAST_SCHEDULE_DATA_SUCCESS, FetchPastScheduleDataFailure,
  FetchPastScheduleDataRequest,
  FetchPastScheduleDataSuccess,
} from '../actions/taperConfig';

function fetchPastScheduleDataAPI(currentDosageDate: Date): Schedule {
  // fetch a schedule that was ended most recently if there is
  return {
    data: [],
    drugs: [],
  };
}

function* fetchPastScheduleData(action: FetchPastScheduleDataRequest) {
  try {
    yield delay(1000);
    const result = fetchPastScheduleDataAPI(action.data);

    yield put<FetchPastScheduleDataSuccess>({
      type: FETCH_PAST_SCHEDULE_DATA_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put<FetchPastScheduleDataFailure>({
      type: FETCH_PAST_SCHEDULE_DATA_FAILURE,
    });
  }
}

function* watchFetchingPastScheduleData() {
  yield takeLatest(FETCH_PAST_SCHEDULE_DATA_REQUEST, fetchPastScheduleData);
}

export default function* taperConfigSaga() {
  yield all([fork(watchFetchingPastScheduleData)]);
}
