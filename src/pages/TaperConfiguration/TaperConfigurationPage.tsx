import * as React from 'react';
import {
  createContext,
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
  font-size: 20px;
  color: #636E72;
  margin-bottom: 24px;

  & > div {
    margin-right: 22px;
  }
`;
export const TaperConfigurationPageContext = createContext<{ setStep:(step: 1 | 2 | 3) => void; }>({
  setStep: (step: 1 | 2 | 3) => {
  },
});

const TaperConfigurationPage = () => {
  const dispatch = useDispatch();
  const { currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { path, url } = useRouteMatch();
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
        data: parseInt(id, 10),
      });
    } else {
      dispatch<InitTaperConfigAction>({
        type: INIT_NEW_TAPER_CONFIG,
        data: {
          clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10),
          patientId: parseInt(urlSearchParams.current.get('patientId')!, 10),
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
    console.group('TaperConfigurationPage Url');
    console.log(url);
    console.groupEnd();
  });

  const assignStyle = (stepNumber: number) => {
    return css`
      ${stepNumber === step ? 'color: #0984E3; font-weight: bold;' : 'color: 636E72; font-weight: normal;'}`;
  };

  return (
    <div css={css`
      height: calc(100vh - 307px);
    `} className='taper-configuration'>
      <div css={navTextStyle} className='taper-configuration-nav-text'>
        <div css={assignStyle(1)} className='nav-step1'>Step 1. Create</div>
        <div>&gt;&gt;</div>
        <div css={assignStyle(2)} className='nave-step2'>Step 2. Prescribe</div>
        <div>&gt;&gt;</div>
        <div css={assignStyle(3)} className='nav-step3'>Step 3. Confirm</div>
      </div>
      <TaperConfigurationPageContext.Provider value={{
        setStep,
      }}>
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
      </TaperConfigurationPageContext.Provider>
    </div>
  );
};

export default TaperConfigurationPage;
