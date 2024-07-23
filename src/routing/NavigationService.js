import * as React from 'react'

// NavigationContainer is refered here - Check Rootstack
export const navigationRef = React.createRef()

let _navigator

function setTopLevelNavigator(navigationRef) {
    _navigator = navigationRef
}

function navigate(name, params) {
    navigationRef.current?.navigate(name, params)
}

function goBack() {
    navigationRef.current?.goBack()
}

export default {
    setTopLevelNavigator,
    navigate,
    goBack
}