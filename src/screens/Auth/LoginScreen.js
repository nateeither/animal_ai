import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, Keyboard, Touchable } from 'react-native'
import { nf, wp, hp, sh , sw } from '../../utils/utility'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'


import { CustomButton1 } from '../../components/common/CustomButton';

// import Auth, { AuthEventEmitter, AuthEvents } from 'react-native-firebaseui-auth';
import auth from '@react-native-firebase/auth';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

// SVG
import DjurvaktLogo from '../../assets/svg/djurvakt-logo.svg'
import Eye from '../../assets/svg/eye-default.svg'
import EyeHidden from '../../assets/svg/eye-hidden.svg'
import CheckBox from '../../assets/svg/checkbox.svg'
import CheckBoxFilled from '../../assets/svg/checkbox-filled.svg'
import DropdownBlack from '../../assets/svg/dropdown-black.svg'
import Close from '../../assets/svg/close.svg'

// Country SVG
import English from '../../assets/svg/languages/eng.svg'
import Swedish from '../../assets/svg/languages/swedish.svg'
import German from '../../assets/svg/languages/german.svg'
import Switzerland from '../../assets/svg/languages/switzerland.svg'
import { ScrollView } from 'react-native-gesture-handler'

import Modal from "react-native-modalbox"

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    requestSignInEmailPassword,
} from '../../store/auth/actions';

import {
    requestGetFarmData,
} from '../../store/user/actions';

