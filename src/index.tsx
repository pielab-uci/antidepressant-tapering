import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { StateInspector } from 'reinspect';
import App from './App';
import store from './redux/configureStore';

ReactDOM.render(
  <StateInspector name="PrescriptionForms">
    <Provider store={store}>
      <App />
    </Provider>
  </StateInspector>,
  document.querySelector('#root'),
);
