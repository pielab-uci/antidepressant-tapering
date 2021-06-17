import * as React from 'react';
import { Button, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useContext, useEffect, useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import { css } from '@emotion/react';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import {
  SHARE_WITH_PATIENT_APP_REQUEST, SHARE_WITH_PATIENT_EMAIL_REQUEST,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
} from '../../redux/actions/taperConfig';
import ProjectedSchedule from '../../components/Schedule/ProjectedSchedule';
import { TaperConfigurationPageContext } from './TaperConfigurationPage';

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const scheduleStyle = css`
  width: 100%;
  padding: 21px 38px 71px 38px;
  background-color: white;
  border-radius: 17px;
  overflow-y: scroll;
  margin-bottom: 34px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
`;

const buttonStyle = css`
  margin-bottom: 21px;
  display: flex;
  justify-content: space-between;

  & > button {
    width: 180px;
    height: 38px;
    border-radius: 10px;
  }`;

// TODO: remove shareProjectedScheduleWithPatient related parts

const ConfirmTaperConfiguration = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { setStep } = useContext(TaperConfigurationPageContext);
  const { isInputComplete } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  useEffect(() => {
    setStep(3);
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

  const shareWithPdf = () => {

  };
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
    // const clinicianId = urlSearchParams.current.get('clinicianId');
    // const patientId = urlSearchParams.current.get('patientId');
    // history.push(`/taper-configuration/edit/?clinicianId=${clinicianId}&patientId=${patientId}`);
    history.push(url.replace('confirm', 'edit'));
  };

  const saveTaperConfiguration = () => {

  };

  return (
    <div css={wrapperStyle}>
      <div css={scheduleStyle}>
        <ProjectedSchedule title={'Projected schedule'} editable={false}/>
        <div css={css`margin-top: 44px;`}>
          <h3>Share projected schedule and notes with patient</h3>
          <div css={css`
            & > button {
              margin-right: 30px;
            }`}>
            <Button onClick={shareWithApp}>App</Button>
            <Button onClick={shareWithEmail}>Email</Button>
            <Button onClick={shareWithPdf}>PDF</Button>
          </div>
        </div>
      </div>
      <div css={buttonStyle}>
        <Button onClick={moveToEditPage}>Previous</Button>
        <Button type='primary' onClick={saveTaperConfiguration}>Save</Button>
      </div>
    </div>);
};

export default ConfirmTaperConfiguration;
