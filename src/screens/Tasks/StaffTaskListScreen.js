import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import AlertRed from '../../assets/svg/alert-red.svg'
import UserFillBlack from '../../assets/svg/user-fill-black.svg'
import CowFillBlack from '../../assets/svg/cow-fill-black.svg'
import DateFillBlack from '../../assets/svg/date-fill-black.svg'

import { convertDate, getDatesDifference } from '../../utils/reusableFunctions'

import {
    requestGetTasks,
    resetSuccessEditTaskData
} from '../../store/task/actions';


export default function StaffTaskListScreen({ route, navigation }) {
    const dispatch = useDispatch();

    const [statusMode, setStatusMode] = useState('new')
    const { staffName, staffTaskData } = route.params;
    const [newTasks, setNewTasks] = useState([])
    const [inProgressTasks, setInProgressTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);

    const { newTasks2, inProgressTasks2, doneTasks2, tasks } = useSelector(state => ({
        newTasks2: state.taskReducer.tasks.filter(task => task.status == 'new'),
        inProgressTasks2: state.taskReducer.tasks.filter(task => task.status == 'in_progress'),
        doneTasks2: state.taskReducer.tasks.filter(task => task.status == 'done'),
        tasks: state.taskReducer.tasks
    }), shallowEqual);

    const { editTaskSuccess } = useSelector(state => ({
        editTaskSuccess: state.taskReducer.editTaskSuccess,
    }), shallowEqual);

    useEffect(() => {
        setNewTasks(staffTaskData.tasks.filter(task => task.status == 'new'))
        setInProgressTasks(staffTaskData.tasks.filter(task => task.status == 'in_progress'))
        setDoneTasks(staffTaskData.tasks.filter(task => task.status == 'done'))
    }, []);

    useEffect(() => {
        handleGetTasks()
        dispatch(resetSuccessEditTaskData())
    }, [editTaskSuccess])

    // useEffect(() => {
    //     if (newTasks2) {
    //         const userNewTask = newTasks2.reduce((acc, task) => {
    //             const key = task.assignedTo;
    //             const index = acc.findIndex(p => p.userUid === key);
    //             if (index === -1) {
    //                 acc.push(task);
    //             }
    //             return acc;
    //         }, []);
    //         setNewTasks(userNewTask)
    //     }
    //     if (inProgressTasks2) {
    //         const userInProgressTask = inProgressTasks2.reduce((acc, task) => {
    //             const key = task.assignedTo;
    //             const index = acc.findIndex(p => p.userUid === key);
    //             if (index === -1) {
    //                 acc.push(task);
    //             }
    //             return acc;
    //         }, []);
    //         setInProgressTasks(userInProgressTask)
    //     }
    //     if (doneTasks2) {
    //         const userDoneTask = doneTasks2.reduce((acc, task) => {
    //             const key = task.assignedTo;
    //             const index = acc.findIndex(p => p.userUid === key);
    //             if (index === -1) {
    //                 acc.push(task);
    //             }
    //             return acc;
    //         }, []);
    //         setDoneTasks(userDoneTask)
    //     }
    // },[tasks])
    
    const handleGetTasks = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetTasks(farmUid));
        }
    };

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 12 }}>
                        <TaskListMenu users={users} herds={herds} newTasks={newTasks} inProgressTasks={inProgressTasks} doneTasks={doneTasks} statusMode={statusMode} onPressTask={(userData, herdData, taskData) => navigation.navigate('TaskDetailScreen', { userData: userData, herdData : herdData, taskData: taskData })} onPressMode={(mode) => setStatusMode(mode)} />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>

        </SafeAreaView>
    )
}



