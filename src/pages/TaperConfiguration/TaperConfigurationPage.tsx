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
import { RootState } from '../../redux/reducers';
import {
  FETCH_TAPER_CONFIG_REQUEST,
  FetchTaperConfigRequestAction,
  INIT_NEW_TAPER_CONFIG,
  InitTaperConfigAction,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyTaperConfigPage,
} from '../../redux/actions/taperConfig';
import { CreateTaperConfiguration, EditTaperConfiguration, ConfirmTaperConfiguration } from './index';
import { UserState } from '../../redux/reducers/user';
import { checkCurrentPatientAndRender } from '../utils';

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

const TaperConfigurationPage = () => {
  const dispatch = useDispatch();
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
      dispatch<InitTaperConfigAction>({
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
    console.group('TaperConfigurationPage Url/location');
    console.log('location: ', location);
    console.log(url);
    console.groupEnd();
  });

  const assignStyle = (stepNumber: number) => {
    return css`
      ${stepNumber === step ? 'color: #0984E3; font-weight: bold;' : 'color: 636E72; font-weight: normal;'}`;
  };

  return (
    <div css={css`
      //height: calc(100vh - 307px);
      height: calc(100vh - 255px);
    `} className='taper-configuration'>
      <div css={navTextStyle} className='taper-configuration-nav-text'>
        <div css={assignStyle(1)} className='nav-step1'>Step 1. Create</div>
        <div>&gt;&gt;</div>
        <div css={assignStyle(2)} className='nave-step2'>Step 2. Prescribe</div>
        <div>&gt;&gt;</div>
        <div css={assignStyle(3)} className='nav-step3'>Step 3. Confirm</div>
      </div>
        <div css={css`display: flex;
          height: calc(100% - 55px);
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
