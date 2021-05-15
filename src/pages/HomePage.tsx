import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import NavBar from '../components/NavBar';
import PatientsList from '../components/PatientsList';
import { LOAD_PATIENTS_REQUEST, LoadPatientsRequestAction } from '../redux/actions/user';
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
    <div style={{ width: '800px', height: '600px', border: '1px solid black' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <h2>Home</h2>
        <button>New Patient</button>
      </div>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <NavBar/>
      <Switch>
        <Route exact path="/" render={() => <PatientsList patients={patients}/>}/>
        <Route path="/patient/:patientId" component={PatientPage}/>
      </Switch>
    </div>
    </div>
  );
};

export default HomePage;
