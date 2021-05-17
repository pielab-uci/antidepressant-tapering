import * as React from 'react';
// import { Switch, Route } from 'react-router-dom';
import {
  Link, HashRouter as Router, Switch, Route,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import TaperConfigurationPage from './pages/TaperConfigurationPage';
import LoggingConfigurationPage from './pages/LoggingConfigurationPage';
import SymptomReportPage from './pages/SymptomReportPage';
import { RootState } from './redux/reducers';
import { UserState } from './redux/reducers/user';
import LoginPage from './pages/LoginPage';
import { LOGIN_REQUEST, LoginRequestAction } from './redux/actions/user';
import 'antd/dist/antd.css';
import CheckPatientRoute from './components/CheckPatientRoute';
import CheckPatientLink from './components/CheckPatientLink';

const App = () => {
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch<LoginRequestAction>({
      type: LOGIN_REQUEST,
      data: { email: 'clinician@gmail.com', password: '1234' },
    });
  }, []);
  return (
    <>
      {!me ? <LoginPage />
        : (
          <Router>
             <div>
              <Link to="/">Home</Link>
             &nbsp;
               <CheckPatientLink to={'/taper-configuration'} title={'Taper Configuration'}/>
             &nbsp;
               <CheckPatientLink to={'/logging-configuration'} title={'Logging Configuration'}/>
             &nbsp;
               <CheckPatientLink to={'/symptom-report'} title={'Symptom Report'}/>
             </div>
            <div>
              <Switch>
                <CheckPatientRoute path='/taper-configuration' component={TaperConfigurationPage}/>
                <CheckPatientRoute path='/logging-configuration' component={LoggingConfigurationPage}/>
                <CheckPatientRoute path='/symptom-report' component={SymptomReportPage}/>
                <Route path="/" component={HomePage} />
              </Switch>
            </div>
          </Router>
        )}
    </>
  );
};

export default App;
