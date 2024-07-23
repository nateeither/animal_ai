import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware, Store} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer, Persistor} from 'redux-persist';
import createSagaMiddleware from '@redux-saga/core';

import {rootReducer, RootState} from './rootReducer';
import {rootSagas} from './rootSagas';

const persistConfig = { 
  key: 'root',
  storage: AsyncStorage,
};

export const configureStore = () => {
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    // rootReducer,
    persistedReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSagas)

  const persistor = persistStore(store)

  const resetPersistStore = () => resetPersistedStore(persistor)

  return {store, persistor, resetPersistStore}
}

export const resetPersistedStore = (persistor) => {
  return new Promise((resolve, reject) => {
    console.log('masuk sini ga yaa')
    AsyncStorage.removeItem('persist:root');

    persistor.purge().then(() => { persistor.flush(); persistor.pause(); persistor.persist(); });
  })
}