import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput } from 'react-native'
import { nf, wp, hp, sw, sh } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Modal from "react-native-modalbox"
import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import Dropdown from '../../assets/svg/dropdown.svg'
import Eye from '../../assets/svg/eye-default.svg'
import EyeHidden from '../../assets/svg/eye-hidden.svg'
import Close from '../../assets/svg/close.svg'
import { useToast } from "react-native-toast-notifications";

import {
    requestGetFarmData,
    requestUpdateGeneralInfo,
    resetSuccessUpdateGeneralInfo
} from '../../store/user/actions';

export default function GeneralInformationScreen({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const [hidePass, setHidePass] = useState(true)
    const [farmTypeModalShown, setFarmTypeModalShown] = useState(false)

    const [farmName, setFarmName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [farmUid, setFarmUid] = useState('')

    const [type, setType] = useState('dairy')
    const [herdSize, setHerdSize] = useState(0)

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { updateGeneralInfoLoading } = useSelector(state => ({
        updateGeneralInfoLoading: state.userReducer.updateGeneralInfoLoading,
    }), shallowEqual);

    const { updateGeneralInfoSuccess } = useSelector(state => ({
        updateGeneralInfoSuccess: state.userReducer.updateGeneralInfoSuccess,
    }), shallowEqual);

    useEffect(() => {
        handleGetFarmData(currUser.farm)

        if (farmData) {
            setFarmUid(currUser.farm)
            setFarmName(farmData.name)
            setEmail(farmData.email)
            setPhone(farmData.phoneNumber)
            setAddress(farmData.address)
            setType(farmData.type)
            setHerdSize(farmData.herdSize)
        }

        if (updateGeneralInfoSuccess) {
            toast.show("Data successfully updated!", {type: 'success',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
            handleGetFarmData(currUser.farm)
            dispatch(resetSuccessUpdateGeneralInfo())
            navigation.goBack()
        }

    }, [updateGeneralInfoSuccess]);

    const handleGetFarmData = (farmUid) => {
        if (farmUid) {
            dispatch(requestGetFarmData(farmUid));
        }
    };

    const handleUpdateGeneralInfo = (farmUid) => {
        let generalInfo = {}

        if (farmName) generalInfo = { ...generalInfo, name: farmName } 
        if (email) generalInfo = { ...generalInfo, email: email }
        if (phone) generalInfo = { ...generalInfo, phoneNumber: phone }
        if (address) generalInfo = { ...generalInfo, address: address }
        if (type) generalInfo = { ...generalInfo, type: type }
        if (herdSize) generalInfo = { ...generalInfo, herdSize: herdSize }
        
        dispatch(requestUpdateGeneralInfo(farmUid,generalInfo));
    };

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <FarmInformationCard
                            farmName={farmName}
                            changeFarmName={(name) => setFarmName(name)}

                            email={email}
                            changeEmail={(email) => setEmail(email)}

                            phone={phone}
                            changePhone={(phone) => setPhone(phone)}

                            address={address}
                            changeAddress={(address) => setAddress(address)}
                        />
                        <FarmCard
                            type={type}
                            onPressSelectType={() => setFarmTypeModalShown(true)}
                            herdSize={herdSize}
                            changeHerdSize={(size) => setHerdSize(size)}
                        />
                        {/* <ChangePasswordCard hidePass={hidePass} setHidePass={() => setHidePass(!hidePass)} /> */}
                        <CustomButton1 disabled={updateGeneralInfoLoading} loading={updateGeneralInfoLoading}  title="Save" onPress={() => handleUpdateGeneralInfo(farmUid)} style={{width:'100%'}}  />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {
                farmTypeModalShown &&
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
                    isOpen={farmTypeModalShown}
                    onClosed={() => setFarmTypeModalShown(false)}
                >
                    {
                        <FarmTypeModal
                            onPressType={(type) => {setType(type) ,setFarmTypeModalShown(false)}}
                            onPressClose={() => setFarmTypeModalShown(false)} />
                    }
                </Modal>
            }
        </SafeAreaView>
    )
}

const ChangePasswordCard = (props) => {
    const { hidePass, setHidePass } = props
    
    return (
        <View style={{ width: '100%', backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 20, marginBottom:20 }}>
            <View style={{marginBottom:12}}>
                <Text style={Fonts.h4}>Change password</Text>
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
                        // onChangeText={text => setPassword(text)}
                        value={"123456"}
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
    )
}


const FarmCard = (props) => {
    const { type, onPressSelectType, herdSize, changeHerdSize } = props;

    return (
        <View style={{ width: '100%', backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 20, marginBottom:20 }}>
            <View style={{marginBottom:12}}>
                <Text style={Fonts.h4}>Farm</Text>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Type</Text>
                <TouchableOpacity onPress={onPressSelectType} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{flex:1}}>
                        <Text style={Fonts.bodySmall}>{type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}</Text>
                    </View>

                    <Dropdown width={14} height={14} />
                </TouchableOpacity>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Herd size</Text>
                <TextInput  
                    autoCapitalize="none"    
                    autoCorrect={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass]}
                    placeholder="0" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => changeHerdSize(text)}
                    value={herdSize}
                />
            </View>
        </View>
    )
}

const FarmInformationCard = (props) => {
    const {
        farmName, changeFarmName,
        email,changeEmail,
        phone,changePhone,
        address,changeAddress
    } = props
    return (
        <View style={{ width: '100%', backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 20, marginBottom:20 }}>
            <View style={{marginBottom:12}}>
                <Text style={Fonts.h4}>Farm Information</Text>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Farm Name</Text>
                <TextInput  
                    autoCapitalize="none"    
                    autoCorrect={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass]}
                    placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => changeFarmName(text)}
                    value={farmName}
                />
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Email</Text>
                <TextInput  
                    autoCapitalize="none"    
                    autoCorrect={false}
                    editable={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass,{backgroundColor:Colors.neutral40, borderColor: Colors.neutral60}]}
                    // placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => changeEmail(text)}
                    value={email}
                />
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Phone Number</Text>
                <TextInput  
                    autoCapitalize="none"    
                    autoCorrect={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass]}
                    placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => changePhone(text)}
                    value={phone}
                />
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Address</Text>
                <TextInput  
                    autoCapitalize="none"    
                    autoCorrect={false}
                    multiline={true}
                    style={[Fonts.bodySmall,styles.textInputStyleClass,{textAlignVertical:'top', height: 106}]}
                    placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => changeAddress(text)}
                    value={address}
                />
            </View>
        </View>
    )
}

const FarmTypeModal = (props) => { 
    const { onPressType, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(16),
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
                <Text style={Fonts.h6}>Type</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                <TouchableOpacity onPress={() => onPressType('dairy')}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Dairy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressType('beef')}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Beef</Text>
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
        textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})