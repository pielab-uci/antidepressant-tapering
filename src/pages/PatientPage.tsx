import * as React from 'react';
import {
  FC, useCallback, useEffect, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router/ts4.0';
import { Button } from 'antd';
import { useHistory } from 'react-router';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';

const PatientPage: FC<RouteChildrenProps<{ patientId: string }>> = ({ match }) => {
  const { me, patients } = useSelector<RootState, UserState>((state) => state.user);
  const history = useHistory();
  const patient = useMemo(() => {
    return patients.find((p) => p.id === parseInt(match!.params.patientId, 10));
  }, []);

  const onClickNewSchedule = useCallback(() => {
    history.push(`/taper-configuration/?clinicianId=${me!.id}&patientId=${patient!.id}`);
  }, []);

  const onClickAdjustSchedule = useCallback(() => {
    history.push(`/taper-configuration/?id=${patient!.taperingConfiguration!.id}`);
  }, []);

  return (
  <>
    {!patient ? <div>No such patient</div>
      : <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h4>{patient.name}</h4>
        <hr/>
        <div>Schedule</div>
        <div>Drug(s): Drugs and dosages will appear hear.</div>
        <div>Taper progress will appear</div>
        { patient.taperingConfiguration
          ? <Button onClick={onClickAdjustSchedule}>Adjust Schedule</Button>
          : <Button onClick={onClickNewSchedule}>New Schedule</Button>}
        <button disabled={true}>Symptom Tracker</button>
      </div>
    }
  </>
  );
};

export default PatientPage;
