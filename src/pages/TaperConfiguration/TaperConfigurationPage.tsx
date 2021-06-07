import * as React from 'react';
import {
  useCallback, useEffect, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Prompt, useHistory, useLocation, useRouteMatch,
} from 'react-router';
import { Switch } from 'react-router-dom';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import {
  FETCH_TAPER_CONFIG_REQUEST,
  FetchTaperConfigRequestAction,
  INIT_NEW_TAPER_CONFIG,
  InitTaperConfigAction,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyTaperConfigPage,
} from '../../redux/actions/taperConfig';
import { CreateTaperConfiguration, EditTaperConfiguration, ConfirmTaperConfiguration } from './index';
import CheckPatientRoute from '../../components/CheckPatientRoute';

const TaperConfigurationPage = () => {
  const dispatch = useDispatch();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const history = useHistory();
  const { path, url } = useRouteMatch();

  useEffect(() => {
    const id = urlSearchParams.current.get('id');
    console.log('id: ', id);
    console.log('path: ', path);
    console.log('url: ', url);
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
    // history.push('/');
    return () => {
      dispatch<EmptyTaperConfigPage>({
        type: EMPTY_TAPER_CONFIG_PAGE,
      });
    };
  }, []);

  return (
    <>
      <Switch>
        <CheckPatientRoute path={`${path}/create`} component={CreateTaperConfiguration}/>
        <CheckPatientRoute path={`${path}/edit`} component={EditTaperConfiguration}/>
        <CheckPatientRoute path={`${path}/confirm`} component={ConfirmTaperConfiguration}/>
      </Switch>

    </>
  );
};

export default TaperConfigurationPage;
