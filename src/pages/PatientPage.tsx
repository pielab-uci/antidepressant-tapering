import * as React from 'react';
import {
  FC, useCallback, useEffect,
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
import { ScheduleChart } from '../components/Schedule';
import { chartDataConverter, completePrescribedDrugs, scheduleGenerator } from '../redux/reducers/utils';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';

const PatientPage: FC<RouteChildrenProps<{ patientId: string }>> = ({ match }) => {
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const { prescribedDrugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch<SetCurrentPatientAction>({
      type: SET_CURRENT_PATIENT,
      data: parseInt(match!.params.patientId, 10),
    });

    if (currentPatient && currentPatient.taperingConfiguration) {
      console.log('patient ', currentPatient);
      dispatch<FetchPrescribedDrugsRequestAction>({
        type: FETCH_PRESCRIBED_DRUGS_REQUEST,
        data: currentPatient.taperingConfiguration.id,
      });
    }

    return () => {
      dispatch<EmptyPrescribedDrugs>({
        type: EMPTY_PRESCRIBED_DRUGS,
      });
    };
  }, []);

  useEffect(() => {
    if (currentPatient && currentPatient.taperingConfiguration) {
      console.log('patient ', currentPatient);
      dispatch<FetchPrescribedDrugsRequestAction>({
        type: FETCH_PRESCRIBED_DRUGS_REQUEST,
        data: currentPatient.taperingConfiguration.id,
      });
    }
  }, [currentPatient]);

  const onClickNewSchedule = useCallback(() => {
    // history.push(`/taper-configuration/?clinicianId=${me!.id}&patientId=${currentPatient!.id}`);
    // history.push(`/taper-configuration/?clinicianId=${me!.id}&patientId=${currentPatient!.id}/create`);
    history.push(`/taper-configuration/create/?clinicianId=${me!.id}&patientId=${currentPatient!.id}`);
  }, [me, currentPatient]);

  const onClickAdjustSchedule = useCallback(() => {
    history.push(`/taper-configuration/?id=${currentPatient!.taperingConfiguration!.id}`);
  }, [currentPatient]);

  const renderDrugsAndDosages = useCallback(() => {
    return !currentPatient!.taperingConfiguration
      ? <div>Drug(s): Drugs and dosages will appear hear.</div>
      : prescribedDrugs && prescribedDrugs.reduce((prev, prescribedDrug) => {
        const dosages = prescribedDrug.upcomingDosages.reduce(
          (prevDosageStr, dosage) => `${prevDosageStr}${dosage.quantity} * ${dosage.dosage}`, '',
        );
        return `${prev} ${prescribedDrug.brand} (${dosages})`;
      }, 'Drug(s):');
  }, [currentPatient, prescribedDrugs]);

  const renderTaperProgressGraph = useCallback(() => {
    if (!currentPatient!.taperingConfiguration) {
      return <div>Taper progress will appear</div>;
    }
    if (prescribedDrugs) {
      console.log('prescribedDrugs: ', prescribedDrugs);
      return <ScheduleChart
          scheduleChartData={chartDataConverter(scheduleGenerator(completePrescribedDrugs(prescribedDrugs)))}
          width={300}
          height={300}
        />;
    }
    return <div>Generating a chart..</div>;
  }, [currentPatient, prescribedDrugs]);

  const renderButtons = useCallback(() => {
    return currentPatient!.taperingConfiguration
      ? <Button onClick={onClickAdjustSchedule}>Adjust Schedule</Button>
      : <Button onClick={onClickNewSchedule}>New Schedule</Button>;
  }, [currentPatient]);

  return (
  <>
    {!currentPatient ? <div>No such patient</div>
      : <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h4>{currentPatient.name}</h4>
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