import {
    requestGetUsers,
} from '../../store/user/actions';

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [hidePass, setHidePass] = useState(true)
    const [rememberMe, setRememberMe] = useState(false)
    const [showLang, setShowLang] = useState(true)
    // const [loginLoading, setLoginLoading] = useState(false)
    const [selectLangModalShown, setSelectLangModalShown] = useState(false)

    const { isLoading } = useSelector(state => ({
        isLoading: state.authReducer.isLoading,
    }), shallowEqual);

    const { isLogged } = useSelector(state => ({
        isLogged: state.authReducer.isLogged,
    }), shallowEqual);

    const { setupProgressDone } = useSelector(state => ({
        setupProgressDone: state.accountOverviewReducer.setupProgressDone,
    }), shallowEqual);

    const { error } = useSelector(state => ({
        error: state.authReducer.error,
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);

    const [selectedLang, setSelectedLang] = useState("english")

    // function setCurrUser (usr) {
    //     dispatch({
    //         type: types.SET_CURRENT_USER,
    //         payload: usr
    //     })
    // }

    useEffect(() => {
        if (error) {
            if (error === 'auth/email-already-in-use') {
                toast.show("That email address is already in use!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in'});
                console.log('That email address is already in use!');
            }

            if (error === 'auth/invalid-email') {
                toast.show("That email address is invalid!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in'});
                console.log('That email address is invalid!');
            }

            if (error === 'auth/user-not-found') {
                toast.show("There is no user record corresponding to this identifier. The user may have been deleted.", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in',});
                console.log('There is no user record corresponding to this identifier. The user may have been deleted.');
            }

            if (error === 'auth/wrong-password') {
                toast.show("The password is invalid or the user does not have a password.", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in',});
                console.log('The password is invalid or the user does not have a password.');
            }

            if (error === 'auth/network-request-failed') {
                toast.show("Network error", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in',});
                console.log('Network error');
            }
        }
        
        if (isLogged) {
            handleGetFarmData(currUser.farm ? currUser.farm : '')
            handleGetUsers(currUser.farm ? currUser.farm : '')
        }
        
        const showListener =  Keyboard.addListener("keyboardDidShow", () => {
            setShowLang(false)
        })

        const hideListener = Keyboard.addListener("keyboardDidHide", () => {
            setShowLang(true)
        })

        return () => {
            showListener.remove()
            hideListener.remove()
        }

    }, [error, isLogged]);
    
    useEffect(() => {
        if (isLogged) {
            if (currUser.uid != farmData.admin) {
                navigation.replace('Overview')
            }
            else {
                if ((isLogged && !setupProgressDone) && (currUser.uid == farmData.admin)) {
                    navigation.replace('AccountOverviewScreen')
                }
        
                if ((isLogged && setupProgressDone) && (currUser.uid == farmData.admin)) { navigation.replace('Overview') }    
            }
        }
    },[farmData, setupProgressDone])

    const handleSignIn = (email, password) => {

        if (email != '' & password != '') {
            const user = {email, password};
            dispatch(requestSignInEmailPassword(user));
        }

        if (email == '') {
            toast.show("Email cannot be empty!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }

        if (password == '') {
            toast.show("Password cannot be empty!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }
    };

    const handleGetFarmData = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetFarmData(farmUid));
        }
    };

    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };

    
    return (
        <SafeAreaView style={{flex:1, backgroundColor: Colors.white }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{alignItems:'center', marginBottom:30, marginTop:102}}>
                        {/* <DjurvaktLogo width={124} height={124} /> */}
                        <Image source={Icons.djurvaktLogo} resizeMode='contain' style={{width:100, height:100, borderRadius: 10}} /> 
                    </View>

                    <View style={{ justifyContent:'flex-start' }}>
                        <Text style={Fonts.h1}>Login</Text>
                        
                        <View style={{marginTop:24}}>
                            <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Email</Text>
                            <TextInput 
                                autoCapitalize="none"    
                                autoCorrect={false}
                                style={[Fonts.bodySmall, styles.textInputStyleClass]}
                                placeholder="Type here" 
                                mode='outlined'
                                placeholderTextColor={Colors.neutral80}
                                onChangeText={text => setEmail(text)}
                            />
                        </View>

                        <View style={{marginTop:12}}>
                            <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Password</Text>
                            <View style={[styles.textInputStyleClass, {flexDirection:'row', alignItems:'center'}]}>
                                <TextInput
                                    autoCapitalize="none"    
                                    autoCorrect={false}
                                    secureTextEntry={hidePass}
                                    textContentType='password'  
                                    style={[Fonts.bodySmall,{ flex: 1, lineHeight: 30 }]}
                                    placeholder="Type here" 
                                    placeholderTextColor={Colors.neutral80}
                                    onChangeText={text => setPassword(text)}
                                />
                                <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
                                    {
                                        !hidePass ?
                                            <Eye width={16} height={16} />
                                            :
                                            <EyeHidden width={16} height={16} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between', marginTop:12, marginBottom: 24}}>
                        <TouchableOpacity  onPress={()=> setRememberMe(!rememberMe)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    marginRight: 5
                            }}>
                                {
                                    rememberMe ?
                                        <CheckBoxFilled width={16} height={16} />
                                        :
                                        <CheckBox width={16} height={16} />
                            }
                            </View>
                            <Text style={Fonts.bodySmall}>Remember me</Text>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={()=> navigation.navigate('ResetPasswordScreen')}>
                            <Text style={[Fonts.button,{ color: Colors.orange }]}>Forgot password?</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    
                    <View style={{marginBottom:40}}>
                        <CustomButton1
                            title="Login"
                            onPress={() => handleSignIn(email,password)}
                            // onPress={() => login()}
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </View>
                </View>
            </ScrollView>
            {
                showLang &&
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingBottom: '10%',
                    }}>
                        <View style={{
                            height: '100%',
                            justifyContent:'center'
                        }}>
                            <TouchableOpacity onPress={() => setSelectLangModalShown(true)} activeOpacity={1} style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                                {whichLangFlag(selectedLang)}
                                <View style={{marginHorizontal:10}}>
                                    <Text style={Fonts.bodyLarge}>{whichLangName(selectedLang)}</Text>
                                </View>
                                <DropdownBlack width={13} height={13} />
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            {
                selectLangModalShown &&
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
                    isOpen={selectLangModalShown}
                    onClosed={() => setSelectLangModalShown(false)}
                >
                    {
                       <SelectLangModal
                            onPressClose={() => setSelectLangModalShown(false)}
                            onPressLang={(lang) => {setSelectedLang(lang), setSelectLangModalShown(false)}}
                        />
                    }
                </Modal>
            }
        </SafeAreaView>
    )
}


const whichLangName = (selectedLang) => {

    switch (selectedLang) {
        case 'english':
            return 'English (Default)'
        case 'swedish':
            return 'Swedish'
        case 'german':
            return 'German'
        // case 'switzerland':
        //     return 'Switzerland'
    }
}

const whichLangFlag = (selectedLang) => {

    switch (selectedLang) {
        case 'english':
            return <English width={25} height={25} />
        case 'swedish':
            return <Swedish width={25} height={25} />
        case 'german':
            return <German width={25} height={25} />
        // case 'switzerland':
        //     return <Switzerland width={25} height={25} />
        
    }
}

const SelectLangModal = (props) => { 
    const { onPressLang, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(35),
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
                <Text style={Fonts.h6}>Language</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                <TouchableOpacity onPress={() => onPressLang('english')}  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <English width={25} height={25} />
                    <View style={{marginHorizontal:10}}>
                        <Text style={Fonts.bodyLarge}>{"English (Default)"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressLang('swedish')}  style={{ flexDirection: 'row',  alignItems: 'center', marginBottom: 20 }}>
                    <Swedish width={25} height={25} />
                    <View style={{marginHorizontal:10}}>
                        <Text style={Fonts.bodyLarge}>{"Swedish"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressLang('german')}  style={{ flexDirection: 'row',  alignItems: 'center', marginBottom: 20 }}>
                    <German width={25} height={25} />
                    <View style={{marginHorizontal:10}}>
                        <Text style={Fonts.bodyLarge}>{"German"}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => onPressLang('switzerland')}  style={{ flexDirection: 'row',  alignItems: 'center'}}>
                    <Switzerland width={25} height={25} />
                    <View style={{marginHorizontal:10}}>
                        <Text style={Fonts.bodyLarge}>{"Switzerland"}</Text>
                    </View>
                </TouchableOpacity> */}
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
        justifyContent:'center',
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})