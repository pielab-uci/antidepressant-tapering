import {
  all, put, fork, takeLatest, select,
} from 'redux-saga/effects';
import {
  ADD_NEW_DRUG_FORM,
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddNewDrugFormAction,
  AddOrUpdateTaperConfigFailureAction,
  AddOrUpdateTaperConfigRequestAction,
  AddOrUpdateTaperConfigSuccessAction,
  CLEAR_SCHEDULE,
  ClearScheduleAction, EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
  FETCH_PRESCRIBED_DRUGS_FAILURE,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FetchPrescribedDrugsFailureAction,
  FetchPrescribedDrugsRequestAction,
  FetchPrescribedDrugsSuccessAction,
  FetchTaperConfigFailureAction,
  FetchTaperConfigRequestAction,
  FetchTaperConfigSuccessAction,
  GENERATE_SCHEDULE,
  GenerateScheduleAction, MOVE_FROM_CREATE_TO_PRESCRIBE_PAGE,
  TABLE_DOSAGE_EDITED,
  TABLE_END_DATE_EDITED,
  TABLE_START_DATE_EDITED,
  UPDATE_CHART,
  UpdateChartAction,
} from '../actions/taperConfig';
import {
  PrescribedDrug, Prescription, TableRowData, TaperingConfiguration,
} from '../../types';
import { completePrescribedDrugs, ScheduleChartData } from '../reducers/utils';
import { TaperConfigState } from '../reducers/taperConfig';
import {
  ALLOW_SPLITTING_UNSCORED_TABLET,
  CHOOSE_BRAND,
  CHOOSE_FORM, INTERVAL_COUNT_CHANGE, INTERVAL_END_DATE_CHANGE, INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE,
  PRIOR_DOSAGE_CHANGE, SET_TARGET_DOSAGE,
  UPCOMING_DOSAGE_CHANGE,
} from '../../components/PrescriptionForm/actions';
import taperConfig from '../reducers/taperConfig/taperConfig';

let taperConfigId = 0;

function* generateOrClearSchedule() {
  const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

  const validPrescribedDrugsInputs = completePrescribedDrugs(taperConfigState.prescribedDrugs);
  if (validPrescribedDrugsInputs.length !== 0) {
    yield put<GenerateScheduleAction>({
      type: GENERATE_SCHEDULE,
      data: validPrescribedDrugsInputs,
    });
  } else {
    yield put<ClearScheduleAction>({
      type: CLEAR_SCHEDULE,
    });
  }
}
//
// function addOrUpdateTaperConfigAPI(action: AddOrUpdateTaperConfigRequestAction): { data: TaperingConfiguration } {
//   if (taperConfigState.taperConfigs.findIndex((config) => config.patientId === action.data.patientId && config.clinicianId === action.data.clinicianId)) {
//     return action.data;
//   }
//
//   taperConfigId += 1;
//   return {
//     data: {
//       id: taperConfigId,
//       ...action.data,
//       createdAt: new Date(),
//     },
//   };
// }

