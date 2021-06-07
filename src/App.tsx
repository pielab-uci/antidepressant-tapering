import * as React from 'react';
import {
  Link, HashRouter as Router, Switch, Route,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import TaperConfigurationPage from './pages/TaperConfiguration/TaperConfigurationPage';
import LoggingConfigurationPage from './pages/LoggingConfigurationPage';
import SymptomReportPage from './pages/SymptomReportPage';
import { RootState } from './redux/reducers';
import { UserState } from './redux/reducers/user';
import LoginPage from './pages/LoginPage';
import { LOGIN_REQUEST, LoginRequestAction } from './redux/actions/user';
import 'antd/dist/antd.css';
import { checkAndRenderLink, checkCurrentPatientAndRender } from './pages/utils';

const App = () => {
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch<LoginRequestAction>({
      type: LOGIN_REQUEST,
      data: { email: 'clinician@gmail.com', password: '1234' },
    });
  }, []);

  return (
    <>
      {!me ? <LoginPage/>
        : (
          <Router>
            <div>
              <Link to="/">Home</Link>
              &nbsp;
              {checkAndRenderLink(currentPatient, '/taper-configuration', 'Taper Configuration')}
              &nbsp;
              {checkAndRenderLink(currentPatient, '/logging-configuration', 'Logging Configuration')}
              &nbsp;
              {checkAndRenderLink(currentPatient, '/symptom-report', 'Symptom Report')}
            </div>
            <div>
              <Switch>
                <Route path='/taper-configuration'
                       render={checkCurrentPatientAndRender(currentPatient, TaperConfigurationPage)}/>
                <Route path='/logging-configuration'
                       render={checkCurrentPatientAndRender(currentPatient, LoggingConfigurationPage)}/>
                <Route path='/symptom-report' render={checkCurrentPatientAndRender(currentPatient, SymptomReportPage)}/>
                <Route path="/" component={HomePage}/>
              </Switch>
            </div>
          </Router>
        )}
    </>
  );
};

export default App;
