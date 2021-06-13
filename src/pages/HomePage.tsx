import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { GrNotification } from 'react-icons/gr';
import { css } from '@emotion/react';
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
  const { me, patients } = useSelector<RootState, UserState>((state) => state.user);

  useEffect(() => {
    dispatch<LoadPatientsRequestAction>({
      type: LOAD_PATIENTS_REQUEST,
      data: me!.id,
    });
  }, [me]);

  return (
    <div css={css`height:100%;`}>
      <div
        className='home-content'
        css={css`
        display: flex;
        //border: 1px solid black;
        flex-direction: row;
        height: 100%;`
      }>

        <section css={css`
          flex: 1;
          `}>
          <Switch>
            <Route exact path="/" render={() => <PatientsList patients={patients}/>}/>
            <Route path="/patient/:patientId" component={PatientPage}/>
          </Switch>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
