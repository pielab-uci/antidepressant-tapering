import * as React from 'react';
import {
  useEffect, useRef, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useLocation, useRouteMatch,
} from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { css } from '@emotion/react';
import format from 'date-fns/esm/format';
import { RootState } from '../../redux/reducers';
import {
  FETCH_TAPER_CONFIG_REQUEST,
  FetchTaperConfigRequestAction,
  INIT_NEW_TAPER_CONFIG,
  InitNewTaperConfigAction,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyTaperConfigPage,
} from '../../redux/actions/taperConfig';
import { CreateTaperConfiguration, EditTaperConfiguration, ConfirmTaperConfiguration } from './index';
import { UserState } from '../../redux/reducers/user';
import { checkCurrentPatientAndRender } from '../../utils/pages';

const navTextStyle = css`
  display: flex;
  font-family: Verdana;
  font-size: 1rem;
  color: #636E72;
  margin-bottom: 20px;

  & > div {
    margin-right: 22px;
  }
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

const TaperConfigurationPage = () => {
  const dispatch = useDispatch();
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const titles = useRef<['Create', 'Prescribe', 'Share']>(['Create', 'Prescribe', 'Share']);
  const taperConfigRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.group('TaperConfigurationPage');
    const id = urlSearchParams.current.get('id');
    console.log('id: ', id);
    console.log('path: ', path);
    console.log('url: ', url);
    console.groupEnd();

    if (id) {
      dispatch<FetchTaperConfigRequestAction>({
        type: FETCH_TAPER_CONFIG_REQUEST,
        data: { clinicianId: me!.id, patientId: currentPatient!.id },
      });
    } else {
      dispatch<InitNewTaperConfigAction>({
        type: INIT_NEW_TAPER_CONFIG,
        data: {
          clinicianId: me!.id,
          patientId: currentPatient!.id,
        },
      });
    }
    return () => {
      // dispatch<EmptyTaperConfigPage>({
      //   type: EMPTY_TAPER_CONFIG_PAGE,
      // });
    };
  }, []);

  useEffect(() => {
    if (location.pathname.includes('create')) {
      setStep(1);
    } else if (location.pathname.includes('edit')) {
      setStep(2);
    } else {
      setStep(3);
    }
  }, [location]);

  useEffect(() => {
    taperConfigRef.current!.scrollTo(0, 0);
  }, [location.pathname]);

  const assignStyle = (stepNumber: number) => {
    return css`
      ${stepNumber === step ? 'color: #0984E3; font-weight: bold;' : 'color: 636E72; font-weight: normal;'}`;
  };

  return (
    <div css={css`
      //height: calc(100vh - 307px);
      //height: calc(100vh - 255px);
      height: 100%;
      overflow-y: scroll;
      padding-right: 10px;
    `} className='taper-configuration'
    ref={taperConfigRef}>
      <div css={patientPageHeaderStyle}>
        <h2>{currentPatient!.name}</h2>
        <div>Last Visit: {format(currentPatient!.recentVisit, 'MM/dd/yyyy')}</div>
        <hr/>
      </div>
      <div css={css`
        font-size: 1.2rem;
        color: #0984E3;
        font-weight: bold;
        margin-bottom: 5px;

        & > hr {
          border: none;
          width: 100%;
          height: 2px;
          margin: 5px auto;
          background-color: #D1D1D1;
        }`}>
        {titles.current[step - 1]}
        <hr/>
      </div>
      <div css={css`display: flex;
        //height: calc(100% - 55px);
        height: 100%;
      `} className='taper-configuration-pages'>
        <Switch>
          <Route path={`${path}/create`}
                 render={checkCurrentPatientAndRender(currentPatient, CreateTaperConfiguration)}/>
          <Route path={`${path}/edit`} render={checkCurrentPatientAndRender(currentPatient, EditTaperConfiguration)}/>
          <Route path={`${path}/confirm`}
                 render={checkCurrentPatientAndRender(currentPatient, ConfirmTaperConfiguration)}/>
        </Switch>
      </div>
    </div>
  );
};

export default TaperConfigurationPage;
