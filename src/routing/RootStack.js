import React, { useEffect, useState } from 'react'
import { View, Platform, Dimensions, ActivityIndicator, TouchableOpacity, Image, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './NavigationService'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Colors, Fonts } from '../constants' 

// Auth
import {
    LoginScreen,
    ResetPasswordScreen,
    ResetPasswordOTPScreen,
    ResetPasswordNotifScreen,
    CreateNewPasswordScreen,
    SuccessResetPasswordScreen,
} from '../screens/Auth'

import { AccountOverviewScreen } from '../screens/AccountOverView'
import { DashboardScreen, EstrusOverviewScreen } from '../screens/Overview'
import {
    HerdOverviewScreen,
    HerdProfileScreen,
    EditHerdScreen,
    CreateHerdTaskScreen,
    UploadHerdScreen,
    AddHerdScreen,
    UploadHerdVideoScreen,
    FilteredHerdScreen
} from '../screens/Herd'

import {
    TaskScreen,
    TaskDetailScreen,
    EditTaskScreen,
    StaffTaskListScreen
} from '../screens/Tasks'
import {
    MyAccountOverviewScreen,
    GeneralInformationScreen,
    ManageAccessScreen,
    AddNewRoleScreen,
    EditRoleScreen,
    NotificationScreen,
    NotificationDetailScreen,
    LanguageSettingScreen,
    ManageFeatureScreen,
    MyFeatureDetailScreen,
    NotifConfigScreen,
    MyBarnNCameraScreen

} from '../screens/MyAccount'
import { StartScreen } from '../screens/Welcome'
import { CustomerSupportScreen } from '../screens/Support'

import {
    requestGetHerds,
    pushHerdsData
} from '../store/herd/actions';
import {
    requestGetUsers,
} from '../store/user/actions';
import {
    setupProgressDone,
    changeProgressIndex
} from '../store/account_overview/actions';

//SVG
import Dashboard from '../assets/svg/navbar/dashboard.svg'
import DashboardFilled from '../assets/svg/navbar/dashboard-filled.svg'
import Cow from '../assets/svg/navbar/cow.svg'
import CowFilled from '../assets/svg/navbar/cow-fill.svg'
import StackSimple from '../assets/svg/navbar/stack-simple.svg'
import StackSimpleFilled from '../assets/svg/navbar/stack-simple-fill.svg'
import User from '../assets/svg/navbar/user-light.svg'
import UserFilled from '../assets/svg/navbar/user-fill.svg'

import { farms_ref } from '../constants/Api'

import firestore from '@react-native-firebase/firestore';

const Tab = createBottomTabNavigator();


function OverviewStackScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                
                switch(route.name){
                    case 'Overview':
                        return focused ? <DashboardFilled width={24} height={24} /> : <Dashboard width={24} height={24} />;
                    case 'Herd':
                        return focused ? <CowFilled width={24} height={24} /> : <Cow width={24} height={24} />;
                    case 'Tasks':
                        return focused ? <StackSimpleFilled width={24} height={24} /> : <StackSimple width={24} height={24} />;
                    case 'My account':
                        return focused ? <UserFilled width={24} height={24} /> : <User width={24} height={24} />;
                }
    
                },
                tabBarActiveTintColor: Colors.orange,
                tabBarInactiveTintColor: Colors.orange80,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarLabelStyle: { fontFamily: 'Poppins-Regular', fontSize: 12, lineHeight: 18 },
                tabBarStyle:  { height: 60, paddingBottom: 10 }
            })}
        >
            <Tab.Screen name="Overview" component={EstrusOverviewScreen} />
            <Tab.Screen name="Herd" component={HerdOverviewScreen} />
            <Tab.Screen name="Tasks" component={TaskScreen} />
            <Tab.Screen name="My account" component={AccountStackScreen} />
       </Tab.Navigator>
     );
}

const AccountStack = createStackNavigator();

function AccountStackScreen() {
    return (
        <AccountStack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false,
                headerStyle: {
                    backgroundColor: Colors.orange40,
                },
                headerTintColor: Colors.orange,
                headerTitleStyle: [Fonts.bodyLarge, { color : Colors.orange }],
            }}
            initialRouteName={MyAccountOverviewScreen}
        >
            <AccountStack.Screen name="MyAccountScreen" component={MyAccountOverviewScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "General information" }} name="GeneralInformationScreen" component={GeneralInformationScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "Manage roles" }} name="ManageAccessScreen" component={ManageAccessScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "Add new role" }} name="AddNewRoleScreen" component={AddNewRoleScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "Edit role" }} name="EditRoleScreen" component={EditRoleScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "Notifications" }} name="NotificationScreen" component={NotificationScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "Notifications" }} name="NotificationDetailScreen" component={NotificationDetailScreen} />
            <AccountStack.Screen options={{ headerShown: true, title: "Language settings" }} name="LanguageSettingScreen" component={LanguageSettingScreen} />
        </AccountStack.Navigator>
     );
}


const Stack = createStackNavigator();


