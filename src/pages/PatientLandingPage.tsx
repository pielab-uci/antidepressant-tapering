import * as React from 'react';
import {
  FC, useCallback, useEffect, useRef,
} from 'react';
import { css } from '@emotion/react';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { format } from 'date-fns';
import { ProjectedScheduleChart, ProjectedScheduleTable } from '../components/Schedule';
import { RootState } from '../redux/reducers';
import { UserState } from '../redux/reducers/user';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import { CHANGE_PATIENT_NOTES, SAVE_PATIENT_NOTES_REQUEST } from '../redux/actions/user';

const patientPageHeaderStyle = css`
  & > h2 {
    //font-size: 32px;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  &:nth-child(2) {
    //font-size: 20px;
    font-size: 0.8rem;
  }

  & > hr {
    border: none;
    width: 100%;
    height: 2px;
    margin: 8px auto;
    background-color: #D1D1D1;
  }
`;

const PatientLandingPage: FC = () => {
  const history = useHistory();
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const {
    projectedSchedule,
    scheduleChartData,
    currentTaperConfigId,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const location = useLocation();
  const dispatch = useDispatch();

  const buttonStyle = useRef(css`
    border-radius: 10px;
    background-color: #0984E3;
  `);

  const onClickNewSchedule = useCallback(() => {
    // history.push(`/taper-configuration/create/?clinicianId=${me!.id}&patientId=${currentPatient!.id}`);
    history.push(`${location.pathname}/taper-configuration/create/`);
  }, [me, currentPatient]);

  const onClickAdjustSchedule = useCallback(() => {
    history.push(`${location.pathname}/taper-configuration/edit`);
  }, [currentPatient]);

  const renderMedicationSchedule = useCallback(() => {
    // if (!currentPatient!.taperingConfiguration) {
    if (!currentTaperConfigId) {
      return <p css={css`
        //font-size: 20px;
        font-size: 1rem;
        color: #c7c5c5;
        margin-top: 46px;
      `}>No medication schedule created</p>;
    }
    return <div css={css`margin-top: 15px;`}>
      <ProjectedScheduleTable editable={false}
                              projectedSchedule={projectedSchedule!}/>
    </div>;
  }, [currentPatient]);

  const onChangePatientNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: CHANGE_PATIENT_NOTES,
      data: e.target.value,
    });
  };

  const onClickNotesSaveButton = () => {
    dispatch({
      type: SAVE_PATIENT_NOTES_REQUEST,
      data: { notes: currentPatient!.notes, patientId: currentPatient!.id },
    });
  };

  const renderSymptomTracker = () => {
    return <p css={css`
      //font-size: 20px;
      font-size: 1rem;
      color: #c7c5c5;
      margin-top: 46px;
    `}>No symptom tracker configuration created.</p>;
  };

  const renderChart = useCallback(() => {
    const chartAreaStyle = css`
      width: 95%;
      height: 350px;
      border-radius: 17px;
      color: #c7c5c5;
      //font-size: 20px;
      font-size: 1rem;
      border: 1px solid #707070;
      line-height: 300px;
      text-align: center;
    `;

    if (scheduleChartData.length !== 0) {
      return <div css={css`height: 300px;
        width: 300px;
        margin-top: 56px;`}>
        <ProjectedScheduleChart scheduleChartData={scheduleChartData} width={300} height={300}/>
      </div>;
    }

    return <div>
      <div css={css`
        text-align: center;
        //font-size: 20px;
        font-size: 1rem;
        color: #636e72;`}>Projected taper progress
      </div>
      <div css={chartAreaStyle}>No data.
      </div>
    </div>;
  }, [scheduleChartData]);

  const renderButton = useCallback(() => {
    // return currentPatient!.taperingConfiguration
    return currentTaperConfigId !== null
      ? <Button type='primary' css={buttonStyle.current} onClick={onClickAdjustSchedule}>Edit Schedule</Button>
      : <Button type='primary' css={buttonStyle.current} onClick={onClickNewSchedule}>Create New</Button>;
  }, [currentPatient]);

  const renderNoteSection = () => {
    return (
      <>
        <h3>Notes</h3>
        <Input.TextArea
          css={css`border-radius: 17px;`}
          value={currentPatient!.notes || ''}
          onChange={onChangePatientNotes}
          rows={6}/>
        <Button
          onClick={onClickNotesSaveButton}
          type={'primary'}
          css={css`border-radius: 10px;
            background-color: #0984E3;
            margin-top: 5px;
            float: right;`}>Save</Button>
      </>
    );
  };

  return (
    <div css={css`
      overflow-y: scroll;

      h3 {
        //font-size: 26px;
        font-size: 1.2rem;
        color: #636272;
      }`}
         className='patient-initial'>
      <div css={patientPageHeaderStyle}>
        <h2>{currentPatient!.name}</h2>
        <div>Last Visit: {format(currentPatient!.recentVisit, 'MM/dd/yyyy')}</div>
        <hr/>
      </div>

      {/* <div css={css`display: flex; */}
      {/*  justify-content: space-between;`}> */}
      <div css={css`
        width: ${currentTaperConfigId === null ? '40%' : '100%;'}`}>
        {/* <div css={css`width: 447px;`}> */}
        {/* <div css={css`width: 100%;`}> */}
        <div css={css`display: flex;
          align-items: center;
          justify-content: space-between;`}>
          <h3>Medication Schedule</h3>
          {renderButton()}
        </div>

        {renderMedicationSchedule()}

        {currentTaperConfigId !== null && <div css={css`padding-right: 20px;`}>
          {renderChart()}
        </div>}
      </div>
      <div css={css`width: 40%;`}>
        <div css={css`display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 70px;`}>
          <h3>Symptom Tracker</h3>
          <Button type='primary'
                  css={css`
                    border-radius: 10px;
                    background-color: #0984E3;`}
                  disabled={true}>
            Create New</Button>
        </div>
        {renderSymptomTracker()}
      </div>
      {/* </div> */}
      <hr/>
      {renderNoteSection()}
    </div>
  );
};

export default PatientLandingPage;