function* addOrUpdateTaperConfig(action: AddOrUpdateTaperConfigRequestAction) {
  try {
    // yield delay(1000);
    // const result = addOrUpdateTaperConfigAPI(action);
    const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

    const existingTaperConfigIndex = taperConfigState.taperConfigs.findIndex((config) => config.patientId === action.data.patientId && config.clinicianId === action.data.clinicianId);

    if (existingTaperConfigIndex) {
      yield put<AddOrUpdateTaperConfigSuccessAction>({
        type: ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
        data: { ...taperConfigState.taperConfigs[existingTaperConfigIndex], ...action.data },
      });
    } else {
      taperConfigId += 1;
      yield put<AddOrUpdateTaperConfigSuccessAction>({
        type: ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
        data: { ...action.data, id: taperConfigId, createdAt: new Date() },
      });
    }
  } catch (err) {
    console.error(err);
    yield put<AddOrUpdateTaperConfigFailureAction>({
      type: ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddOrUpdateTaperConfig() {
  yield takeLatest(ADD_OR_UPDATE_TAPER_CONFIG_REQUEST, addOrUpdateTaperConfig);
}

// function fetchTaperConfigAPI(action: FetchTaperConfigRequestAction): { data: TaperingConfiguration } {
//   return {
//     data: {
//       id: action.data,
//       clinicianId: 1,
//       patientId: 1,
//       createdAt: new Date('2021-05-14T21:00:06.387Z'),
//       projectedSchedule: { drugs: [] as PrescribedDrug[], data: [] as TableRowData[] },
//       finalPrescription: {} as Prescription,
//       instructionsForPatient: '',
//       instructionsForPharmacy: '',
//       scheduleChartData: {} as ScheduleChartData,
//     },
//   };
// }

function* fetchTaperConfig(action: FetchTaperConfigRequestAction) {
  try {
    // const result = fetchTaperConfigAPI(action);
    // yield delay(1000);

    const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

    const taperConfigIndex = taperConfigState.taperConfigs.findIndex((config) => config.patientId === action.data.patientId && config.clinicianId === action.data.clinicianId);
    if (taperConfigIndex) {
      yield put<FetchTaperConfigSuccessAction>({
        type: FETCH_TAPER_CONFIG_SUCCESS,
        data: taperConfigState.taperConfigs[taperConfigIndex],
      });
    } else {
      // TODO: give new..?
    }

    if (taperConfigState.prescribedDrugs?.filter((drug) => !drug.prevVisit).length === 0) {
      yield put<AddNewDrugFormAction>({
        type: ADD_NEW_DRUG_FORM,
        data: null,
      });
    }

    yield generateOrClearSchedule();
  } catch (err) {
    console.error(err);
    yield put<FetchTaperConfigFailureAction>({
      type: FETCH_TAPER_CONFIG_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchFetchTaperConfig() {
  yield takeLatest(FETCH_TAPER_CONFIG_REQUEST, fetchTaperConfig);
}

function fetchPrescribedDrugsAPI(action: FetchPrescribedDrugsRequestAction): { data: PrescribedDrug[] } {
  return {
    data: [
      {
        id: 0,
        name: 'Fluoxetine',
        brand: 'Prozac',
        form: 'capsule',
        measureUnit: 'mg',
        minDosageUnit: 5,
        isModal: false,
        halfLife: 'Fluoxetine: 4-6 days\nNorfluoxetine (active metabolite): 4-16 days',
        availableDosageOptions: ['10mg', '20mg', '40mg'],
        regularDosageOptions: ['10mg', '20mg', '40mg'],
        allowSplittingUnscoredTablet: false,
        allowChangePriorDosage: true,
        applyInSchedule: true,
        priorDosages: [{ dosage: '10mg', quantity: 1 }, { dosage: '20mg', quantity: 2 }],
        priorDosageSum: null,
        upcomingDosages: [{ dosage: '20mg', quantity: 2 }],
        upcomingDosageSum: null,
        targetDosage: 10,
        // prescribedDosages: { '10mg': 3, '20mg': 0, '40mg': 0 },
        intervalStartDate: new Date('2021-05-14T21:00:06.387Z'),
        intervalEndDate: new Date('2021-05-27T21:00:06.387Z'),
        intervalCount: 2,
        intervalUnit: 'Weeks',
        intervalDurationDays: 14,
        prevVisit: true,
        prescribedAt: new Date('2021-05-14T21:00:06.387Z'),
      },
      {
        id: 1,
        name: 'Sertraline',
        brand: 'Zoloft',
        form: 'tablet',
        measureUnit: 'mg',
        applyInSchedule: true,
        minDosageUnit: 12.5,
        allowChangePriorDosage: true,
        isModal: false,
        halfLife: '24 hours',
        priorDosages: [{ dosage: '25mg', quantity: 0.5 }],
        priorDosageSum: null,
        upcomingDosages: [{ dosage: '25mg', quantity: 1 }],
        upcomingDosageSum: null,
        targetDosage: 200,
        availableDosageOptions: ['12.5mg', '25mg', '50mg', '100mg'],
        regularDosageOptions: ['25mg', '50mg', '100mg'],
        // prescribedDosages: { '25mg': 1, '50mg': 0, '100mg': 0 },
        allowSplittingUnscoredTablet: false,
        intervalStartDate: new Date('2021-05-14T21:13:39.673Z'),
        intervalEndDate: new Date('2021-05-27T21:13:39.673Z'),
        intervalCount: 2,
        intervalUnit: 'Weeks',
        intervalDurationDays: 14,
        prevVisit: true,
        prescribedAt: new Date('2021-05-14T21:13:39.673Z'),
      },
    ],
  };
}

function* fetchPrescribedDrugs(action: FetchPrescribedDrugsRequestAction) {
  try {
    // yield delay(500);
    const result = fetchPrescribedDrugsAPI(action);
    console.log('result: ', result);

    yield put<FetchPrescribedDrugsSuccessAction>({
      type: FETCH_PRESCRIBED_DRUGS_SUCCESS,
      data: result.data,
    });

    const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

    if (taperConfigState.prescribedDrugs?.filter((drug) => !drug.prevVisit).length === 0) {
      yield put<AddNewDrugFormAction>({
        type: ADD_NEW_DRUG_FORM,
        data: null,
      });
    }

    yield generateOrClearSchedule();
  } catch (err) {
    console.error(err);
    yield put<FetchPrescribedDrugsFailureAction>({
      type: FETCH_PRESCRIBED_DRUGS_FAILURE,
      error: err.response.data,
    });
  }
}

function* updateChart() {
  yield put<UpdateChartAction>({
    type: UPDATE_CHART,
  });
}

function* watchFetchPrescribedDrugs() {
  yield takeLatest(FETCH_PRESCRIBED_DRUGS_REQUEST, fetchPrescribedDrugs);
}

function* watchTaperConfigFormChange() {
  yield takeLatest([MOVE_FROM_CREATE_TO_PRESCRIBE_PAGE,
    // EDIT_PROJECTED_SCHEDULE_FROM_MODAL
  ],
  generateOrClearSchedule);
}

// function* watchTaperConfigFormChange() {
//   yield takeLatest([CHOOSE_BRAND, CHOOSE_FORM, PRIOR_DOSAGE_CHANGE,
//     ALLOW_SPLITTING_UNSCORED_TABLET, UPCOMING_DOSAGE_CHANGE, INTERVAL_START_DATE_CHANGE,
//     INTERVAL_END_DATE_CHANGE, INTERVAL_UNIT_CHANGE, INTERVAL_COUNT_CHANGE, SET_TARGET_DOSAGE,
//     EDIT_PROJECTED_SCHEDULE_FROM_MODAL],
//   generateOrClearSchedule);
// }

function* watchProjectedScheduleTableEdit() {
  yield takeLatest([TABLE_DOSAGE_EDITED, TABLE_START_DATE_EDITED, TABLE_END_DATE_EDITED], updateChart);
}

export default function* taperConfigSaga() {
  yield all([
    fork(watchFetchTaperConfig),
    fork(watchFetchPrescribedDrugs),
    fork(watchAddOrUpdateTaperConfig),
    fork(watchTaperConfigFormChange),
    fork(watchProjectedScheduleTableEdit),
  ]);
}