export default RootStack = () => {
    const dispatch = useDispatch();

    const { isLogged } = useSelector(state => ({
        isLogged: state.authReducer.isLogged,
    }), shallowEqual)

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);
    
    // const dispatch = useDispatch()

    const [startScreen, setStartScreen] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    const handleGetHerds = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetHerds(farmUid));
        }
    };

    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };

    const getData = async () => {
        if (currUser) {
            handleGetHerds(currUser.farm)
            handleGetUsers(currUser.farm)
            fetchRealtimeHerdData(currUser.farm ? currUser.farm : '')
        }
        setStartScreen(false)
    }

    function setProgressDone(status) {
        dispatch(setupProgressDone(status));
    }

    function onChangeProgressIdx(idx) {
        dispatch(changeProgressIndex(idx));
    }

    const fetchRealtimeHerdData = (farmUid) => {
        return new Promise((resolve, reject) => {

        const unsubscribe = firestore()
          .collection(`${farms_ref}/${farmUid}/cows`)
          .onSnapshot(snapshot => {
            let herds = []
            
            snapshot.docs.map(item => {
                let herd = item.data()
                herds.push(herd)
            })
            dispatch(pushHerdsData(herds));
            console.log('real timed herds: ', herds)
          })
            
        
          .catch((error) => {
            console.log('Error fetching data:', error);
            reject([]);
          });
        
        
        // Return the unsubscribe function to clean up the subscription if needed
        return unsubscribe;
    })};

    useEffect(() => {
        setStartScreen(true)
        onChangeProgressIdx(1)
        setTimeout(() => {
            getData();
        }, 2000);
    }, []);

    useEffect(() => {
        if (herds.length != 0 || users.length > 1) {
            setProgressDone(true)
        }
        else {
            setProgressDone(false)
        }
    }, [herds, users]);
    

    if (startScreen) {
        return (
            <StartScreen />
        );
    }
    
    return (
        <NavigationContainer ref={navigationRef}>

                <Stack.Navigator
                    screenOptions={{
                        gestureEnabled: false,
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: Colors.orange40,
                        },
                        headerTintColor: Colors.orange,
                        headerTitleStyle: [Fonts.bodyLarge, { color : Colors.orange }],
                    }}
                    initialRouteName={isLogged ? OverviewStackScreen : LoginScreen}
                >
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen options={{
                        headerShown: true,
                        title: "Reset Password",
                        headerStyle: {
                            backgroundColor: Colors.white,
                        },
                    }} name="ResetPasswordScreen" component={ResetPasswordScreen} />
                    <Stack.Screen name="ResetPasswordOTPScreen" component={ResetPasswordOTPScreen} />
                    <Stack.Screen name="ResetPasswordNotifScreen" component={ResetPasswordNotifScreen} />
                    <Stack.Screen
                        options={{
                            headerShown: true,
                            title: "Create a new password",
                            headerStyle: {
                                backgroundColor: Colors.white,
                            },
                        }} name="CreateNewPasswordScreen" component={CreateNewPasswordScreen} />
                    <Stack.Screen name="SuccessResetPasswordScreen" component={SuccessResetPasswordScreen} />
                    <Stack.Screen name="AccountOverviewScreen" component={AccountOverviewScreen} />
                    <Stack.Screen name="Overview" component={OverviewStackScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Profile" }} name="HerdProfileScreen" component={HerdProfileScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Edit cow information" }} name="EditHerdScreen" component={EditHerdScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Create task" }} name="CreateHerdTaskScreen" component={CreateHerdTaskScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Upload herd information" }} name="UploadHerdScreen" component={UploadHerdScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Add herd" }}  name="AddHerdScreen" component={AddHerdScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Upload video" }} name="UploadHerdVideoScreen" component={UploadHerdVideoScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Task" }} name="TaskDetailScreen" component={TaskDetailScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Edit task" }} name="EditTaskScreen" component={EditTaskScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "General information" }} name="GeneralInformationScreen" component={GeneralInformationScreen} />
                    <Stack.Screen options={({ route }) => ({ headerShown: true, title: `${route.params.staffName}'s tasks` })} name="StaffTaskListScreen" component={StaffTaskListScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Manage roles" }} name="ManageAccessScreen" component={ManageAccessScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "My features" }} name="ManageFeatureScreen" component={ManageFeatureScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "My features" }} name="MyFeatureDetailScreen" component={MyFeatureDetailScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Notification configurations" }} name="NotifConfigScreen" component={NotifConfigScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "My barn and cameras" }}  name="MyBarnNCameraScreen" component={MyBarnNCameraScreen} />
                    <Stack.Screen options={{ headerShown: true, title: "Support" }}  name="CustomerSupportScreen" component={CustomerSupportScreen} />
                    <Stack.Screen options={({ route }) => ({ headerShown: true, title: `${route.params.taskStatus} tasks` })} name="FilteredHerdScreen" component={FilteredHerdScreen} />
                </Stack.Navigator>

        </NavigationContainer>
    )
}