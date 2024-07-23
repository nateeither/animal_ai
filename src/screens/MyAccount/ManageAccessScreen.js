import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from 'react-native'
import { nf, wp, hp , sh, sw} from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import Modal from "react-native-modalbox"
import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import Star from '../../assets/svg/star-fill.svg'
import WarningOct from '../../assets/svg/warning-octagon.svg'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    requestGetUsers,
} from '../../store/user/actions';

export default function ManageAccessScreen({ navigation }) {
    const dispatch = useDispatch();

    const [deleteRoleModalShown, setDeleteRoleModalShown] = useState(false)

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { users, getUsersLoading } = useSelector(state => ({
        users: state.userReducer.users,
        getUsersLoading: state.userReducer.getUsersLoading
    }), shallowEqual);

    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };

    useEffect(() => {
        handleGetUsers(currUser.farm)
    }, []);
    

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                {
                    getUsersLoading ?
                    <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                        <ActivityIndicator
                            style={{ alignSelf: 'center' }}
                            size='large'
                            color={Colors.orange80} />
                    </View>
                     :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                            <RoleListContent users={users} onPressDeleteRole={() => setDeleteRoleModalShown(true)} onPressEditRole={(data) => navigation.navigate('EditRoleScreen',{userData: data})} />
                        </View>
                        <View style={{height: hp(5), marginBottom:'auto'}} />
                    </ScrollView>
                }
            </View>
            <ManageAccessBottomNav onPressAdd={() => navigation.navigate('AddNewRoleScreen')} />
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
        </SafeAreaView>
    )
}


const RoleListContent = (props) => {
    const { users, onPressDeleteRole, onPressEditRole } = props;

    
    return (
        <View>
            {
                users.map((item,index) => {
                    return <RoleCard data={item} index={index} onPressDeleteRole={onPressDeleteRole} onPressEditRole={(data) => onPressEditRole(data)} />
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
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
}


const ManageAccessBottomNav = (props) => {
    const { onPressAdd } = props;
    
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <CustomButton1 title="Add new role" onPress={onPressAdd} style={{width:'70%'}}  />
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
        textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})