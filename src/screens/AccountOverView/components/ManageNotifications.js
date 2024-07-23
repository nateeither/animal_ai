import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar , Switch} from 'react-native'
import { nf, wp, hp, sw, sh } from '../../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from '../index'

import Modal from "react-native-modalbox"

import { CustomButton1 } from '../../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../../components/common/CustomButtonOutlined';

// import Auth, { AuthEventEmitter, AuthEvents } from 'react-native-firebaseui-auth';
import { ScrollView } from 'react-native-gesture-handler';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import {
    changeProgressIndex,
} from '../../../store/account_overview/actions';
  
import {
    requestGetUsers,
    requestUpdateUserData,
    requestUpdateFarmUserData,
    resetSuccessUpdateUserData,
    resetSuccessGetUsers
} from '../../../store/user/actions';

import {
    requestGetCurrentUser, resetSuccessGetCurrentUser,
} from '../../../store/auth/actions';

// SVG
import Dropdown from '../../../assets/svg/dropdown.svg'
import Close from '../../../assets/svg/close.svg'



export default function ManageNotifications({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const [frequencyModalShown, setFrequencyModalShown] = useState(false)

    const [estrusAlertEmailSwitch, setEstrusAlertEmailSwitch] = useState(false)
    const [estrusAlertSMSSwitch, setEstrusAlertSMSSwitch] = useState(false)
    const [estrusAlertAppSwitch, setEstrusAlertAppSwitch] = useState(false)
    const [estrusAlertFreq, setEstrusAlertFreq] = useState('daily')

    const [bunklineReadingEmailSwitch, setBunklineReadingEmailSwitch] = useState(false)
    const [bunklineReadingSMSSwitch, setBunklineReadingSMSSwitch] = useState(false)
    const [bunklineReadingAppSwitch, setBunklineReadingAppSwitch] = useState(false)
    const [bunklineReadingFreq, setBunklineReadingFreq] = useState('daily')

    const [estrusFreqMode, setEstrusFreqMode] = useState(true)

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { users, getUsersLoading } = useSelector(state => ({
        users: state.userReducer.users,
        getUsersLoading: state.userReducer.getUsersLoading
    }), shallowEqual);

    const { updateUserLoading } = useSelector(state => ({
        updateUserLoading: state.userReducer.updateUserLoading,
    }), shallowEqual);


    const { updateUserSuccess } = useSelector(state => ({
        updateUserSuccess: state.userReducer.updateUserSuccess,
    }), shallowEqual);

    function onChangeProgressIdx(idx) {
        dispatch(changeProgressIndex(idx));
    }

    function onPressFreqMode(mode) {
        if (mode == 'estrus') {
            setEstrusFreqMode(true)
            setFrequencyModalShown(true)
        }
        else {
            setEstrusFreqMode(false)
            setFrequencyModalShown(true)
        }
       
    }

    useEffect(() => {
        if (users && !updateUserSuccess) {

            users.map(user => {
                if (user.uid == currUser.uid) {
                    if (user.estrusAlertNotifications) {
                        user.estrusAlertNotifications.map(alert => {
                            if (alert == 'email') setEstrusAlertEmailSwitch(true)
                            if (alert == 'sms') setEstrusAlertSMSSwitch(true)
                            if (alert == 'app') setEstrusAlertAppSwitch(true)
                        })
                    }
                    if (user.bunklineReadingNotifications) {
                        user.bunklineReadingNotifications.map(notif => {
                            if (notif == 'email') setBunklineReadingEmailSwitch(true)
                            if (notif == 'sms') setBunklineReadingSMSSwitch(true)
                            if (notif == 'app') setBunklineReadingAppSwitch(true)
                        })
                    }
                    
                    if(user.estrusAlertNotificationsFrequency) setEstrusAlertFreq(user.estrusAlertNotificationsFrequency)
                    if(user.bunklineReadingNotificationsFrequency) setBunklineReadingFreq(user.bunklineReadingNotificationsFrequency)
                }
            })
        }
    },[])

    useEffect(() => {
        if (updateUserSuccess) {
            handleAfterUpdateUser()
        }

    }, [updateUserSuccess]);

    const handleAfterUpdateUser = () => {
        dispatch(resetSuccessUpdateUserData())
        onChangeProgressIdx(1)
        toast.show("Data successfully updated!", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
        animationType: 'slide-in', });
        navigation.replace('Overview')
    }


    const handleUpdate = () => {
        // handleUpdateUserData(currUser.uid)
        handleUpdateFarmUserData(currUser.uid)
    }

    // const handleUpdateUserData = (uid) => {
    //     let estrusAlertNotifications = [
    //         estrusAlertEmailSwitch ? 'email' : '',
    //         estrusAlertSMSSwitch ? 'sms' : '',
    //         estrusAlertAppSwitch ? 'app' : '',
    //     ]

    //     let bunklineReadingNotifications = [
    //         bunklineReadingEmailSwitch ? 'email' : '',
    //         bunklineReadingSMSSwitch ? 'sms' : '',
    //         bunklineReadingAppSwitch ? 'app' : '',
    //     ]

    //     estrusAlertNotifications = estrusAlertNotifications.filter(alert => alert)
    //     bunklineReadingNotifications = bunklineReadingNotifications.filter(notif => notif)



    //     const user = {
    //         bunklineReadingNotifications: bunklineReadingNotifications,
    //         estrusAlertNotifications: estrusAlertNotifications,
    //         estrusAlertNotificationsFrequency: estrusAlertFreq,
    //         bunklineReadingNotificationsFrequency: bunklineReadingFreq,
    //     };


    //     dispatch(requestUpdateUserData(uid,user));

    // };

    const handleUpdateFarmUserData = (uid) => {
        let estrusAlertNotifications = [
            estrusAlertEmailSwitch ? 'email' : '',
            estrusAlertSMSSwitch ? 'sms' : '',
            estrusAlertAppSwitch ? 'app' : '',
        ]

        let bunklineReadingNotifications = [
            bunklineReadingEmailSwitch ? 'email' : '',
            bunklineReadingSMSSwitch ? 'sms' : '',
            bunklineReadingAppSwitch ? 'app' : '',
        ]

        estrusAlertNotifications = estrusAlertNotifications.filter(alert => alert)
        bunklineReadingNotifications = bunklineReadingNotifications.filter(notif => notif)

        const user = {
            bunklineReadingNotifications: bunklineReadingNotifications,
            estrusAlertNotifications: estrusAlertNotifications,
            estrusAlertNotificationsFrequency: estrusAlertFreq,
            bunklineReadingNotificationsFrequency: bunklineReadingFreq,
        };

        console.log('uid : ', uid)
        console.log('farm : ', currUser.farm)
        console.log('user : ', user)
       
        dispatch(requestUpdateFarmUserData(uid,currUser.farm,user));
    };

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <ManageNotifContent
                        estrusAlertEmailSwitch={estrusAlertEmailSwitch}
                        estrusAlertSMSSwitch={estrusAlertSMSSwitch}
                        estrusAlertAppSwitch={estrusAlertAppSwitch}
                        estrusAlertFreq={estrusAlertFreq}

                        toogleEstrusAlertEmailSwitch={()=> setEstrusAlertEmailSwitch(!estrusAlertEmailSwitch)}
                        toogleEstrusAlertSMSSwitch={()=> setEstrusAlertSMSSwitch(!estrusAlertSMSSwitch)}
                        toogleEstrusAlertAppSwitch={()=> setEstrusAlertAppSwitch(!estrusAlertAppSwitch)}
                        
                        bunklineReadingEmailSwitch={bunklineReadingEmailSwitch}
                        bunklineReadingSMSSwitch={bunklineReadingSMSSwitch}
                        bunklineReadingAppSwitch={bunklineReadingAppSwitch}
                        
                        toogleBunklineReadingEmailSwitch={()=> setBunklineReadingEmailSwitch(!bunklineReadingEmailSwitch)}
                        toogleBunklineReadingSMSSwitch={()=> setBunklineReadingSMSSwitch(!bunklineReadingSMSSwitch)}
                        toogleBunklineReadingAppSwitch={()=> setBunklineReadingAppSwitch(!bunklineReadingAppSwitch)}
                        
                        bunklineReadingFreq={bunklineReadingFreq}
                        onPressFreq={(mode) =>  onPressFreqMode(mode) } />
                </View>
            </ScrollView>
            <NotificationBottomNav loading={updateUserLoading} onPressBack={() => onChangeProgressIdx(3)} onPressFinish={() => handleUpdate()} />
            {
                frequencyModalShown &&
                <Modal
                    entry="bottom"
                    position={"bottom"}
                    backdropPressToClose={true}
                    swipeToClose={false}
                    coverScreen={true}
                    style={{
                        overflow: "hidden",
                        justifyContent: 'flex-end',
                        alignItems:'center',
                        height: sh,
                        width: sw,
                        backgroundColor: "transparent"
                    }}
                    isOpen={frequencyModalShown}
                    onClosed={() => setFrequencyModalShown(false)}
                >
                    {
                        <FrequencyModal onPressFreq={(freq) => {estrusFreqMode ? setEstrusAlertFreq(freq) : setBunklineReadingFreq(freq), setFrequencyModalShown(false)}} onPressClose={() => setFrequencyModalShown(false)} />
                    }
                </Modal>
            }
        </>
    )
}

