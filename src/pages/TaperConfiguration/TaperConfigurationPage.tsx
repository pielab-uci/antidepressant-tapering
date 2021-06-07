import * as React from 'react';
import {
  useEffect, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useLocation, useRouteMatch,
} from 'react-router';
import { Route, Switch } from 'react-router-dom';
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

const TaperConfigurationPage = () => {
  const dispatch = useDispatch();
  const { currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { path, url } = useRouteMatch();

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
      dispatch<EmptyTaperConfigPage>({
        type: EMPTY_TAPER_CONFIG_PAGE,
      });
    };
  }, []);

  return (
    <>
      <Switch>
        <Route path={`${path}/create`} render={checkCurrentPatientAndRender(currentPatient, CreateTaperConfiguration)}/>
        <Route path={`${path}/edit`} render={checkCurrentPatientAndRender(currentPatient, EditTaperConfiguration)}/>
        <Route path={`${path}/confirm`} render={checkCurrentPatientAndRender(currentPatient, ConfirmTaperConfiguration)}/>
      </Switch>

    </>
  );
};

export default TaperConfigurationPage;
