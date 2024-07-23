import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView } from 'react-native'
import { nf, wp, hp, sw, sh } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Modal from "react-native-modalbox"

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import { convertDate } from '../../utils/reusableFunctions'

import AlertRed from '../../assets/svg/alert-red.svg'
import WarningOct from '../../assets/svg/warning-octagon.svg'
import moment from "moment";
import { useToast } from "react-native-toast-notifications";

import {
    requestGetTasks,
    requestDeleteTask,
    resetSuccessDeleteTask,
    requestEditTaskData,
    resetSuccessEditTaskData
} from '../../store/task/actions';

export default function TaskDetailScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const {userData, herdData, taskData}= route.params;
    const [deleteTaskModalShown, setDeleteTaskModalShown] = useState(false)
    const [currUserRights, setCurrUserRights] = useState([])

    const { deleteTaskSuccess } = useSelector(state => ({
        deleteTaskSuccess: state.taskReducer.deleteTaskSuccess,
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { editTaskLoading } = useSelector(state => ({
        editTaskLoading: state.taskReducer.editTaskLoading,
    }), shallowEqual);

    const { editTaskSuccess } = useSelector(state => ({
        editTaskSuccess: state.taskReducer.editTaskSuccess,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);


    useEffect(() => {
        let filteredUserData = users.filter(user => user.uid == currUser.uid)
        setCurrUserRights(filteredUserData[0].rights)
    },[])

    useEffect(() => {
        if (deleteTaskSuccess) {
            toast.show("Successfully delete task", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetTasks(currUser.farm)
            setDeleteTaskModalShown(false)
            dispatch(resetSuccessDeleteTask())
            navigation.navigate('Tasks')
        }
        if (editTaskSuccess) {
            // toast.show("Successfully change task status", { type: 'success', placement: 'top' });
            handleGetTasks(currUser.farm)
            dispatch(resetSuccessEditTaskData())
            navigation.goBack()
        }
        
    }, [deleteTaskSuccess, editTaskSuccess]);

    const handleGetTasks = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetTasks(farmUid));
        }
    };

    const handleDeleteTask = () => {
        dispatch(requestDeleteTask(taskData.uid,currUser.farm));
    };

    const handleChangeTaskStatus = (status) => {
        const task = {
            status: status
        };

        dispatch(requestEditTaskData(taskData.uid,currUser.farm,task));
        console.log('edit task status: ', task)
    };

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <TaskDetailForm
                            currUserRights={currUserRights}
                            userData={userData}
                            herdData={herdData}
                            taskData={taskData}
                            onPressEdit={() => navigation.navigate('EditTaskScreen', { taskData: taskData, userData: userData, herdData: herdData})}
                            onPressDelete={() => setDeleteTaskModalShown(true)}
                        />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {
                currUserRights.includes('add_herd') &&
                <TaskDetailBottomNav isLoading={editTaskLoading} taskData={taskData} onPressChange={()=> handleChangeTaskStatus(taskData.status == 'new' ? 'in_progress' : taskData.status == 'in_progress' ? 'done' : 'done')} />
            }
            {
                deleteTaskModalShown &&
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
                    isOpen={deleteTaskModalShown}
                    onClosed={() => setDeleteTaskModalShown(false)}
                >
                    {
                        <DeleteTaskModal 
                           onPressCancel={()=> setDeleteTaskModalShown(false)}
                           onPressDelete={()=> handleDeleteTask()}
                        />
                    }
                </Modal>
            }
        </SafeAreaView>
    )
}

const TaskDetailForm = (props) => {
    const { userData, herdData, taskData, onPressEdit, onPressDelete, currUserRights } = props
    
    // const date = new Date(taskData.deadline);
    // const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    // const finalDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+)/, function(match, p1, p2, p3) {
    // return `${p1} ${p2} ${p3}`;
    // });

    return (
        <View style={{ width: '100%', backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 20 }}>
            <View style={{marginBottom:12}}>
                <View  style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between', marginBottom: 12}}>
                    <Text style={Fonts.bodyLargeMedium}>Basic Information</Text>
                    {
                        currUserRights.includes('add_herd') &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                            <TouchableOpacity onPress={onPressEdit}>
                                <Text style={[Fonts.button, { color: Colors.orange, marginRight: 12 }]}>Edit task</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onPressDelete}>
                                <Text style={[Fonts.button, { color: Colors.orange }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <View style={{flexDirection:'row', alignItems:'center', marginBottom: 12}}>
                    <View style={{ flex: 2, height: 90, marginRight: 6, backgroundColor: Colors.white, borderRadius: 4, borderWidth: 1, borderColor: Colors.orange60, justifyContent: 'center', alignItems:'center'}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Assigned to</Text>
                        <Text style={Fonts.h4}>{userData && userData.name ? userData.name : '-'}</Text>
                        <Text style={Fonts.h6}>{userData && userData.name ? userData.title : '-'}</Text>
                    </View>
                    <View style={{ flex: 2, height: 90, marginLeft: 6, paddingVertical: 8, backgroundColor: Colors.white, borderRadius: 4, borderWidth: 1, borderColor: Colors.orange60, justifyContent: 'flex-start', alignItems:'center'}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Due date</Text>
                        <Text style={Fonts.h4}>{taskData && taskData.deadline ? moment(taskData.deadline).format('MMM, DD YYYY') : 'N/A'}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, height: 323, marginRight: 6, paddingVertical:10, paddingHorizontal:20, backgroundColor: Colors.white, borderRadius: 4, borderWidth: 1, borderColor: Colors.orange60, justifyContent: 'flex-start', alignItems:'center'}}>
                    <Text style={[Fonts.bodyMedium,{marginBottom:10}]}>
                        {taskData && taskData.title ? taskData.title : '-'}
                    </Text>
                    <View style={{alignSelf:'flex-start'}}>
                        <Text style={Fonts.bodySmall}>
                            {taskData && taskData.description ? taskData.description : '-'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ marginBottom: 12 }} >
                <Text style={[Fonts.bodyLargeMedium, { marginBottom: 12 }]}>Cow detail</Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{flex:3, marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 4, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Cow ID</Text>
                        <Text style={Fonts.h6}>{herdData && herdData.id ? herdData.id : 'N/A'}</Text>
                    </View>
                    <View style={{flex:4, marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 4, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Last Calving Date</Text>
                        <Text style={Fonts.bodyLargeMedium}>{herdData && herdData.calvingDate ? moment(herdData.calvingDate).format('YYYY/MM/DD') : 'N/A'}</Text>
                    </View>
                    {/* <View style={{flex:4, marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 4, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Birth date</Text>
                        <Text style={Fonts.bodyLargeMedium}>{herdData ? moment(herdData.birthDate).format('YYYY/MM/DD') : 'N/A'}</Text>
                    </View> */}
                    <View style={{flex:2,  marginRight:8, justifyContent:'center', alignItems:'center', backgroundColor: Colors.white, borderRadius: 4, borderWidth:1, borderColor: Colors.orange60, paddingVertical: 12}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Cam</Text>
                        <Text style={Fonts.bodyLargeMedium}>{herdData && herdData.camera ? herdData.camera : 'N/A'}</Text>
                    </View>
                </View>
            </View>

            <View>
                <Text style={[Fonts.bodyLargeMedium, { marginBottom: 12 }]}>Reproduction</Text>
                <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
                    <View style={{flex:2, height:84, paddingVertical:10 , marginRight:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Latest activity</Text>
                        <Text style={[Fonts.h6]}>{herdData && herdData.latestActivity ? moment(herdData.latestActivity).format('YYYY/MM/DD') : 'N/A'}</Text>
                    </View>
                    <View style={{ flex:2, height:84, paddingVertical: 10, marginLeft:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                        <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Score</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={[Fonts.h6, { color: Colors.alertRed, marginRight: 4 }]}>{Math.round( herdData && herdData.length != 0 ? herdData.score * 5 : 0)}/5</Text>
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

        </View>
    )
}


const DeleteTaskModal = (props) => { 
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
                <Text style={[Fonts.h4, { textAlign: 'center', marginBottom: 6 }]}>Would you like to delete this task?</Text>
                <Text style={[Fonts.bodySmall, { textAlign: 'center', marginBottom: 20 }]}>Deleted task can no longer appear in your app</Text>
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


const TaskDetailBottomNav = (props) => {
    const { taskData, onPressChange, isLoading } = props;
    
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
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <CustomButton1 disabled={taskData.status == 'done' ? true : isLoading} loading={isLoading} title={taskData.status == 'new' ? "Change status to be in progress" : taskData.status == 'in_progress' ? "Change status to be completed" : "Task done"} onPress={onPressChange} style={{width:'100%'}}  />
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
        textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})