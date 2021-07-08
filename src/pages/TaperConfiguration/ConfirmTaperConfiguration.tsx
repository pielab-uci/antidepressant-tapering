import * as React from 'react';
import Button from 'antd/es/button';
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
import { ShareWithAppIcon, ShareWithEmailIcon, ShareWithPdfIcon } from '../../icons';
import NotesToShare from '../../components/Schedule/NotesToShare';

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
  };

  & > button.return-to-patient-page {
    width: 250px;
}`;

// TODO: remove shareProjectedScheduleWithPatient related parts

const ConfirmTaperConfiguration = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { isInputComplete, patientId } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

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

  const moveToEditPage = () => {
    history.push(url.replace('confirm', 'edit'));
  };

  const returnToPatientsPage = () => {
    history.push(`/patient/${patientId}`);
  };

  return (
    <div css={wrapperStyle}>
      <div css={scheduleStyle}>
        <h1 css={css`font-weight: bold; font-size: 1.5rem; text-align: center;`}>Prescription has been added.</h1>
        <div css={css`margin-top: 44px;`}>
          <h3>Share projected schedule and notes with patient</h3>
          <div css={css`
            display: flex;

            & > button {
              margin-right: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            }`}>
            <Button onClick={shareWithApp}>
              App
            </Button>
            <Button onClick={shareWithEmail}>
              E-mail
            </Button>
            <Button onClick={shareWithPdf}>
              PDF
            </Button>
          </div>
        </div>
        <NotesToShare editable={false}/>
      </div>
      <div css={buttonStyle}>
        <Button onClick={moveToEditPage}>Previous</Button>
        <Button type='primary' className='return-to-patient-page' onClick={returnToPatientsPage}>Return to Patient Page</Button>
      </div>
    </div>);
};

export default ConfirmTaperConfiguration;
