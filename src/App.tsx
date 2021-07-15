import * as React from 'react';
import {
  HashRouter as Router, Switch, Route,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { css } from '@emotion/react';
import HomePage from './pages/HomePage';
import LoggingConfigurationPage from './pages/LoggingConfigurationPage';
import SymptomReportPage from './pages/SymptomReportPage';
import { RootState } from './redux/reducers';
import { UserState } from './redux/reducers/user';
import LoginPage from './pages/LoginPage';
import 'antd/dist/antd.css';
import { checkCurrentPatientAndRender } from './pages/utils';
import NavBar from './components/NavBar';
import Header from './components/Header';
import './app.css';

const mainStyle = css`
  flex: 1;
  //padding: 0 35px 34px 35px;
  padding: 0 15px 20px 15px;

  & > div {
    background-color: #fafafa;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    border-radius: 20px;
    height: 100%;
    //padding: 31px 45px 21px 45px;
    padding: 20px 10px 15px 20px;
  }
`;
const App = () => {
  const { me, currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  /*
  useEffect(() => {
    // dispatch<LoginRequestAction>({
    //   type: LOGIN_REQUEST,
    //   data: { email: 'clinician@gmail.com', password: '1234' },
    // });
  }, []);
   */

  return (
    <>
      {!me ? <LoginPage/>
        : (
          <>
            <Router>
              <div css={css`
                height: 100%;
                display: flex;
                font-family: Verdana;
                flex-direction: column;

                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button {
                  opacity: 1;
                }`}>
                <Header/>
                <section css={css`
                  display: flex;
                  height: 95%;
                  //padding-top: 2%;
                  padding-top: 1%;
                `}>
                  <NavBar/>
                  <main css={mainStyle}>
                    <div>
                      <Switch>
                        <Route path='/logging-configuration'
                               render={checkCurrentPatientAndRender(currentPatient, LoggingConfigurationPage)}/>
                        <Route path='/symptom-report'
                               render={checkCurrentPatientAndRender(currentPatient, SymptomReportPage)}/>
                        <Route path="/" component={HomePage}/>
                      </Switch>
                    </div>
                  </main>
                </section>
              </div>
            </Router>
          </>
        )}
    </>
  );
};

export default App;
