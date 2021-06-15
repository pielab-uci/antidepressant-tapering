import * as React from 'react';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router/ts4.0';
import { Button } from 'antd';
import { useHistory } from 'react-router';
import { css } from '@emotion/react';
import { format } from 'date-fns';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import {
  EMPTY_PRESCRIBED_DRUGS, EmptyPrescribedDrugs,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FetchPrescribedDrugsRequestAction,
} from '../redux/actions/taperConfig';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import { ProjectedScheduleChart, ProjectedScheduleTable } from '../components/Schedule';
import {
  chartDataConverter,
  completePrescribedDrugs, ScheduleChartData,
  scheduleGenerator,
} from '../redux/reducers/utils';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';
import { Schedule } from '../components/Schedule/ProjectedSchedule';

const pageStyle = css`
  display: flex;
  flex-direction: column;

  & > h2 {
    font-size: 32px;
    font-weight: bold;
    margin: 0;
  }

  &:nth-child(2) {
    font-size: 20px;
  }

  & > hr {
    border: none;
    width: 100%;
    height: 3px;
    margin: 18px auto;
    background-color: #D1D1D1;
  }

  & h3 {
    font-size: 26px;
    color: #636272;
  }
`;

const PatientPage: FC<RouteChildrenProps<{ patientId: string }>> = ({ match }) => {
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const { prescribedDrugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [projectedSchedule, setProjectedSchedule] = useState<Schedule>({ drugs: [], data: [] });
  const [chartData, setChartData] = useState<ScheduleChartData>([]);
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
      // TODO: do I need to separate the request for prescribed ddurgs and taper configurations..?
      setProjectedSchedule(scheduleGenerator(completePrescribedDrugs(currentPatient.taperingConfiguration.prescribedDrugs)));
      setChartData(chartDataConverter(projectedSchedule));
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
    history.push(`/taper-configuration/create/?clinicianId=${me!.id}&patientId=${currentPatient!.id}`);
  }, [me, currentPatient]);

  const onClickAdjustSchedule = useCallback(() => {
    history.push(`/taper-configuration/edit/?clinicianId=${me!.id}&patientId=${currentPatient!.id}`);
  }, [currentPatient]);

  const renderMedicationSchedule = useCallback(() => {
    if (!currentPatient!.taperingConfiguration) {
      return <p css={css`
        font-size: 20px;
        color: #c7c5c5;
        margin-top: 46px;
      `}>No medication schedule created</p>;
    }
    return <div>
      <ProjectedScheduleTable editable={false}
                              projectedSchedule={projectedSchedule!}/>
    </div>;
  }, [currentPatient]);

  const renderChart = useCallback(() => {
    if (chartData.length !== 0) {
      return <ProjectedScheduleChart scheduleChartData={chartData} width={399} height={360}/>;
    }
    return <div>
      <div css={css`
        width: 399px;
        height: 360px;
        border-radius: 17px;
        color: #c7c5c5;
        font-size: 20px;
        border: 1px solid #707070;
        line-height: 300px;
        text-align: center;
      `}>No data.
      </div>
      <div css={css`
        text-align: center;
        font-size: 20px;
        color: #636e72;`}>Projected taper progress
      </div>
    </div>;
  }, [chartData]);

  const renderSymptomTracker = () => {
    return <p css={css`
      font-size: 20px;
      color: #c7c5c5;
      margin-top: 46px;
    `}>No symptom tracker configuration created.</p>;
  };

  const renderButton = useCallback(() => {
    const buttonStyle = css`
      border-radius: 10px;`;
    return currentPatient!.taperingConfiguration
      ? <Button type='primary' css={buttonStyle} onClick={onClickAdjustSchedule}>Edit Schedule</Button>
      : <Button type='primary' css={buttonStyle} onClick={onClickNewSchedule}>Create New</Button>;
  }, [currentPatient]);

  const renderNoteSection = () => {
    return (
      <>
        <h3>Notes</h3>
      </>
    );
  };
  return (
    <>
      {!currentPatient ? <div>No such patient</div>
        : <div css={pageStyle}>
          <h2>{currentPatient.name}</h2>
          <div css={css`font-size: 20px;`}>Last Visit: {format(currentPatient.recentVisit, 'MM/dd/yyyy')}</div>
          <hr/>

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
                <Button type='primary' css={css`border-radius: 10px;`}>Create New</Button>
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
      }
    </>
  );
};

export default PatientPage;
