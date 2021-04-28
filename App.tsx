import * as React from 'react';
import {Switch, Route} from 'react-router';
import {Link, BrowserRouter, HashRouter as Router} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import TaperConfigurationPage from "./pages/TaperConfigurationPage";
import LoggingConfigurationPage from "./pages/LoggingConfigurationPage";
import SymptomReportPage from "./pages/SymptomReportPage";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "./redux/reducers";
import {UserState} from "./redux/reducers/user";
import LoginPage from "./pages/LoginPage";
import {useEffect} from "react";
import {LOGIN_REQUEST, LoginRequestAction} from "./redux/actions/user";
import 'antd/dist/antd.css'
const App = () => {
  const {me} = useSelector<RootState, UserState>(state => state.user)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch<LoginRequestAction>({
      type: LOGIN_REQUEST,
      data: { email: 'clinician@gmail.com', password: '1234'}
    })
  }, [])
  return (
    <>
      {!me ? <LoginPage/>
        :
        <Router>
          <div>
            <Link to="/">Home</Link>
            &nbsp;
            <Link to="/taper-configuration">Taper Configuration</Link>
            &nbsp;
            <Link to="/logging-configuration">Logging Configuration</Link>
            &nbsp;
            <Link to="/symptom-report">Symptom Report</Link>
          </div>
          <div>
            <Switch>
              <Route exact path="/" component={HomePage}/>
              <Route path="/taper-configuration" component={TaperConfigurationPage}/>
              <Route path="/logging-configuration" component={LoggingConfigurationPage}/>
              <Route path="/symptom-report" component={SymptomReportPage}/>
            </Switch>
          </div>
        </Router>}
    </>
  )
}

export default App;
