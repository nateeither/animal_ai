import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Statusbar, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar , Switch,ActivityIndicator} from 'react-native'
import { nf, wp, hp, sh, sw } from '../../../utils/utility'
import { Colors, Fonts, Icons } from '../../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from '../index'

import { CustomButton1 } from '../../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../../components/common/CustomButtonOutlined';

// import Auth, { AuthEventEmitter, AuthEvents } from 'react-native-firebaseui-auth';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';


import Modal from "react-native-modalbox"
import { useToast } from "react-native-toast-notifications";

// SVG
import ExclamationMark from '../../../assets/svg/exclamation-mark.svg'
import Eye from '../../../assets/svg/eye-default.svg'
import EyeHidden from '../../../assets/svg/eye-hidden.svg'
import Star from '../../../assets/svg/star-fill.svg'
import WarningOct from '../../../assets/svg/warning-octagon.svg'
import Back from '../../../assets/svg/arrow-left.svg'

import {
    changeProgressIndex,
  } from '../../../store/account_overview/actions';

import {
    requestUpdateUserData,
    requestUpdateFarmUserData,
    requestGetUsers,
    resetSuccessUpdateUserData,
    requestCreateNewUser,
    requestCreateNewFarmUser,
    resetSuccessCreateNewUser,
    setNoUsersCollection
} from '../../../store/user/actions';

import {
    requestSignUpEmailPassword,
    resetSignupId,
} from '../../../store/auth/actions';


