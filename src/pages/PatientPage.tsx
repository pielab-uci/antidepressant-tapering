import * as React from 'react';
import {
  FC, useCallback, useEffect, useMemo, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router/ts4.0';
import { Button } from 'antd';
import { useHistory } from 'react-router';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import {
  EMPTY_PRESCRIBED_DRUGS, EmptyPrescribedDrugs,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FetchPrescribedDrugsRequestAction,
} from '../redux/actions/taperConfig';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import ScheduleChart from '../components/ScheduleChart';
import { chartDataConverter, scheduleGenerator } from '../redux/reducers/utils';
import { Patient } from '../types';

const PatientPage: FC<RouteChildrenProps<{ patientId: string }>> = ({ match }) => {
  const { me, patients } = useSelector<RootState, UserState>((state) => state.user);
  const { prescribedDrugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  const dispatch = useDispatch();
  const history = useHistory();
  // const patient = useRef(patients.find((p) => p.id === parseInt(match!.params.patientId, 10))!);
  // const patient: <Omit<Patient, 'password'>|null>(null);
  const patient = patients.find((p) => p.id === parseInt(match!.params.patientId, 10))!;

  useEffect(() => {
    // patient.current = patients.find((p) => p.id === parseInt(match!.params.patientId, 10))!;
    console.log('patient ', patient);
    if (patient && patient.taperingConfiguration) {
      dispatch<FetchPrescribedDrugsRequestAction>({
        type: FETCH_PRESCRIBED_DRUGS_REQUEST,
        data: patient.taperingConfiguration.id,
      });
    }
    return () => {
      dispatch<EmptyPrescribedDrugs>({
        type: EMPTY_PRESCRIBED_DRUGS,
      });
    };
  }, []);

  const onClickNewSchedule = useCallback(() => {
    history.push(`/taper-configuration/?clinicianId=${me!.id}&patientId=${patient.id}`);
  }, []);

  const onClickAdjustSchedule = useCallback(() => {
    history.push(`/taper-configuration/?id=${patient.taperingConfiguration!.id}`);
  }, []);

  const renderDrugsAndDosages = () => {
    return !patient.taperingConfiguration
      ? <div>Drug(s): Drugs and dosages will appear hear.</div>
      : prescribedDrugs && prescribedDrugs.reduce((prev, prescribedDrug, i, arr) => {
        const dosages = prescribedDrug.nextDosages.reduce(
          (prevDosageStr, dosage) => `${prevDosageStr}${dosage.quantity} * ${dosage.dosage}`, '',
        );
        return `${prev} ${prescribedDrug.brand} (${dosages})`;
      }, 'Drug(s):');
  };

  const renderTaperProgressGraph = () => {
    if (!patient.taperingConfiguration) {
      return <div>Taper progress will appear</div>;
    }
    if (prescribedDrugs) {
      return <ScheduleChart
          scheduleChartData={chartDataConverter(scheduleGenerator(prescribedDrugs))}
        />;
    }
    return <div>Generating a chart..</div>;
  };

  const renderButtons = () => {
    return patient.taperingConfiguration
      ? <Button onClick={onClickAdjustSchedule}>Adjust Schedule</Button>
      : <Button onClick={onClickNewSchedule}>New Schedule</Button>;
  };

  return (
  <>
    {!patient ? <div>No such patient</div>
      : <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h4>{patient.name}</h4>
        <hr/>
        <h5>Schedule</h5>
        {renderDrugsAndDosages()}
        {renderTaperProgressGraph()}
        {renderButtons()}
        <button disabled={true}>Symptom Tracker</button>
      </div>
    }
  </>
  );
};

export default PatientPage;
