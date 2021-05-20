import {
  AnyAction, applyMiddleware, compose, createStore, Middleware, Store,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { Task } from 'redux-saga';

import reducer, { RootState } from './reducers';
import rootSaga from './sagas';

interface SagaStore extends Store<RootState, AnyAction> {
  sagaTask: Task;
}

const sagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware];
const enhancer = process.env.NODE_ENV === 'production'
  ? compose(applyMiddleware(...middlewares))
  : composeWithDevTools(applyMiddleware(...middlewares));

const store = createStore(reducer, enhancer);
(store as unknown as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

export default store;
