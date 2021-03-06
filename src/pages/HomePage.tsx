import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { GrNotification } from 'react-icons/gr';
import { css } from '@emotion/react';
import { useHistory } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PatientsList from '../components/PatientsList';
import {
  LOAD_PATIENTS_REQUEST,
  LoadPatientsRequestAction,
} from '../redux/actions/user';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import PatientPage from './PatientPage';

const HomePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { me, patients, currentPatient } = useSelector<RootState, UserState>((state) => state.user);

  useEffect(() => {
    // if (!me) {
    //   console.log('Move from HomePage to LoginPage');
    //   history.push('/');
    // } else {
    dispatch<LoadPatientsRequestAction>({
      type: LOAD_PATIENTS_REQUEST,
      data: me!.id,
    });
    // }
  }, [me]);

  return (
        <section css={css`
          //flex: 1;
          height: 100%;
          `}>
          <Switch>
            <Route exact path="/" render={() => <PatientsList patients={patients}/>}/>
            <Route path="/patient/:patientId" component={PatientPage}/>
          </Switch>
        </section>
  );
};

export default HomePage;
