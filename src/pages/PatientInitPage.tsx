import * as React from 'react';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { css } from '@emotion/react';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { ProjectedScheduleChart, ProjectedScheduleTable } from '../components/Schedule';
import { RootState } from '../redux/reducers';
import { UserState } from '../redux/reducers/user';
import { Schedule } from '../components/Schedule/ProjectedSchedule';
import { ScheduleChartData } from '../redux/reducers/utils';
import { TaperingConfiguration } from '../types';
import { TaperConfigState } from '../redux/reducers/taperConfig';

const PatientInitPage: FC = () => {
  const history = useHistory();
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const { projectedSchedule, scheduleChartData } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  // const [projectedSchedule, setProjectedSchedule] = useState<Schedule>({ drugs: [], data: [] });
  // const [chartData, setChartData] = useState<ScheduleChartData>([]);
  // const [taperConfig, setTaperConfig] = useState<TaperingConfiguration|null>(null);
  const { path, url } = useRouteMatch();
  const location = useLocation();

  useEffect(() => {
    console.group('PatientInitPage');
    console.log('currentPatient');
    console.log(currentPatient);
    console.log('path: ', path);
    console.log('url: ', url);
    console.log('location: ', location);
    console.groupEnd();
    if (currentPatient && currentPatient.taperingConfiguration) {
      // TODO: load data from taperConfiguration
      // setProjectedSchedule(scheduleGenerator(completePrescribedDrugs(currentPatient.taperingConfiguration.prescribedDrugs)));
      // setChartData(chartDataConverter(projectedSchedule));
    }
  }, []);
  const onClickNewSchedule = useCallback(() => {
    // history.push(`/taper-configuration/create/?clinicianId=${me!.id}&patientId=${currentPatient!.id}`);
    history.push(`${location.pathname}/taper-configuration/create/`);
  }, [me, currentPatient]);

  const onClickAdjustSchedule = useCallback(() => {
    history.push(`${location.pathname}/taper-configuration/edit`);
  }, [currentPatient]);

  const renderMedicationSchedule = useCallback(() => {
    if (!currentPatient!.taperingConfiguration) {
      return <p css={css`
        //font-size: 20px;
        font-size: 1rem;
        color: #c7c5c5;
        margin-top: 46px;
      `}>No medication schedule created</p>;
    }
    return <div>
      <ProjectedScheduleTable editable={false}
                              projectedSchedule={projectedSchedule!}/>
    </div>;
  }, [currentPatient]);

  const renderSymptomTracker = () => {
    return <p css={css`
      //font-size: 20px;
      font-size: 1rem;
      color: #c7c5c5;
      margin-top: 46px;
    `}>No symptom tracker configuration created.</p>;
  };

  const renderChart = useCallback(() => {
    if (scheduleChartData.length !== 0) {
      return <ProjectedScheduleChart scheduleChartData={scheduleChartData} width={399} height={360}/>;
    }
    return <div>
      <div css={css`
        width: 399px;
        height: 360px;
        border-radius: 17px;
        color: #c7c5c5;
        //font-size: 20px;
        font-size: 1rem;
        border: 1px solid #707070;
        line-height: 300px;
        text-align: center;
      `}>No data.
      </div>
      <div css={css`
        text-align: center;
        //font-size: 20px;
        font-size: 1rem;
        color: #636e72;`}>Projected taper progress
      </div>
    </div>;
  }, [scheduleChartData]);

  const renderButton = useCallback(() => {
    const buttonStyle = css`
      border-radius: 10px;
      background-color: #0984E3;
    `;
    return currentPatient!.taperingConfiguration
      ? <Button type='primary' css={buttonStyle} onClick={onClickAdjustSchedule}>Edit Schedule</Button>
      : <Button type='primary' css={buttonStyle} onClick={onClickNewSchedule}>Create New</Button>;
  }, [currentPatient]);

  const renderNoteSection = () => {
    return (
      <>
        <h3>Notes</h3>
        <Input.TextArea/>
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
      <div css={css`display: flex;
        justify-content: space-between;`}>
        <div css={css`width: 447px;`}>
          <div css={css`display: flex;
            align-items: center;
            justify-content: space-between;`}>
            <h3>Medication Schedule</h3>
            {renderButton()}
          </div>
          {renderMedicationSchedule()}
          <div css={css`display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 76px;`}>
            <h3>Symptom Tracker</h3>
            <Button type='primary' css={css`border-radius: 10px;
              background-color: #0984E3;`}>Create New</Button>
          </div>
          {renderSymptomTracker()}
        </div>
        <div>
          {renderChart()}
        </div>
      </div>
      <hr/>
      {renderNoteSection()}
    </div>
  );
};

export default PatientInitPage;
