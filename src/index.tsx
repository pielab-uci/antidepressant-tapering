import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FC } from 'react';
import { Provider } from 'react-redux';
import { StateInspector } from 'reinspect';
import App from './App';
import store from './redux/store';

const AppComponentOnMode: FC<{ component: JSX.Element, mode?: string }> = ({ component, mode }) => (mode && mode === 'production'
  ? <>{component}</>
  : <StateInspector name="PrescriptionForms">{component}</StateInspector>);
const AppComponent: JSX.Element = <Provider store={store}><App/></Provider>;

ReactDOM.render(
  <AppComponentOnMode component={AppComponent} mode={process.env.NODE_ENV}/>,
  document.querySelector('#root'),
);
