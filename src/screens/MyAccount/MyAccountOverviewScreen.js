import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { nf, wp, hp } from '../../utils/utility'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'

import { ScrollView } from 'react-native-gesture-handler';

import UserFill from '../../assets/svg/navbar/user-fill.svg'
import BellFill from '../../assets/svg/bell-fill.svg'
import GitBranch from '../../assets/svg/git-branch.svg'
import Setting from '../../assets/svg/setting-alt-fill.svg'
import ClockFill from '../../assets/svg/clock-fill.svg'
import Translate from '../../assets/svg/translate.svg'
import CowFill from '../../assets/svg/navbar/cow-fill.svg'
import Out from '../../assets/svg/out.svg'
import SupportIcon from '../../assets/svg/support-icon.svg'


import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    signOut,
} from '../../store/auth/actions';

import { configureStore } from '../../store'
const {resetPersistStore} = configureStore();


export default function MyAccountOverviewScreen({ navigation }) {
    const dispatch = useDispatch();

    const [currUserRights, setCurrUserRights] = useState([])

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);

    useEffect(() => {
        let filteredUserData = users.filter(user => user.uid == currUser.uid)
        setCurrUserRights(filteredUserData[0].rights)
    },[])

    const handleSignOut = () => {
        dispatch(signOut());
        resetPersistStore()
        navigation.replace('LoginScreen')
    };

    return (
        <SafeAreaView style={{flex:1, backgroundColor: Colors.orange40}}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.orange40}
            />
            <View style={{ marginTop: 36 }} />
            <View style={{
                width: wp(100),
                height: hp(10),
                backgroundColor: Colors.orange40,
                paddingBottom: 20,
                // paddingTop:16
            }}>
                <View style={{ width: wp(90), alignSelf: 'center', marginTop: 'auto',}}>
                    <Text style={Fonts.h5}>My Account</Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        {
                            farmData.admin == currUser.uid &&
                            <MenuBar
                                onPressMenu={() => navigation.navigate('GeneralInformationScreen')}
                                title="General information"
                                icon={<UserFill width={16} height={16} />}
                            />
                        }
                        <MenuBar
                            onPressMenu={() => navigation.navigate('NotificationScreen')}
                            title="Notifications"
                            icon={<BellFill width={16} height={16} />}
                        />
                        {
                            currUserRights.includes('manage_access') &&
                            <MenuBar
                                onPressMenu={() => navigation.navigate('ManageAccessScreen')}
                                title="Manage roles"
                                icon={<GitBranch width={16} height={16} />}
                            />
                        }
                        <MenuBar
                            onPressMenu={() => navigation.navigate('ManageFeatureScreen')}
                            title="My features"
                            icon={<Setting width={16} height={16} />}
                        />
                        <MenuBar
                            onPressMenu={() => navigation.navigate('NotifConfigScreen')}
                            title="Notification configurations"
                            icon={<ClockFill width={16} height={16} />}
                        />
                        <MenuBar
                            onPressMenu={() => navigation.navigate('LanguageSettingScreen')}
                            title="Language settings"
                            icon={<Translate width={16} height={16} />}
                        />
                        <MenuBar
                            onPressMenu={() => navigation.navigate('MyBarnNCameraScreen')}
                            title="My barn and cameras"
                            icon={<CowFill width={16} height={16} />}
                        />
                        <LogoutBar onPressLogout={() => handleSignOut()} />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {currUserRights.includes('show_support') && <ProfileBottomNav onPressSupport={() => navigation.navigate('CustomerSupportScreen')} />}
        </SafeAreaView>
    )
}

const LogoutBar = (props) => {
    const { onPressLogout } = props
    
    return (
        <TouchableOpacity
            onPress={onPressLogout}
            style={{width: '100%', height: 53, backgroundColor: Colors.white, justifyContent:'center', marginBottom:12, paddingHorizontal:12}}
        >
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Out width={16} height={16} />
                <Text style={[Fonts.button,{marginLeft:8}]}>Log out</Text>
            </View>
        </TouchableOpacity>
    )
}


const MenuBar = (props) => {
    const { icon, title, onPressMenu } = props
    
    return (
        <TouchableOpacity
            onPress={onPressMenu}
            style={{width: '100%', height: 53, backgroundColor: Colors.orange40, borderRadius: 8, justifyContent:'center', marginBottom:12, paddingHorizontal:12}}
        >
            <View style={{flexDirection:'row',alignItems:'center'}}>
                {icon}
                <Text style={[Fonts.button,{marginLeft:8}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}



const ProfileBottomNav = (props) => {
    const { onPressSupport } = props;
    
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
                    paddingVertical:16,
                    // paddingHorizontal: 20,
                    // backgroundColor: Colors.white,
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <View style={{ width: '75%' }} />
                    <TouchableOpacity onPress={onPressSupport}>
                        <SupportIcon width={60} height={67} />
                    </TouchableOpacity>
                </View >
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