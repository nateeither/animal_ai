import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux';
import RootStack from '../src/routing/RootStack'
// import { store } from './store/configureStore'
import {configureStore} from '../src/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen'
import { Colors } from './constants'
import { ToastProvider } from 'react-native-toast-notifications'

const {store} = configureStore();

global.ErrorUtils.setGlobalHandler(function (error) {
    if (error) {
        // crashlytics().recordError(new Error(error));
    }
});

const App = () => {

    useEffect(() => {
        SplashScreen.hide()
    }, [])

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent={true} />
            <Provider store={store} >
                <ToastProvider duration={5000}>
                    <RootStack />
                </ToastProvider>
            </Provider>
        </SafeAreaProvider>
    )
}

export default App;