export default function ManageAccess({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const [setUpRoles, setSetUpRoles] = useState(false)
    const [roleFilled, setRoleFilled] = useState(false)
    const [deleteRoleModalShown, setDeleteRoleModalShown] = useState(false)

    const [registUserLoading, setRegistUserLoading] = useState(false)

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

    const [selectedUser, setSelectedUser] = useState(undefined)
    const [addNewRole, setAddNewRole] = useState(false)

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { updateUserLoading } = useSelector(state => ({
        updateUserLoading: state.userReducer.updateUserLoading,
    }), shallowEqual);


    const { updateUserSuccess } = useSelector(state => ({
        updateUserSuccess: state.userReducer.updateUserSuccess,
    }), shallowEqual);

    const { users, getUsersLoading } = useSelector(state => ({
        users: state.userReducer.users,
        getUsersLoading: state.userReducer.getUsersLoading
    }), shallowEqual);

    const { signUpUid } = useSelector(state => ({
        signUpUid: state.authReducer.signUpUid,
    }), shallowEqual);

    const { createUserLoading } = useSelector(state => ({
        createUserLoading: state.userReducer.createUserLoading,
    }), shallowEqual);

    const { createNewUserSuccess } = useSelector(state => ({
        createNewUserSuccess: state.userReducer.createNewUserSuccess,
    }), shallowEqual);

    const { noUsersCollection } = useSelector(state => ({
        noUsersCollection: state.userReducer.noUsersCollection,
    }), shallowEqual);

    const { error } = useSelector(state => ({
        error: state.authReducer.error,
    }), shallowEqual);

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);


    function onPressNextStep() {
        dispatch(changeProgressIndex(2));
    }

    useEffect(() => {
        handleGetUsers(currUser ? currUser.farm : '')
    }, [])

    useEffect(() => {
        if (users.length > 1) {
            setRoleFilled(true),
            setSetUpRoles(false)
        }
    },[users])

    useEffect(() => {
        if (noUsersCollection && (currUser.uid == farmData.admin)) {
            let features = ['estrus_alert', 'bunkline_reading']
            let rights = ['manage_access','add_herd','assign_task','show_support']
    
            const admin = {
                bunklineReadingNotifications: ['email', 'sms', 'app'],
                email: currUser.email,
                estrusAlertNotifications: ['email', 'sms', 'app'],
                estrusAlertNotificationsFrequency: 'daily',
                bunklineReadingNotificationsFrequency: 'daily',
                farmUid: currUser.farm,
                features: features,
                rights: rights,
                title: 'administrator',
                uid: currUser.uid
            };

            dispatch(requestCreateNewFarmUser(currUser.uid,currUser.farm,admin));
        }
    },[noUsersCollection])

    useEffect(() => {
        // if ((!selectedUser && !addNewRole) && (currUser && !updateUserSuccess)) {
        //     if (currUser.features) {
        //         currUser.features.map(feature => {
        //             if (feature == 'estrus_alert') setEstrusAlertSwitch(true)
        //             if (feature == 'bunkline_reading') setBunklineReadingSwitch(true)
        //         })
        //     }
        //     if (currUser.rights) {
        //         currUser.rights.map(right => {
        //             if (right == 'manage_access') setManageAccessSwitch(true)
        //             if (right == 'show_support') setShowSupportSwitch(true)
        //             if (right == 'add_herd') setAddHerdSwitch(true)
        //             if (right == 'assign_task') setAssignTaskSwitch(true)
        //         })
        //     }

        //     setJobTitle(currUser.title)
        //     setName(currUser.name)
        //     setEmail(currUser.email)
        //     setPassword('qwerty123')
        // }

       

        if (updateUserSuccess) {
            toast.show("Data successfully updated!", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            setRoleFilled(true),
            setSetUpRoles(false)
            handleGetUsers(currUser.farm)
            dispatch(resetSuccessUpdateUserData())
        }

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
            dispatch(resetSignupId())
        }

        if (createNewUserSuccess) {
            toast.show("Success create new user", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetUsers(currUser.farm)
            dispatch(resetSignupId())
            dispatch(resetSuccessCreateNewUser())
            dispatch(setNoUsersCollection(false))
            setRegistUserLoading(createUserLoading)
            setRoleFilled(true),
            setSetUpRoles(false)
        }

    }, [updateUserSuccess, error, signUpUid, createNewUserSuccess]);

    const handleSelectedUser = (selectedUsr) => {
        if (selectedUsr.features) {
            selectedUsr.features.map(feature => {
                if (feature == 'estrus_alert') setEstrusAlertSwitch(true)
                if (feature == 'bunkline_reading') setBunklineReadingSwitch(true)
            })
        }
        if (selectedUsr.rights) {
            selectedUsr.rights.map(right => {
                if (right == 'manage_access') setManageAccessSwitch(true)
                if (right == 'show_support') setShowSupportSwitch(true)
                if (right == 'add_herd') setAddHerdSwitch(true)
                if (right == 'assign_task') setAssignTaskSwitch(true)
            })
        }

        setJobTitle(selectedUsr.title)
        setName(selectedUsr.name)
        setEmail(selectedUsr.email)
        setPassword('qwerty123')
    }

    const handleSetNewUser = () => {
        setAddNewRole(true)
        setSelectedUser(undefined)
        setEstrusAlertSwitch(false)
        setBunklineReadingSwitch(false)
        setManageAccessSwitch(false)
        setShowSupportSwitch(false)
        setAddHerdSwitch(false)
        setAssignTaskSwitch(false)
        setJobTitle('')
        setName('')
        setEmail('')
        setPassword('')
    }

    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };

    const handleUpdate = (uid) => {
        handleUpdateUserData(uid)
        handleUpdateFarmUserData(uid)
    }

    const handleUpdateUserData = (uid) => {
        let features = [estrusAlertSwitch ? 'estrus_alert' : '', bunklineReadingSwitch ? 'bunkline_reading' : '']
        let rights = [
            manageAccessSwitch ? 'manage_access' : '',
            showSupportSwitch ? 'show_support' : '',
            addHerdSwitch ? 'add_herd' : '',
            assignTaskSwitch ? 'assign_task' : ''
        ]

        features = features.filter(feature => feature)
        rights = rights.filter(right => right)

        if (email != '' && jobTitle != '' && name != '') {
            const user = {
                bunklineReadingNotifications: ['email', 'sms', 'app'],
                email: email,
                estrusAlertNotifications: ['email', 'sms', 'app'],
                estrusAlertNotificationsFrequency: 'daily',
                bunklineReadingNotificationsFrequency: 'daily',
                farmUid: currUser.farm,
                features: features,
                rights: rights,
                title: jobTitle,
                name: name,
                uid: uid
            };


            dispatch(requestUpdateUserData(uid,user));
        }
    };

    const handleUpdateFarmUserData = (uid) => {
        let features = [estrusAlertSwitch ? 'estrus_alert' : '', bunklineReadingSwitch ? 'bunkline_reading' : '']
        let rights = [
            manageAccessSwitch ? 'manage_access' : '',
            showSupportSwitch ? 'show_support' : '',
            addHerdSwitch ? 'add_herd' : '',
            assignTaskSwitch ? 'assign_task' : ''
        ]

        features = features.filter(feature => feature)
        rights = rights.filter(right => right)

        if (email != '' && jobTitle != '' && name != '' ) {
            const user = {
                bunklineReadingNotifications: ['email', 'sms', 'app'],
                email: email,
                estrusAlertNotifications: ['email', 'sms', 'app'],
                estrusAlertNotificationsFrequency: 'daily',
                bunklineReadingNotificationsFrequency: 'daily',
                farmUid: currUser.farm,
                features: features,
                rights: rights,
                title: jobTitle,
                name: name,
                uid: uid
            };

            dispatch(requestUpdateFarmUserData(uid,currUser.farm,user));
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
    
    const handleBackButton = () => {
        if (users.length > 1) {
            setRoleFilled(true), setSetUpRoles(false), setSelectedUser(undefined)
        }
        else {
            setSelectedUser(undefined), setSetUpRoles(false), setRoleFilled(false)
        }
    }

    return (
        <>
            {
                setUpRoles && 
                <TouchableOpacity
                    onPress={handleBackButton}
                    style={{ width: '90%', height: 48, backgroundColor: Colors.white, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{alignSelf:'center',marginRight:14}}>
                        <Back width={16} height={16} />
                    </View>
                    <Text style={[Fonts.bodyLarge, {color: Colors.orange, textAlign:'center'}]}>Set-up roles</Text>
                </TouchableOpacity>
            }
           
            {
                getUsersLoading ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator
                            style={{ alignSelf: 'center' }}
                            size='large'
                            color={Colors.orange80} />
                    </View>
                    :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.container}>
                            {
                                roleFilled ? 
                                    
                                <RoleListContent users={users} onPressDeleteRole={() => setDeleteRoleModalShown(true)} onPressEditRole={(selectedUsr) => { handleSelectedUser(selectedUsr), setSelectedUser(selectedUsr), setRoleFilled(false), setSetUpRoles(true)}} />
                                    :
                                <>
                                    {
                                        setUpRoles ?
                                            <SetUpRolesContent
                                                // onPressSave={() => {
                                                //     setRoleFilled(true),
                                                //     setSetUpRoles(false)
                                                // }}
                                                onPressSave={() => addNewRole ? handleSignUp(email, password) : handleUpdate(currUser.uid)}
                                                
                                                loading={addNewRole ? registUserLoading : updateUserLoading }

                                                onChangeJobTitleText={(jobTitle) => setJobTitle(jobTitle)}
                                                onChangeNameText={(name) => setName(name)}
                                                onChangeEmailText={(email) => setEmail(email)}
                                                onChangePasswordText={(password) => setPassword(password)}
                    
                                                jobTitle={jobTitle}
                                                name={name}
                                                email={email}
                                                password={password}
                                                
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
                                                :
                                            <NoRolesContent
                                                onPressSetUp={() => {setSetUpRoles(true),handleSetNewUser()}}
                                                onPressSetUpLater={() => onPressNextStep()}
                                            /> 
                                    }
                                </>
                            }
                        </View>
                    </ScrollView>
            }
            {roleFilled && <RoleBottomNav onPressNext={() => onPressNextStep()} onPressAddNew={() => {handleSetNewUser(),setRoleFilled(false), setSetUpRoles(true)}} />}
            {
                deleteRoleModalShown &&
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
                    isOpen={deleteRoleModalShown}
                    onClosed={() => setDeleteRoleModalShown(false)}
                >
                    {
                        <DeleteRoleModal 
                           onPressCancel={()=> setDeleteRoleModalShown(false)}
                           onPressDelete={()=> setDeleteRoleModalShown(false)}
                        />
                    }
                </Modal>
            }
        </>
    )
}

const NoRolesContent = (props) => {
    const { onPressSetUp, onPressSetUpLater } = props;

    return (
        <>
            <View style={{ width: '50%', alignSelf:'center', alignItems:'center', marginTop: 56, marginBottom: 40  }}>
                <View style={{width:80, height: 80, borderRadius: 40, marginBottom: 20, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                    <ExclamationMark width={38} height={38}/>
                </View>
                <Text style={[Fonts.h2, {textAlign:'center'}]}>You don't have any roles yet</Text>
            </View>

            <CustomButton1
                title="Set-up roles now"
                onPress={onPressSetUp}
            />
            <View style={{ marginTop: 10 }} />
            <CustomButtonOutlined1
                title="I will set it up later"
                onPress={onPressSetUpLater}
            />
        </>
    );
};


const SetUpRolesContent = (props) => {
    const {
        onPressSave,
        loading,
        onChangeJobTitleText, onChangeNameText,
        onChangeEmailText, onChangePasswordText,
        jobTitle, name, email, password,
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
                jobTitle={jobTitle}
                name={name}
                email={email}
                password={password}
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

const RoleListContent = (props) => {
    const { users, onPressDeleteRole, onPressEditRole } = props;
    
    return (
        <View>
            {
                users.map((item,index) => {
                    return <RoleCard data={item} index={index} onPressDeleteRole={onPressDeleteRole} onPressEditRole={(usr) => onPressEditRole(usr)} />
                })
            }
            <View style={{height: hp(20),marginBottom: 'auto'}} />
        </View>
    )
}

const RoleCard = (props) => {
    const { index, data, onPressDeleteRole, onPressEditRole } = props;

    return (
        <View style={{
            width:'100%', marginTop: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.orange, marginRight:8}}>
                        <Text style={[Fonts.captionRegular, { color: Colors.white }]}>{index + 1}</Text>
                    </View>
                    <Text style={[Fonts.bodyLarge]}>{data.name} • {data.title}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center', marginVertical:12}}>
                    {
                        data.features.map(item => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 13 }}>
                                <View style={{marginRight:5, marginBottom:3}}>
                                    <Star width={10} height={10} />
                                </View>
                                <Text style={[Fonts.captionRegular]}>{item == 'estrus_alert' ? 'Estrus alert' : 'Bunkline reading'}</Text>
                            </View>
                        ))
                    }
                </View>
                <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                    <CustomButton1
                        title="Edit"
                        onPress={() => onPressEditRole(data)}
                        style={{width: '48.5%'}}
                    />
                    <CustomButtonOutlined1
                        title="Delete"
                        onPress={onPressDeleteRole}
                        style={{width: '48.5%', backgroundColor: Colors.orange40}}  
                    />
                </View>
            </View>
        </View>
    );
};


const RoleFormCard = (props) => {
    const {
        jobTitle,
        name, email, password,
        onChangeJobTitleText, onChangeNameText,
        onChangeEmailText, onChangePasswordText
    } = props;

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
                        value={jobTitle}
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
                        value={name}
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
                        value={email}
                    />
                </View>

                <View style={{marginTop:12}}>
                    <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Password</Text>
                    <View style={[styles.textInputStyleClass, {flexDirection:'row', alignItems:'center'}]}>
                        <TextInput
                            autoCapitalize="none"    
                            autoCorrect={false}
                            secureTextEntry={true}
                            textContentType='password'  
                            style={[Fonts.bodySmall,{ flex: 1 }]}
                            placeholder="Type here" 
                            placeholderTextColor={Colors.neutral80}
                            onChangeText={text => onChangePasswordText(text)}
                            value={password}
                        />
                        <TouchableOpacity>
                            <EyeHidden width={16} height={16} />
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

const RoleBottomNav = (props) => {
    const { onPressNext, onPressAddNew } = props;
    
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
                    justifyContent: 'center',
                }}>
                   <CustomButton1 title="Add new role" onPress={onPressAddNew} />
                   <View style={{marginBottom:10}} />
                   <CustomButtonOutlined1 title="Next" onPress={onPressNext} />
                </View >
            </View>
        </View>
    )
}


const DeleteRoleModal = (props) => { 
    const { onPressCancel, onPressDelete } = props

    return (
        <View style={{
            width: '100%',
            height: '40%',
            backgroundColor: Colors.white,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        }}>

            <View style={{ width: '60%', alignSelf: 'center', marginTop: '8%' }}>
                <View style={{alignSelf:'center',marginBottom:12}}>
                    <WarningOct width={48} height={48} />
                </View>
                <Text style={[Fonts.h4, { textAlign: 'center', marginBottom: 6 }]}>Would you like to delete this role?</Text>
                <Text style={[Fonts.bodySmall, { textAlign: 'center', marginBottom: 20 }]}>Deleted role can no longer appear in your app</Text>
            </View>
            <View style={{ marginBottom:'auto', flexDirection:'row', alignItems:'center'}}>
                <CustomButtonOutlined1
                    title="Cancel"
                    onPress={onPressCancel}
                    style={{ width: '28.5%' }}
                />
                <View style={{marginHorizontal:4}} />
                <CustomButton1
                    title="Delete Now"
                    onPress={onPressDelete}
                    style={{ width: '38.5%'}}
                />
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