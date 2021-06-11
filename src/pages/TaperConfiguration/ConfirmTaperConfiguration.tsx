import * as React from 'react';
import { Button, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import {
  SHARE_WITH_PATIENT_APP_REQUEST, SHARE_WITH_PATIENT_EMAIL_REQUEST,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
} from '../../redux/actions/taperConfig';
import { ProjectedSchedule } from '../../components/Schedule';

const ConfirmTaperConfiguration = () => {
  const history = useHistory();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));

  const {
    shareProjectedScheduleWithPatient, isInputComplete,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  const toggleShareProjectedSchedule = useCallback(() => {
    dispatch({
      type: TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
    });
  }, []);

  const shareWithApp = useCallback(() => {
    dispatch({
      type: SHARE_WITH_PATIENT_APP_REQUEST,
    });
  }, []);

  const shareWithEmail = useCallback(() => {
    dispatch({
      type: SHARE_WITH_PATIENT_EMAIL_REQUEST,
    });
  }, []);

  /*
TODO: save taper configuration -> not prescribedDrugs, but projectedSchedule
const saveTaperConfiguration = useCallback(() => {
  if (prescribedDrugs) {
    dispatch(addOrUpdateTaperConfigRequest({
      clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10),
      patientId: parseInt(urlSearchParams.current.get('patientId')!, 10),
      prescribedDrugs,
    }));
  }
}, [prescribedDrugs]);
 */

  const moveToEditPage = () => {
    const clinicianId = urlSearchParams.current.get('clinicianId');
    const patientId = urlSearchParams.current.get('patientId');
    history.push(`/taper-configuration/edit/?clinicianId=${clinicianId}&patientId=${patientId}`);
  };

  const saveTaperConfiguration = () => {};
  return <>
    <div>ConfirmTaperConfiguration</div>

    <ProjectedSchedule editable={false}/>

    <Checkbox checked={shareProjectedScheduleWithPatient} onChange={toggleShareProjectedSchedule}>
      Share projected schedule
    </Checkbox>
    <Button onClick={moveToEditPage}>Prev</Button>
    <Button onClick={shareWithApp}>App</Button>
    <Button onClick={shareWithEmail}>Email</Button>
    <Button onClick={saveTaperConfiguration} disabled={!isInputComplete}>Save configuration</Button>
    </>;
};

export default ConfirmTaperConfiguration;