const ManageNotifContent = (props) => {
    const {
        estrusAlertEmailSwitch,toogleEstrusAlertEmailSwitch,
        estrusAlertSMSSwitch,toogleEstrusAlertSMSSwitch,
        estrusAlertAppSwitch,toogleEstrusAlertAppSwitch,
        estrusAlertFreq,

        bunklineReadingEmailSwitch,toogleBunklineReadingEmailSwitch,
        bunklineReadingSMSSwitch,toogleBunklineReadingSMSSwitch,
        bunklineReadingAppSwitch,toogleBunklineReadingAppSwitch,
        bunklineReadingFreq,
        
        onPressFreq
    } = props;
    
    return (
        <>
            <View style={{marginVertical:20}}>
                <Text style={[Fonts.h4, { marginBottom: 12 }]}>Notification configurations</Text>
                <Text style={[Fonts.bodySmall, {marginBottom:12}]}>Add short description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ultrices magna. Donec sodales, leo eu max</Text>
            </View>
            <View style={{
                width:'100%',marginBottom: 20, alignSelf:'center', alignItems:'center'
            }}>
                <View style={{width:'100%', alignItems:'center', justifyContent:'center', padding:14, backgroundColor: Colors.orange40, borderRadius: 8}}>
                    <View style={{alignItems:'flex-start'}}>
                        <Text style={[Fonts.h4, { marginBottom: 16 }]}>Notifications</Text>
                        <Text style={[Fonts.bodySmall, { marginBottom: 16 }]}>Add short description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ultrices magna. Donec sodales, leo eu max</Text>
                    </View>
                    <EstrusNotificationCard
                        estrusAlertEmailSwitch={estrusAlertEmailSwitch}
                        estrusAlertSMSSwitch={estrusAlertSMSSwitch}
                        estrusAlertAppSwitch={estrusAlertAppSwitch}
                        estrusAlertFreq={estrusAlertFreq}
                         
                        toogleEstrusAlertEmailSwitch={toogleEstrusAlertEmailSwitch}
                        toogleEstrusAlertSMSSwitch={toogleEstrusAlertSMSSwitch}
                        toogleEstrusAlertAppSwitch={toogleEstrusAlertAppSwitch}
                        
                        onPressFreq={() => onPressFreq('estrus')} />
                    <BunklineNotificationCard
                        bunklineReadingEmailSwitch={bunklineReadingEmailSwitch}
                        bunklineReadingSMSSwitch={bunklineReadingSMSSwitch}
                        bunklineReadingAppSwitch={bunklineReadingAppSwitch}
                        bunklineReadingFreq={bunklineReadingFreq}

                        toogleBunklineReadingEmailSwitch={toogleBunklineReadingEmailSwitch}
                        toogleBunklineReadingSMSSwitch={toogleBunklineReadingSMSSwitch}
                        toogleBunklineReadingAppSwitch={toogleBunklineReadingAppSwitch}
                        
                        onPressFreq={() => onPressFreq('bunkline')} />
                </View>
            </View>
            <View style={{height: hp(10),marginBottom: 'auto'}} />
        </>
    );
}


