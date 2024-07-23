import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, TextInput, View, ScrollView, SafeAreaView } from 'react-native'
import { nf, wp, hp, sh, sw } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Modal from "react-native-modalbox"

import { CustomButton1 } from '../../components/common/CustomButton';
import Dropdown from '../../assets/svg/dropdown.svg'
import Close from '../../assets/svg/close.svg'

import DatePicker from 'react-native-date-picker'
import moment from "moment";

import { useToast } from "react-native-toast-notifications";

import {
    requestGetHerds,
    requestEditHerdData,
    resetSuccessEditHerdData
} from '../../store/herd/actions';

export default function EditHerdScreen({ route, navigation }) {
    const { herdData } = route.params;
    const dispatch = useDispatch();
    const toast = useToast()

    const [repStatusModalShown, setRepStatusModalShown] = useState(false)
    const [birthdate, setBirthdate] = useState( herdData.birthDate ? new Date(herdData.birthDate) : new Date())
    const [calvingdate, setCalvingdate] = useState(herdData.calvingDate ? new Date(herdData.calvingDate) : new Date())
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [openCalvingDatePicker, setOpenCalvingDatePicker] = useState(false)
    const [avgMilkReproduction, setAvgMilkReproduction] = useState(herdData.averageMilk ? herdData.averageMilk : 0)
    const [lactDays, setLactDays] = useState(herdData.lactation ? herdData.lactation : 0)
    const [daySinceInse, setDaySinceInse] = useState(herdData.daySinceInsemination ? herdData.daySinceInsemination : 0)
    const [reproStatus, setReproStatus] = useState(herdData.reproductionStatus ? herdData.reproductionStatus : '')

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { editHerdLoading } = useSelector(state => ({
        editHerdLoading: state.herdReducer.editHerdLoading,
    }), shallowEqual);

    const { editHerdSuccess } = useSelector(state => ({
        editHerdSuccess: state.herdReducer.editHerdSuccess,
    }), shallowEqual);

    useEffect(() => {
        if (editHerdSuccess) {
            toast.show("Successfully edit herd data", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetHerds(currUser.farm)
            dispatch(resetSuccessEditHerdData())
            navigation.navigate('Herd')
        }
    }, [editHerdSuccess]);
    
    const handleGetHerds = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetHerds(farmUid));
        }
    };

    const handleEditHerd = () => {
        const herd = {
            birthDate: moment(birthdate).format('YYYY-MM-DDTHH:mm:ssZ'),
            averageMilk: avgMilkReproduction,
            calvingDate: moment(calvingdate).format('YYYY-MM-DDTHH:mm:ssZ'),
            daySinceInsemination: daySinceInse,
            lactation: lactDays,
            reproductionStatus: reproStatus
        };

        dispatch(requestEditHerdData(herdData.uid,currUser.farm,herd));
    };

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <EditHerdProfileFormCard
                            herdData={herdData}
                            birthDate={birthdate}
                            calvingDate={calvingdate}
                            avgMilkReproduction={avgMilkReproduction}
                            lactDays={lactDays}
                            daySinceInse={daySinceInse}
                            reproStatus={reproStatus}
                            setAvgMilkReproduction={(avg) => setAvgMilkReproduction(avg)}
                            setLactDays={(lact) => setLactDays(lact)}
                            setDaySinceInse={(day) => setDaySinceInse(day)}
                            onPressRepStatus={() => setRepStatusModalShown(true)}
                            onPressChooseBirthdate={() => setOpenDatePicker(true)}
                            onPressChooseCalvingdate={() => setOpenCalvingDatePicker(true)}
                        />
                        <CustomButton1 disabled={editHerdLoading} loading={editHerdLoading} title="Save" onPress={() => handleEditHerd()} />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {
                repStatusModalShown &&
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
                    isOpen={repStatusModalShown}
                    onClosed={() => setRepStatusModalShown(false)}
                >
                    {
                        <ReproductionStatusModal 
                            onPressClose={() => setRepStatusModalShown(false)}
                            onPressStatus={(stat) => {setReproStatus(stat),setRepStatusModalShown(false)}}
                        />
                    }
                </Modal>
            }
            <DatePicker
                modal
                mode="date"
                open={openDatePicker}
                date={birthdate}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    setBirthdate(date)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
            <DatePicker
                modal
                mode="date"
                open={openCalvingDatePicker}
                date={calvingdate}
                onConfirm={(date) => {
                    setOpenCalvingDatePicker(false)
                    setCalvingdate(date)
                }}
                onCancel={() => {
                    setOpenCalvingDatePicker(false)
                }}
            />
        </SafeAreaView>
    )
}


const EditHerdProfileFormCard = (props) => {
    const {
        herdData, birthDate, 
        calvingDate, onPressRepStatus,
        onPressChooseBirthdate, onPressChooseCalvingdate,
        avgMilkReproduction,lactDays,
        daySinceInse,reproStatus,
        setAvgMilkReproduction,setLactDays,
        setDaySinceInse
    } = props
    return (
        <View style={{paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8, marginBottom:20}}>
            <View style={{ flexDirection: 'row', alignItems:'center'}}>
                <View style={{flex:2}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Cow ID</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        editable={false}
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass,{backgroundColor:Colors.neutral40, borderColor: Colors.neutral60}]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={`${herdData.id}`}
                    />
                </View>
                <TouchableOpacity onPress={onPressChooseCalvingdate} style={{flex:2, marginLeft:12}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Last Calving Date</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        editable={false}
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={ calvingDate != '' ? moment(calvingDate).format('YYYY/MM/DD') : moment().format('YYYY/MM/DD')}
                    />
                </TouchableOpacity>
                {/* <View style={{ flex:2,marginLeft:12}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Group</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={"2"}
                    />
                </View> */}
            </View>
            {/* <TouchableOpacity onPress={onPressChooseBirthdate} style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Date of birth</Text>
                <TextInput  
                    autoCapitalize="none"    
                    editable={false}
                    autoCorrect={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass]}
                    // placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    // onChangeText={text => setEmail(text)}
                    value={ birthDate != '' ? moment(birthDate).format('YYYY/MM/DD') : moment().format('YYYY/MM/DD')}
                />
            </TouchableOpacity> */}
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Reproduction status</Text>
                <TouchableOpacity onPress={onPressRepStatus} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{flex:1}}>
                        <Text style={Fonts.bodySmall}>{reproStatus ? reproStatus : 'Choose here'}</Text>
                    </View>
                    <Dropdown width={14} height={14} />
                </TouchableOpacity>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>7-days average milk reproduction</Text>
                    <TextInput  
                        keyboardType='numeric'
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[Fonts.bodySmall, styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        onChangeText={text => setAvgMilkReproduction(text)}
                        value={avgMilkReproduction}
                    />
                </View>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Lactation days</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        keyboardType='numeric'
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        onChangeText={text => setLactDays(text)}
                        value={lactDays}
                    />
                </View>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Days since last insemination</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        keyboardType='numeric'
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        onChangeText={text => setDaySinceInse(text)}
                        value={daySinceInse}
                    />
                </View>
            </View>
        </View>
    )
}

const ReproductionStatusModal = (props) => { 
    const { onPressStatus, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(22),
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
                <Text style={Fonts.h6}>Reproduction status</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                <TouchableOpacity onPress={() => onPressStatus('Insemination')}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Insemination</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={onPressStatus}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Placeholders for other statuses</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={onPressStatus}>
                    <Text style={Fonts.bodyLarge}>Placeholders for other statuses</Text>
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
        textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})