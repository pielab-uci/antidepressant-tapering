import * as React from 'react';
import Button from 'antd/es/button';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { css } from '@emotion/react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProjectedSchedule from '../../components/Schedule/ProjectedSchedule';
import NotesToShare from '../../components/Schedule/NotesToShare';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  CLEAR_SCHEDULE,
  MOVE_FROM_CREATE_TO_PRESCRIBE_PAGE,
} from '../../redux/actions/taperConfig';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';

const wrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const projectedScheduleStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  padding: 21px 38px 71px 38px;
  border-radius: 17px;
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
  }
`;

const EditTaperConfiguration = () => {
  const history = useHistory();
  const location = useLocation();
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const {
    clinicianId,
    patientId,
    currentTaperConfigId,
    instructionsForPatient,
    instructionsForPharmacy,
    projectedSchedule,
    scheduleChartData,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  useEffect(() => {
    // Triggers GENERATE_SCHEDULE event in saga
    if (!location.pathname.includes('revisit')) {
      dispatch({
        type: MOVE_FROM_CREATE_TO_PRESCRIBE_PAGE,
      });
    }
  }, []);

  const moveToPrevious = () => {
    if (location.pathname.includes('revisit')) {
      history.goBack();
    } else {
      console.log('location.pathname doesnt include revisit');
      history.push(url.replace('edit', 'create'));
      dispatch({
        type: CLEAR_SCHEDULE,
      });
    }
  };

  const saveTaperConfigurationAndMoveToConfirmPage = () => {
    dispatch({
      type: ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
      data: {
        currentTaperConfigId,
        clinicianId,
        patientId,
        projectedSchedule,
        scheduleChartData,
        instructionsForPharmacy,
        instructionsForPatient,
      },
    });
    history.push(url.replace('edit', 'confirm'));
  };

  return (
    <div className='edit-taper-configuration' css={wrapperStyle}>
      <div css={projectedScheduleStyle}>
        {/* <Prompt when={!isSaved} */}
        {/*        message={'Are you sure you want to leave?'}/> */}
        <ProjectedSchedule title={'Projected Schedule based on the rates of reduction you specified'}
                           editable={true}/>
        <NotesToShare editable={true}/>
      </div>
      <div css={buttonStyle}>
        <Button onClick={moveToPrevious}>Previous</Button>
        <Button css={css`background-color: #0984E3;`} type='primary'
                onClick={saveTaperConfigurationAndMoveToConfirmPage}>Save</Button>
      </div>
    </div>
  );
};

export default EditTaperConfiguration;
