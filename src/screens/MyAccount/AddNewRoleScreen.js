import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, Switch } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { nanoId } from '../../utils/reusableFunctions'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import EyeHidden from '../../assets/svg/eye-hidden.svg'
import Eye from '../../assets/svg/eye-default.svg'

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import {
    requestSignUpEmailPassword,
    resetSignupId
} from '../../store/auth/actions';

import {
    requestCreateNewUser,
    requestCreateNewFarmUser,
    resetSuccessCreateNewUser,
    requestGetUsers
} from '../../store/user/actions';

export default function AddNewRoleScreen({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()
    
    const [jobTitle, setJobTitle] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [estrusAlertSwitch, setEstrusAlertSwitch] = useState(false)
    const [bunklineReadingSwitch, setBunklineReadingSwitch] = useState(false)
    const [manageAccessSwitch, setManageAccessSwitch] = useState(false)
    const [showSupportSwitch, setShowSupportSwitch] = useState(false)
    const [addHerdSwitch, setAddHerdSwitch] = useState(false)
    const [assignTaskSwitch, setAssignTaskSwitch] = useState(false)

    const [registUserLoading, setRegistUserLoading] = useState(false)

    const { signUpUid } = useSelector(state => ({
        signUpUid: state.authReducer.signUpUid,
    }), shallowEqual);

    const { error } = useSelector(state => ({
        error: state.authReducer.error,
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { createUserLoading } = useSelector(state => ({
        createUserLoading: state.userReducer.createUserLoading,
    }), shallowEqual);

    const { createNewUserSuccess } = useSelector(state => ({
        createNewUserSuccess: state.userReducer.createNewUserSuccess,
    }), shallowEqual);


    useEffect(() => {
        if (error) {
            if (error === 'auth/email-already-in-use') {
                toast.show("That email address is already in use!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in',});
                console.log('That email address is already in use!');
            }

            if (error === 'auth/invalid-email') {
                toast.show("That email address is invalid!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in',});
                console.log('That email address is invalid!');
            }

            if (error === 'auth/network-request-failed') {
                toast.show("Network error", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                animationType: 'slide-in',});
                console.log('Network error');
            }
        }

        if (signUpUid) {
            const uid = signUpUid
            handleCreateNewUser(uid)
            handleCreateNewFarmUser(uid)
            setRegistUserLoading(createUserLoading)
        }

        if (createNewUserSuccess) {
            toast.show("Success create new user", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetUsers(currUser.farm)
            dispatch(resetSignupId())
            dispatch(resetSuccessCreateNewUser())
            navigation.navigate('ManageAccessScreen')
        }

    }, [error, signUpUid, createNewUserSuccess]);


    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };
    
    const handleCreateNewUser = (uid) => {
        // let features = [estrusAlertSwitch ? 'estrus_alert' : '', bunklineReadingSwitch ? 'bunkline_reading' : '']
        // let rights = [
        //     manageAccessSwitch ? 'manage_access' : '',
        //     showSupportSwitch ? 'show_support' : '',
        //     addHerdSwitch ? 'add_herd' : '',
        //     assignTaskSwitch ? 'assign_task' : ''
        // ]

        // features = features.filter(feature => feature)
        // rights = rights.filter(right => right)

        // if (email != '' && password != '' && jobTitle != '' && name != '' ) {
            const user = {
                // bunklineReadingNotifications: ['email', 'sms', 'app'],
                // email: email,
                // estrusAlertNotifications: ['email', 'sms', 'app'],
                // estrusAlertNotificationsFrequency: 'daily',
                farm: currUser.farm,
                // features: features,
                // rights: rights,
                // title: jobTitle,
                // name: name,
                // uid: uid
            };


            dispatch(requestCreateNewUser(uid,user));
        // }

        // if (email == '') {
        //     toast.show("Email cannot be empty!", {type: 'danger',placement:'top'});
        // }

        // if (password == '') {
        //     toast.show("Password cannot be empty!", {type: 'danger',placement:'top'});
        // }

        // if (jobTitle == '') {
        //     toast.show("Job title cannot be empty!", {type: 'danger',placement:'top'});
        // }

        // if (name == '') {
        //     toast.show("Name title cannot be empty!", {type: 'danger',placement:'top'});
        // }
    };

    const handleCreateNewFarmUser = (uid) => {
        let features = [estrusAlertSwitch ? 'estrus_alert' : '', bunklineReadingSwitch ? 'bunkline_reading' : '']
        let rights = [
            manageAccessSwitch ? 'manage_access' : '',
            showSupportSwitch ? 'show_support' : '',
            addHerdSwitch ? 'add_herd' : '',
            assignTaskSwitch ? 'assign_task' : ''
        ]

        features = features.filter(feature => feature)
        rights = rights.filter(right => right)

        if (email != '' && password != '' && jobTitle != '' && name != '' ) {
            const user = {
                bunklineReadingNotifications: ['email', 'sms', 'app'],
                email: email,
                estrusAlertNotifications: ['email', 'sms', 'app'],
                estrusAlertNotificationsFrequency: 'daily',
                farm: currUser.farm,
                features: features,
                rights: rights,
                title: jobTitle,
                name: name,
                uid: uid
            };

            dispatch(requestCreateNewFarmUser(uid,currUser.farm,user));
        }

    };

    const handleSignUp = (email, password) => {

        if (email != '' && password != '') {
            const user = { email, password };
            setRegistUserLoading(true)
            dispatch(requestSignUpEmailPassword(user));
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
    

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <SetUpRolesContent
                            loading={registUserLoading}
                            onPressSave={() => handleSignUp(email,password)}

                            onChangeJobTitleText={(jobTitle) => setJobTitle(jobTitle)}
                            onChangeNameText={(name) => setName(name)}
                            onChangeEmailText={(email) => setEmail(email)}
                            onChangePasswordText={(password) => setPassword(password)}

                            estrusAlertSwitch={estrusAlertSwitch}
                            toggleEstrusAlertSwitch={()=> setEstrusAlertSwitch(!estrusAlertSwitch)}
                            bunklineReadingSwitch={bunklineReadingSwitch}
                            toggleBunklineReadingSwitch={()=> setBunklineReadingSwitch(!bunklineReadingSwitch)}
                            
                            manageAccessSwitch={manageAccessSwitch}
                            toggleManageAccessSwitch={()=> setManageAccessSwitch(!manageAccessSwitch)}
                            showSupportSwitch={showSupportSwitch}
                            toggleShowSupportSwitch={()=> setShowSupportSwitch(!showSupportSwitch)}
                            addHerdSwitch={addHerdSwitch}
                            toggleAddHerdSwitch={()=> setAddHerdSwitch(!addHerdSwitch)}
                            assignTaskSwitch={assignTaskSwitch}
                            toggleAssignTaskSwitch={()=> setAssignTaskSwitch(!assignTaskSwitch)}
                        />
                    </View>
                    <View style={{height: hp(5), marginBottom:'auto'}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}


const SetUpRolesContent = (props) => {
    const {
        loading,
        onPressSave,
        onChangeJobTitleText, onChangeNameText,
        onChangeEmailText, onChangePasswordText,
        estrusAlertSwitch, toggleEstrusAlertSwitch,
        bunklineReadingSwitch, toggleBunklineReadingSwitch,
        manageAccessSwitch, toggleManageAccessSwitch,
        showSupportSwitch, toggleShowSupportSwitch,
        addHerdSwitch, toggleAddHerdSwitch,
        assignTaskSwitch, toggleAssignTaskSwitch

    } = props;

    return (
        <View>
            <RoleFormCard
                onChangeJobTitleText={(jobTitle) => onChangeJobTitleText(jobTitle)}
                onChangeNameText={(name) => onChangeNameText(name)}
                onChangeEmailText={(email) => onChangeEmailText(email)}
                onChangePasswordText={(password) => onChangePasswordText(password)}
            />
            <AccessFeatureCard
                estrusAlertSwitch={estrusAlertSwitch}
                toggleEstrusAlertSwitch={toggleEstrusAlertSwitch}
                bunklineReadingSwitch={bunklineReadingSwitch}
                toggleBunklineReadingSwitch={toggleBunklineReadingSwitch}
            />
            <RightsCard
                manageAccessSwitch={manageAccessSwitch}
                toggleManageAccessSwitch={toggleManageAccessSwitch}
                showSupportSwitch={showSupportSwitch}
                toggleShowSupportSwitch={toggleShowSupportSwitch}
                addHerdSwitch={addHerdSwitch}
                toggleAddHerdSwitch={toggleAddHerdSwitch}
                assignTaskSwitch={assignTaskSwitch}
                toggleAssignTaskSwitch={toggleAssignTaskSwitch}
            />
            <View style={{marginTop:20, marginBottom: 31}}>
                <CustomButton1
                    disabled={loading}
                    loading={loading}
                    title="Save"
                    onPress={onPressSave}
                />
            </View>
        </View>
    );
}


const RoleFormCard = (props) => {
    const { 
        onChangeJobTitleText, onChangeNameText,
        onChangeEmailText, onChangePasswordText
    } = props;

    const [hidePass, setHidePass] = useState(true)

    return (
        <View style={{
            width:'100%', marginTop: 8, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.orange, marginRight:8}}>
                        <Text style={[Fonts.captionRegular, { color: Colors.white }]}>1</Text>
                    </View>
                    <Text style={[Fonts.h4, {lineHeight: 26}]}>Role</Text>
                </View>
                <View style={{marginTop:12}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Job title</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        onChangeText={text => onChangeJobTitleText(text)}
                    />
                </View>

                <View style={{marginTop:12}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Name</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        onChangeText={text => onChangeNameText(text)}
                    />
                </View>

                <View style={{marginTop:12}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Email</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        onChangeText={text => onChangeEmailText(text)}
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
                            style={[Fonts.bodySmall,{ flex: 1 }]}
                            placeholder="Type here" 
                            placeholderTextColor={Colors.neutral80}
                            onChangeText={text => onChangePasswordText(text)}
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
        </View>
    );
}


const AccessFeatureCard = (props) => {
    const { 
        estrusAlertSwitch, toggleEstrusAlertSwitch,
        bunklineReadingSwitch, toggleBunklineReadingSwitch,
    } = props;

    return (
        <View style={{
            width:'100%', marginTop: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.orange, marginRight:8}}>
                        <Text style={[Fonts.captionRegular, { color: Colors.white }]}>2</Text>
                    </View>
                    <Text style={[Fonts.h4, {lineHeight: 26}]}>Access Features</Text>
                </View>
                <View style={{marginTop:12, flexDirection:'row', alignItems:'center'}}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toggleEstrusAlertSwitch}
                        value={estrusAlertSwitch}
                    />
                    <Text style={[Fonts.bodySmall]}>Estrus alert</Text>
                </View>
                <View style={{marginTop:12, flexDirection:'row', alignItems:'center'}}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toggleBunklineReadingSwitch}
                        value={bunklineReadingSwitch}
                    />
                    <Text style={[Fonts.bodySmall]}>Bunkline reading</Text>
                </View>
            </View>
        </View>
    );
}


const RightsCard = (props) => {
    const { 
        manageAccessSwitch, toggleManageAccessSwitch,
        showSupportSwitch, toggleShowSupportSwitch,
        addHerdSwitch, toggleAddHerdSwitch,
        assignTaskSwitch, toggleAssignTaskSwitch
    } = props;

    return (
        <View style={{
            width:'100%', marginTop: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.orange, marginRight:8}}>
                        <Text style={[Fonts.captionRegular, { color: Colors.white }]}>3</Text>
                    </View>
                    <Text style={[Fonts.h4, {lineHeight: 26}]}>Rights</Text>
                </View>
                <View style={{marginTop:12, flexDirection:'row', alignItems:'center'}}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toggleManageAccessSwitch}
                        value={manageAccessSwitch}
                    />
                    <Text style={[Fonts.bodySmall]}>Manage Access</Text>
                </View>
                <View style={{marginTop:12, flexDirection:'row', alignItems:'center'}}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toggleShowSupportSwitch}
                        value={showSupportSwitch}
                    />
                    <Text style={[Fonts.bodySmall]}>Show support</Text>
                </View>
                <View style={{marginTop:12, flexDirection:'row', alignItems:'center'}}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toggleAddHerdSwitch}
                        value={addHerdSwitch}
                    />
                    <Text style={[Fonts.bodySmall]}>Add herd</Text>
                </View>
                <View style={{marginTop:12, flexDirection:'row', alignItems:'center'}}>
                    <Switch
                        trackColor={{false: Colors.orange60, true: Colors.orange}}
                        thumbColor={Colors.white}
                        onValueChange={toggleAssignTaskSwitch}
                        value={assignTaskSwitch}
                    />
                    <Text style={[Fonts.bodySmall]}>Assign task</Text>
                </View>
            </View>
        </View>
    );
}

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