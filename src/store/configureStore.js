//NON REDUX PERSIST CONFIGURATION
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Reactotron from '../config/ReactotronConfig';
import combineReducers from './reducers/';
import { rootSaga } from './sagas/';

let store;

if (!__DEV__) {
    // Middleware: Redux Saga
    sagaMiddleware = createSagaMiddleware();
    middleware = applyMiddleware(sagaMiddleware);
    // Redux: Store
    store = createStore(
        combineReducers,
        middleware,
    )
} else {
    sagaMonitor = Reactotron.createSagaMonitor();
    sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    middleware = applyMiddleware(sagaMiddleware);
    enhancer = compose(middleware, Reactotron.createEnhancer());
    store = createStore(combineReducers, enhancer)
}

sagaMiddleware.run(rootSaga);

export { store };
