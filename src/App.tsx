import * as React from 'react';
import {
  HashRouter as Router, Switch, Route,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { css } from '@emotion/react';
import HomePage from './pages/HomePage';
import TaperConfigurationPage from './pages/TaperConfiguration/TaperConfigurationPage';
import LoggingConfigurationPage from './pages/LoggingConfigurationPage';
import SymptomReportPage from './pages/SymptomReportPage';
import { RootState } from './redux/reducers';
import { UserState } from './redux/reducers/user';
import LoginPage from './pages/LoginPage';
import { LOGIN_REQUEST, LoginRequestAction } from './redux/actions/user';
import 'antd/dist/antd.css';
import { checkCurrentPatientAndRender } from './pages/utils';
import NavBar from './components/NavBar';
import Header from './components/Header';

const mainStyle = css`
  flex: 1;
  padding: 52px 59px 34px 65px;
  & > div {
    background-color: #fafafa;
    box-shadow: 0 3px 6px black;
    border-radius: 20px;
    //margin: 52px 59px 0 65px;
    //width: 100%;
    
    height: 100%;
    padding: 31px 88px 21px 88px;
  }
`;
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
            <div css={css`
              height: 100%;
              display: flex;
              flex-direction: column;`}>
              <Header/>
              <section css={css`
                display: flex;
                height: calc(100% - 70px);`}>
                <NavBar/>
                <main css={mainStyle}>
                   <div>
                    <Switch>
                      {/* <Route path='/taper-configuration' */}
                      {/*       render={checkCurrentPatientAndRender(currentPatient, TaperConfigurationPage)}/> */}
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
        )}
    </>
  );
};

export default App;
