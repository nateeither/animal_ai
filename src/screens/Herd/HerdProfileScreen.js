import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView } from 'react-native'
import { nf, wp, hp, sh, sw } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'

import Modal from "react-native-modalbox"
import moment from "moment";

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import LinkeSimpleOrange from '../../assets/svg/link-simple-orange.svg'
import ShareNetwork from '../../assets/svg/share-network.svg'
import AlertRed from '../../assets/svg/alert-red.svg'
import CheckGreenCircle from '../../assets/svg/check-green-circle.svg'
import Close from '../../assets/svg/close.svg'
import CopyCircle from '../../assets/svg/copy-with-circle.svg'

//Socmed SVG
import Facebook from '../../assets/svg/socmed/facebook.svg'
import Whatsapp from '../../assets/svg/socmed/whatsapp.svg' 
import Telegram from '../../assets/svg/socmed/telegram.svg' 
import Twitter from '../../assets/svg/socmed/twitter.svg'
import Line from '../../assets/svg/socmed/line.svg'
import WarningOct from '../../assets/svg/warning-octagon.svg'

import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    requestGetHerds,
    requestDeleteHerd,
    resetSuccessDeleteHerd
} from '../../store/herd/actions';

export default function HerdProfileScreen({ route, navigation }) {
    const { herdData } = route.params;
    const dispatch = useDispatch();
    const toast = useToast()
    
    const [copyLinkModalShown, setCopyLinkModalShown] = useState(false)
    const [shareMediaModalShown, setShareMediaModalShown] = useState(false)
    const [deleteHerdModalShown, setDeleteHerdModalShown] = useState(false)
    const [cowAssigned, setCowAssigned] = useState(false)
    const [assignedTaskData, setAssignedTaskData] = useState({})

    const [currUserRights, setCurrUserRights] = useState([])

    const { deleteHerdSuccess } = useSelector(state => ({
        deleteHerdSuccess: state.herdReducer.deleteHerdSuccess,
    }), shallowEqual);

    const { deleteHerdLoading } = useSelector(state => ({
        deleteHerdLoading: state.herdReducer.deleteHerdLoading,
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { tasks } = useSelector(state => ({
        tasks: state.taskReducer.tasks
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);


    useEffect(() => {
        if (deleteHerdSuccess) {
            toast.show("Successfully delete herd", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetHerds(currUser.farm)
            setDeleteHerdModalShown(false)
            dispatch(resetSuccessDeleteHerd())
            navigation.navigate('Herd')
        }
        checkIsAssigned()
    }, [deleteHerdSuccess]);

    useEffect(() => {
        let filteredUserData = users.filter(user => user.uid == currUser.uid)
        setCurrUserRights(filteredUserData[0].rights)
    },[])

    const handleGetHerds = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetHerds(farmUid));
        }
    };

    const handleDeleteHerd = () => {
        dispatch(requestDeleteHerd(herdData.uid,currUser.farm));
    };

    const checkIsAssigned = () => {
        tasks.map(task => {
            if (task.cow == herdData.uid) {
                setAssignedTaskData(task)
                setCowAssigned(true)
            }
        })
    }

    console.log(herdData)

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <Image style={{ borderRadius: 6, height: 224, width: 224, alignSelf: 'center', marginBottom: 20, marginTop: 12 }} source={Images.cowImage} />
                        <BasicInformationCard herdData={herdData} onPressCopyLink={() => setCopyLinkModalShown(true)} onPressShareMedia={() => setShareMediaModalShown(true)} />
                        {
                            currUserRights.includes('add_herd') &&
                            <View style={{
                                width: '100%',
                                alignSelf:'center',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginTop: 20,
                                marginBottom:10
                            }}>
                                <CustomButton1 title="Edit" onPress={()=> navigation.navigate('EditHerdScreen',{herdData: herdData})} style={{ width: '48.5%' }} />
                                <CustomButtonOutlined1 title="Delete" onPress={() => setDeleteHerdModalShown(true)} style={{width:'48.5%'}} />
                            </View >
                        }
                        
                        {
                            (!cowAssigned && currUserRights.includes('add_herd')) && <CustomButton1 title="Create task" onPress={() => navigation.navigate('CreateHerdTaskScreen', { selectedHerdUid: herdData.uid })} style={{ width: '100%' }} />
                        }
                        {
                            cowAssigned && <TaskAssignedStatusCard users={users} taskData={assignedTaskData} onPressTask={(userData, taskData) => navigation.navigate('TaskDetailScreen', { userData: userData, herdData: herdData, taskData: taskData })} />
                        }
                        <View style={{marginBottom: 20}} />
                        <ReproductionCard herdData={herdData}/>
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {
                deleteHerdModalShown &&
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
                    isOpen={deleteHerdModalShown}
                    onClosed={() => setDeleteHerdModalShown(false)}
                >
                    {
                        <DeleteHerdModal 
                            loading={deleteHerdLoading}
                            onPressCancel={()=> setDeleteHerdModalShown(false)}
                            onPressDelete={()=> handleDeleteHerd()}
                        />
                    }
                </Modal>
            }
            {
                shareMediaModalShown &&
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
                    isOpen={shareMediaModalShown}
                    onClosed={() => setShareMediaModalShown(false)}
                >
                    {
                        <ShareMediaModal onPressClose={() => setShareMediaModalShown(false)} onPressMedia={() => setShareMediaModalShown(false)} />
                    }
                </Modal>
            }
            {
                copyLinkModalShown &&
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
                    isOpen={copyLinkModalShown}
                    onClosed={() => setCopyLinkModalShown(false)}
                >
                    {
                        <CopyLinkModal onPressClose={() => setCopyLinkModalShown(false)} onPressCopy={() => setCopyLinkModalShown(false)} />
                    }
                </Modal>
            }
        </SafeAreaView>
    )
}

const TaskStatus = (props) => {
    const { status } = props;

    let statusComponent = <View />
    switch (status) {
        case 'new':
            statusComponent = <View style={{ paddingHorizontal: 12, height: 26, backgroundColor: Colors.alertGreen20, alignItems: 'center', justifyContent: 'center', borderRadius: 35, marginRight: 4 }}>
                <Text style={[Fonts.captionRegular, { color: Colors.alertGreen, marginTop: 3 }]}>New</Text>
            </View>
            break;                   
        case 'in_progress':
            statusComponent = <View style={{ paddingHorizontal:12, height: 26, backgroundColor: Colors.alertBlue40, alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                                <Text style={[Fonts.captionRegular,{color: Colors.alertBlue, marginTop:3}]}>In progress</Text>
            </View>
            break;
        case 'done':
            statusComponent = <View style={{ paddingHorizontal: 12, height: 26, backgroundColor: Colors.alertGreen20, alignItems: 'center', justifyContent: 'center', borderRadius: 35, marginRight: 4 }}>
                                <Text style={[Fonts.captionRegular, { color: Colors.alertGreen, marginTop: 3 }]}>Done</Text>
            </View>     
            break;
    }

    return statusComponent
}

const TaskAssignedStatusCard = (props) => {
    const { taskData, users, onPressTask } = props

    const whichUser = (uid) => {
        return users.filter(user => user.uid == uid)
    }

    const userData = whichUser(taskData.assignedTo ? taskData.assignedTo : '')
    
    return (
        <TouchableOpacity
            onPress={()=> onPressTask(userData[0], taskData)}
            style={{ width: '100%', borderRadius: 8, backgroundColor: Colors.orange40, paddingHorizontal: 12, paddingVertical: 14, marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:12 }}>
                <CheckGreenCircle width={20} height={20} />
                <Text style={[Fonts.button,{color: Colors.orange, marginLeft:8, marginTop:3}]}>Assigned to {userData && userData.length != 0 ? userData[0].name : ''} • {userData && userData.length != 0 ? userData[0].title : ''}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <TaskStatus status={taskData.status} />
                <Text style={[Fonts.button,{color: Colors.orange, left: 10}]}>See task</Text>
            </View>
        </TouchableOpacity>
    )
}

const ReproductionCard = (props) => {
    const { herdData } = props


    function checkIsNum(num) {
        if ((typeof num === 'number') && (num % 1 === 0)) return true;
        if ((typeof num === 'number') && (num % 1 !== 0)) return true;
        if (typeof num === 'number') return true;
    }
    
    return (
        <View style={{width:'100%', alignSelf:'center', alignItems:'center', justifyContent:'center',  backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 20 }}>
            <Text style={[Fonts.h4, { alignSelf: 'flex-start', marginBottom: 12 }]}>Reproduction</Text>
            <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
                <View style={{flex:2, height:84, paddingVertical:10 , marginRight:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Latest activity</Text>
                    <Text style={[Fonts.h6]}>{herdData && herdData.latestActivity ? moment(herdData.latestActivity).format('YYYY/MM/DD') : 'N/A'}</Text>
                </View>
                <View style={{ flex:2, height:84, paddingVertical: 10, marginLeft:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Score</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={[Fonts.h6, { color: Colors.alertRed, marginRight: 4 }]}>{herdData.score && checkIsNum(herdData.score) ? Math.round(herdData.score * 5) :  '0'}/5</Text>
                        <View style={{marginBottom:3}}>
                            <AlertRed height={12} width={12} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
                <View style={{flex:2, height:84, paddingVertical:10 , marginRight:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Reproduction status</Text>
                    <Text style={[Fonts.h6]}>{herdData && herdData.reproductionStatus ? herdData.reproductionStatus : 'N/A'}</Text>
                </View>
                <View style={{ flex:2, height:84, paddingVertical: 10, marginLeft:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>7-days average milk reproduction</Text>
                    <Text style={[Fonts.h6]}>{herdData && herdData.averageMilk ? herdData.averageMilk : 'N/A'}</Text>
                </View>
            </View>
            <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={{flex:2, height:84, paddingVertical:10 , marginRight:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Lactation days</Text>
                    <Text style={[Fonts.h6]}>{herdData && herdData.lactation ? herdData.lactation : 'N/A'}</Text>
                </View>
                <View style={{ flex:2, height:84, paddingVertical: 10, marginLeft:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Days since last insemination</Text>
                    <Text style={[Fonts.h6]}>{herdData && herdData.daySinceInsemination ? herdData.daySinceInsemination : 'N/A'}</Text>
                </View>
            </View>
        </View>
    )
}

const BasicInformationCard = (props) => {
    const {herdData, onPressCopyLink, onPressShareMedia} = props
    return (
        <View style={{width:'100%', borderRadius: 8, backgroundColor: Colors.orange40, paddingHorizontal: 16, paddingVertical: 20 }}>
            <Text style={[Fonts.h4, { marginBottom: 12 }]}>Basic information</Text>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={{flex:2, paddingHorizontal:5, marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 8, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Cow ID</Text>
                    <Text style={[Fonts.bodyMedium,{textAlign:'center'}]}>{herdData.id ? herdData.id : 'N/A'}</Text>
                </View>
                <View style={{flex:5, marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 8, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Last Calving Date</Text>
                    <Text style={Fonts.bodyLargeMedium}>{herdData && herdData.calvingDate ? moment(herdData.calvingDate).format('YYYY/MM/DD') : 'N/A'}</Text>
                </View>
                {/* <View style={{flex:4, marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 8, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Birth date</Text>
                    <Text style={Fonts.bodyLargeMedium}>{herdData.birthDate ? moment(herdData.birthDate).format('YYYY/MM/DD') : 'N/A'}</Text>
                </View> */}
                <View style={{flex:2,  marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 8, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Cam</Text>
                    <Text style={Fonts.bodyLargeMedium}>{herdData && herdData.camera ? herdData.camera : 'N/A'}</Text>
                </View>
                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
                    <TouchableOpacity activeOpacity={1} onPress={onPressShareMedia}>
                        <ShareNetwork width={22} height={22} />
                    </TouchableOpacity>
                    <View style={{ marginBottom: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={onPressCopyLink}>
                        <LinkeSimpleOrange width={22} height={22} />
                    </TouchableOpacity>
                </View> */}
            </View>
        </View>
    )
}



const ShareMediaModal = (props) => { 
    const { onPressMedia, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(20),
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
                <Text style={Fonts.h6}>Share via</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop:20
            }}>
                <TouchableOpacity onPress={onPressMedia} style={{marginRight:12}}>
                    <CopyCircle width={44} height={44} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressMedia}  style={{marginRight:12}}>
                    <Facebook width={42} height={42} />
                </TouchableOpacity> 
                <TouchableOpacity onPress={onPressMedia}  style={{marginRight:12}}>
                    <Whatsapp width={42} height={42} />
                </TouchableOpacity> 
                <TouchableOpacity onPress={onPressMedia}  style={{marginRight:12}}>
                    <Telegram width={42} height={42} />
                </TouchableOpacity> 
                <TouchableOpacity onPress={onPressMedia}  style={{marginRight:12}}>
                    <Twitter width={42} height={42} />
                </TouchableOpacity> 
                <TouchableOpacity onPress={onPressMedia}>
                    <Line width={42} height={42} />
                </TouchableOpacity> 
            </View>
        </View>
    )
} 


const CopyLinkModal = (props) => { 
    const { onPressCopy, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(20),
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
                <Text style={Fonts.h6}>Copy link</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                <TouchableOpacity onPress={onPressCopy}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressCopy}  style={{ marginBottom: 14 }}>
                    <Text style={Fonts.bodyLarge}>Excel</Text>
                </TouchableOpacity> 
            </View>
        </View>
    )
} 

const DeleteHerdModal = (props) => { 
    const { loading, onPressCancel, onPressDelete } = props

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
                <Text style={[Fonts.h4, { textAlign: 'center', marginBottom: 6 }]}>Would you like to delete this cow?</Text>
                <Text style={[Fonts.bodySmall, { textAlign: 'center', marginBottom: 20 }]}>Deleted cow can no longer appear in your app</Text>
            </View>
            <View style={{ marginBottom:'auto', flexDirection:'row', alignItems:'center'}}>
                <CustomButtonOutlined1
                    title="Cancel"
                    onPress={onPressCancel}
                    style={{ width: '28.5%' }}
                />
                <View style={{marginHorizontal:4}} />
                <CustomButton1
                    disabled={loading}
                    loading={loading}
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