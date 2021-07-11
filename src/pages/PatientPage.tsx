import * as React from 'react';
import {
  FC, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router/ts4.0';
import { useRouteMatch } from 'react-router';
import { css } from '@emotion/react';
import { format } from 'date-fns';
import { Route, Switch } from 'react-router-dom';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import {
  EMPTY_PRESCRIBED_DRUGS, EmptyPrescribedDrugs,
  FETCH_TAPER_CONFIG_REQUEST,
  FetchTaperConfigRequestAction,
} from '../redux/actions/taperConfig';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';
import { checkCurrentPatientAndRender } from './utils';
import TaperConfigurationPage from './TaperConfiguration/TaperConfigurationPage';
import PatientLandingPage from './PatientLandingPage';

const pageStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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
const PatientPage: FC<RouteChildrenProps<{ patientId: string }>> = ({ match }) => {
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const { path, url } = useRouteMatch();

  useEffect(() => {
    const patientId = parseInt(match!.params.patientId, 10);

    dispatch<SetCurrentPatientAction>({
      type: SET_CURRENT_PATIENT,
      data: patientId,
    });

    dispatch<FetchTaperConfigRequestAction>({
      type: FETCH_TAPER_CONFIG_REQUEST,
      data: { patientId, clinicianId: me!.id },
    });

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

  return (
    <>
      {!currentPatient ? <div>No such patient</div>
        : <div css={pageStyle}>
          <div css={patientPageHeaderStyle}>
            <h2>{currentPatient.name}</h2>
            <div>Last Visit: {format(currentPatient.recentVisit, 'MM/dd/yyyy')}</div>
            <hr/>
          </div>
          <Switch>
            <Route exact path={`${path}`} component={PatientLandingPage}/>
            <Route path={`${path}/taper-configuration`}
                   render={checkCurrentPatientAndRender(currentPatient, TaperConfigurationPage)}/>
          </Switch>
        </div>
      }
    </>
  );
};

export default PatientPage;