const EstrusNotificationCard = (props) => {
    const {
        onPressFreq,
        estrusAlertEmailSwitch, 
        estrusAlertSMSSwitch,
        estrusAlertAppSwitch,
        toogleEstrusAlertEmailSwitch,
        toogleEstrusAlertSMSSwitch,
        toogleEstrusAlertAppSwitch,
        estrusAlertFreq
    } = props;

    return (
        <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginBottom:16, padding:12, backgroundColor: Colors.white, borderRadius: 8}}>
            <View style={{ alignSelf:'flex-start'}}>
                <Text style={[Fonts.h5, { marginBottom: 12 }]}>Estrus alert</Text>
            </View>
            <View style={{ width:'100%',flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toogleEstrusAlertEmailSwitch}
                        value={estrusAlertEmailSwitch}
                    />
                    <Text style={[Fonts.bodySmall, {marginTop:8}]}>Via email</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toogleEstrusAlertSMSSwitch}
                        value={estrusAlertSMSSwitch}
                    />
                    <Text style={[Fonts.bodySmall, {marginTop:8}]}>Via sms</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toogleEstrusAlertAppSwitch}
                        value={estrusAlertAppSwitch}
                    />
                    <Text style={[Fonts.bodySmall, {marginTop:8}]}>Via app</Text>
                </View>
            </View>
            <TouchableOpacity onPress={onPressFreq} activeOpacity={1} style={{width:'100%', height:44, marginTop:22, paddingRight:17, paddingLeft:20, backgroundColor: Colors.white, borderRadius: 5, borderWidth:1, borderColor: Colors.orange60, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <Text style={[Fonts.bodySmall]}>{estrusAlertFreq == 'daily' ? 'Daily' : estrusAlertFreq == 'realtime' ? 'Real time' : 'Half-day'}</Text>
                <Dropdown width={14} height={14} />
            </TouchableOpacity>
        </View>
    )
}

