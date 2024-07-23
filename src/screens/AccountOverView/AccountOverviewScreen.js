import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector, shallowEqual } from 'react-redux';

import { ProgressBar, ManageAccess, UploadHerdInfo, ManageFeatures, ManageNotifications } from './components'



export default function AccountOverviewScreen({ navigation }) {

    const { progressBarIndex } = useSelector(state => ({
        progressBarIndex: state.accountOverviewReducer.progressBarIndex,
    }), shallowEqual);

    let UpperView;


    switch (progressBarIndex) {
        case 1: {
            UpperView = ManageAccess;
            break;
        }
        case 2: {
            UpperView = UploadHerdInfo;
            break;
        }
        case 3: {
            UpperView = ManageFeatures;
            break;
        }
        case 4: {
            UpperView = ManageNotifications;
            break;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <StatusBar
                barStyle="light-content"
            />
            <ProgressBar step={progressBarIndex} />
            <UpperView navigation={navigation} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'column',
        flexGrow: 1,
    },
    textInputStyleClass : {
        // textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})