import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App'
import {Provider} from 'react-redux';
import store from './redux/configureStore'
import {StateInspector} from "reinspect";

ReactDOM.render(
  <StateInspector name="PrescriptionForms">
    <Provider store={store}>
      <App/>
    </Provider>
  </StateInspector>
  , document.querySelector('#root'))
