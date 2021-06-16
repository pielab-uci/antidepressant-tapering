import * as React from 'react';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router/ts4.0';
import { Button, Input } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import { css } from '@emotion/react';
import { format } from 'date-fns';
import { Route, Switch } from 'react-router-dom';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import {
  EMPTY_PRESCRIBED_DRUGS, EmptyPrescribedDrugs,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FetchPrescribedDrugsRequestAction,
} from '../redux/actions/taperConfig';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';
import { checkCurrentPatientAndRender } from './utils';
import TaperConfigurationPage from './TaperConfiguration/TaperConfigurationPage';
import PatientInitPage from './PatientInitPage';

const pageStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const patientPageHeaderStyle = css`
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
`;
const PatientPage: FC<RouteChildrenProps<{ patientId: string }>> = ({ match }) => {
  const { currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const { path, url } = useRouteMatch();

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

    console.group('PatientPage');
    console.log('url: ', url);
    console.log('path: ', path);
    console.groupEnd();
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

  return (
    <>
      {!currentPatient ? <div>No such patient</div>
        : <div css={pageStyle}>
          <div css={patientPageHeaderStyle}>
            <h2>{currentPatient.name}</h2>
            <div css={css`font-size: 20px;`}>Last Visit: {format(currentPatient.recentVisit, 'MM/dd/yyyy')}</div>
            <hr/>
          </div>
            <Switch>
              <Route exact path={`${path}`} component={PatientInitPage}/>
              <Route path={`${path}/taper-configuration`}
                     render={checkCurrentPatientAndRender(currentPatient, TaperConfigurationPage)}/>
            </Switch>
        </div>
      }
    </>
  );
};

export default PatientPage;
