import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, Switch, ActivityIndicator } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import EyeHidden from '../../assets/svg/eye-hidden.svg'
import ExclamationMark from '../../assets/svg/exclamation-mark.svg'
import moment from 'moment'

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    requestGetNotifications,
} from '../../store/notification/actions';

export default function NotificationScreen({ navigation }) {
    const dispatch = useDispatch();

    const { notifications } = useSelector(state => ({
        notifications: state.notificationReducer.notifications,
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { getNotificationsLoading } = useSelector(state => ({
        getNotificationsLoading: state.notificationReducer.getNotificationsLoading,
    }), shallowEqual);

    const handleGetNotifications = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetNotifications(farmUid));
        }
    };

    useEffect(() => {
        handleGetNotifications(currUser.farm)
      }, []);

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                {
                    getNotificationsLoading ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator
                                style={{ alignSelf: 'center' }}
                                size='large'
                                color={Colors.orange80} />
                        </View>
                        :
                    notifications.length == 0 ?
                    <NoNotifContent />
                        :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                            <NotificationListContent
                                notifications={notifications}
                                    onPressNotif={(notif) => navigation.navigate('NotificationDetailScreen', {notifData: notif})}
                            />
                        </View>
                        <View style={{height: hp(5), marginBottom:'auto'}} />
                    </ScrollView>
                }   
            </View>
        </SafeAreaView>
    )
}

const NotificationListContent = (props) => {
    const { notifications, onPressNotif } = props;
    
    return (
        <View>
            {
                notifications.map(item => (
                    <NotificationCard notifData={item} onPressNotif={(notif) => onPressNotif(notif)} />
                ))
            }
            <View style={{height: hp(20),marginBottom: 'auto'}} />
        </View>
    )
}


const NotificationCard = (props) => {
    const { notifData, onPressNotif } = props;

    return (
        <TouchableOpacity
            onPress={() => onPressNotif(notifData)}
            style={{
            width:'100%', marginTop: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:16, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{alignSelf:'flex-start',alignItems:'center', justifyContent: 'center',paddingHorizontal: 12, borderRadius: 35, height: 26, backgroundColor: Colors.alertGreen20, marginBottom: 16}}>
                    <Text style={[Fonts.captionRegular, { color: Colors.alertGreen }]}>{moment(notifData.date).format('YY/MM/DD')} • {moment(notifData.date).format('HH:mm')}</Text>
                </View>
                <View>
                    <Text style={[Fonts.bodyMedium, { marginBottom: 6 }]}>{notifData.title}</Text>
                    <Text style={Fonts.bodySmall}>{notifData.description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const NoNotifContent = (props) => {

    return (
        <>
            <View style={{ width: '50%', alignSelf:'center', alignItems:'center', marginTop: hp(20), marginBottom: 40  }}>
                <View style={{width:80, height: 80, borderRadius: 40, marginBottom: 20, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                    <ExclamationMark width={38} height={38}/>
                </View>
                <Text style={[Fonts.h2, {textAlign:'center'}]}>You don't have notifications yet</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'column',
        flexGrow: 1,
    },
    textInputStyleClass : {
        textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})