const BunklineNotificationCard = (props) => {
    const {
        onPressFreq,
        bunklineReadingEmailSwitch,
        bunklineReadingSMSSwitch,
        bunklineReadingAppSwitch,
        toogleBunklineReadingEmailSwitch,
        toogleBunklineReadingSMSSwitch,
        toogleBunklineReadingAppSwitch,
        bunklineReadingFreq
    } = props;

    return (
        <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginBottom:16, padding:12, backgroundColor: Colors.white, borderRadius: 8}}>
            <View style={{ alignSelf:'flex-start'}}>
                <Text style={[Fonts.h5, { marginBottom: 12 }]}>Bunkline reading</Text>
            </View>
            <View style={{ width:'100%',flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toogleBunklineReadingEmailSwitch}
                        value={bunklineReadingEmailSwitch}
                    />
                    <Text style={[Fonts.bodySmall, {marginTop:8}]}>Via email</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toogleBunklineReadingSMSSwitch}
                        value={bunklineReadingSMSSwitch}
                    />
                    <Text style={[Fonts.bodySmall, {marginTop:8}]}>Via sms</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toogleBunklineReadingAppSwitch}
                        value={bunklineReadingAppSwitch}
                    />
                    <Text style={[Fonts.bodySmall, {marginTop:8}]}>Via app</Text>
                </View>
            </View>
            <TouchableOpacity onPress={onPressFreq} activeOpacity={1} style={{width:'100%', height:44, marginTop:22, paddingRight:17, paddingLeft:20, backgroundColor: Colors.white, borderRadius: 5, borderWidth:1, borderColor: Colors.orange60, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <Text style={[Fonts.bodySmall]}>{bunklineReadingFreq == 'daily' ? 'Daily' : bunklineReadingFreq == 'realtime' ? 'Real time' : 'Half-day'}</Text>
                <Dropdown width={14} height={14} />
            </TouchableOpacity>
        </View>
    )
}



const NotificationBottomNav = (props) => {
    const { loading, onPressBack, onPressFinish } = props;
    
    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            // paddingBottom: 20,
        }}>
            <View style={{
                    height: '100%',
                    justifyContent:'center'
            }}>
                <View style={{
                    width: '90%',
                    alignSelf:'center',
                    paddingVertical:25,
                    // paddingHorizontal: 20,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <CustomButtonOutlined1 title="Back" onPress={onPressBack} style={{width:'48.5%'}} />
                    <CustomButton1 disabled={loading} loading={loading} title="Finish" onPress={onPressFinish} style={{width:'48.5%'}}  />
                </View >
            </View>
        </View>
    )
}


const FrequencyModal = (props) => { 
    const { onPressFreq, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(30),
            backgroundColor: Colors.white,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            // justifyContent: 'space-between',
            alignItems: 'flex-start',
        }}>

            <View style={{
                width: '90%',
                height: 48,
                marginBottom:8,
                alignSelf: 'center',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-between'
            }}>
                <Text style={Fonts.h6}>Frequency</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                <TouchableOpacity onPress={() => onPressFreq('realtime')}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Real time</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressFreq('halfday')}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Half-day</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressFreq('daily')}>
                    <Text style={Fonts.bodyLarge}>Daily</Text>
                </TouchableOpacity>
            </View>
        </View>
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