const TaskListMenu = (props) => {
    const { users, herds, newTasks, inProgressTasks, doneTasks, onPressTask, onPressMode, statusMode } = props
    
    return (
        <View style={{ marginBottom: 12}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {
                    statusMode == 'new' ?
                        <CustomButton1 onPress={() => onPressMode('new')} title="New" style={{ flex: 1, height:30 }} />
                        :
                        <CustomButtonOutlined1 onPress={() => onPressMode('new')} title="New" style={{ flex: 1, height:30 }} />
                }
                {
                    statusMode == 'in_progress' ?
                        <CustomButton1 onPress={() => onPressMode('in_progress')} title="In progress" style={{ flex: 1, marginHorizontal: 12, height:30 }} />
                        :
                        <CustomButtonOutlined1 onPress={() => onPressMode('in_progress')} title="In progress" style={{ flex: 1, marginHorizontal: 12, height:30 }} />
                }
                {
                    statusMode == 'done' ?
                        <CustomButton1 onPress={() => onPressMode('done')} title="Done" style={{ flex: 1, height:30 }} />
                        :
                        <CustomButtonOutlined1 onPress={() => onPressMode('done')} title="Done" style={{flex:1, height:30}} />
                }
            </View>
            <View style={{marginTop:15}}>
                {
                    statusMode == 'new' &&
                    newTasks.map(task => (
                        <TaskCard users={users} herds={herds} taskData={task} onPressTask={(userData, herdData, taskData) => onPressTask(userData, herdData, taskData)} />
                    ))
                }
                {
                    statusMode == 'in_progress' &&
                    inProgressTasks.map(task => (
                        <TaskCard users={users} herds={herds} taskData={task} onPressTask={(userData, herdData, taskData) => onPressTask(userData, herdData, taskData)} />
                    ))
                }
                {
                    statusMode == 'done' &&
                    doneTasks.map(task => (
                        <TaskCard users={users} herds={herds} taskData={task} onPressTask={(userData, herdData, taskData) => onPressTask(userData, herdData, taskData)} />
                    ))
                }
            </View>
        </View>
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

const TaskCard = (props) => {
    const { users, herds, taskData, onPressTask } = props
    const whichUser = (uid) => {
        return users.filter(user => user.uid == uid)
    }

    const whichHerd = (uid) => {
        return herds.filter(herd => herd.uid == uid)
    }

    const userData = whichUser(taskData.assignedTo ? taskData.assignedTo : '')
    const herdData = whichHerd(taskData.cow)

    function checkIsNum(num) {
        if ((typeof num === 'number') && (num % 1 === 0)) return true;
        if ((typeof num === 'number') && (num % 1 !== 0)) return true;
        if (typeof num === 'number') return true;
    }
    
    return (
        <TouchableOpacity
            onPress={()=> onPressTask(userData[0], herdData[0], taskData)}
            activeOpacity={0.5}
            style={{
                width: '100%',
                height: 157,
                backgroundColor: Colors.orange40,
                borderRadius: 8,
                padding: 16,
                marginBottom:12,
                justifyContent: 'center',
                alignItems: 'center'
        }}>
            <View style={{alignSelf:'flex-start'}}>
                <Text style={[Fonts.h6, { marginBottom: 4 }]}>{ taskData.title }</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <UserFillBlack width={12} height={12} />
                    <Text style={[Fonts.captionRegular, { marginLeft: 4 }]}>Assigned to {userData && userData.length != 0 ? userData[0].name : ''} • {userData && userData.length != 0 ? userData[0].title : ''}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <CowFillBlack width={12} height={12} />
                    {/* <Text style={[Fonts.captionRegular,{marginLeft:4}]}>8040 • Group 1</Text> */}
                    <Text style={[Fonts.captionRegular, { marginLeft: 4 }]}>{herdData && herdData.length != 0 ? herdData[0].id : ''}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <DateFillBlack width={12} height={12} />
                    <Text style={[Fonts.captionRegular, { marginLeft: 4 }]}>{convertDate(taskData.deadline)}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{ paddingHorizontal:12, height: 26, backgroundColor: Colors.alertRed60, flexDirection: 'row', alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        <AlertRed width={10} height={10} />
                        <Text style={[Fonts.captionRegular,{color: Colors.alertRed, marginTop:3, marginLeft:4}]}>{Math.round(herdData && herdData.length != 0 ? herdData.score && checkIsNum(herdData.score) ? herdData[0].score * 5 : 0 : 0)}/5</Text>
                    </View>
                    <View style={{ paddingHorizontal:12, height: 26, backgroundColor:getDatesDifference(convertDate(taskData.deadline)) < 1 ? Colors.alertRed60 : Colors.alertGreen20, flexDirection: 'row', alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        {getDatesDifference(convertDate(taskData.deadline)) < 1 ? 
                            <AlertRed width={10} height={10} />
                            :
                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.alertGreen }} />    
                        }   
                        <Text style={[Fonts.captionRegular, { color: getDatesDifference(convertDate(taskData.deadline)) < 1 ? Colors.alertRed : Colors.alertGreen, marginTop: 3, marginLeft: 4 }]}>{getDatesDifference(convertDate(taskData.deadline)) < 1 ? 'Overdue' : getDatesDifference(convertDate(taskData.deadline)) > 1 ? getDatesDifference(convertDate(taskData.deadline)) + ' Days left' :  getDatesDifference(convertDate(taskData.deadline)) + ' Day left'}</Text>
                    </View>
                    {/* <View style={{ paddingHorizontal:12, height: 26, backgroundColor: Colors.alertBlue40, alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        <Text style={[Fonts.captionRegular,{color: Colors.alertBlue, marginTop:3}]}>In progress</Text>
                    </View> */}
                    <TaskStatus status={taskData.status} />
                </View>
            </View>
        </TouchableOpacity>
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