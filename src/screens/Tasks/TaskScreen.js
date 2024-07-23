import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'

import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { nf, wp, hp , sw, sh} from '../../utils/utility'
import { CustomButton1, CustomButton2 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1, CustomButtonOutlined2 } from '../../components/common/CustomButtonOutlined';
import Modal from "react-native-modalbox"

import Filter from '../../assets/svg/filter.svg'
import AlertRed from '../../assets/svg/alert-red.svg'
import UserFillBlack from '../../assets/svg/user-fill-black.svg'
import CowFillBlack from '../../assets/svg/cow-fill-black.svg'
import DateFillBlack from '../../assets/svg/date-fill-black.svg'
import Close from '../../assets/svg/close.svg'
import CheckBox from '../../assets/svg/checkbox.svg'
import CheckBoxFilled from '../../assets/svg/checkbox-filled.svg'
import SupportIcon from '../../assets/svg/support-icon.svg'

import { convertDate, getDatesDifference } from '../../utils/reusableFunctions'

import {
    requestGetTasks,
} from '../../store/task/actions';

import {
    requestGetUsers,
} from '../../store/user/actions';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

export default function TaskScreen({ navigation }) {
    const dispatch = useDispatch();

    const [statusMode, setStatusMode ] = useState('new')
    const [filterModalShown, setFilterModalShown] = useState(false)
    const [otherStaffTasks, setOtherStaffTasks] = useState(undefined)
    const [otherStaffNewTasks, setOtherStaffNewTasks] = useState(undefined)
    const [otherStaffInProgressTasks, setOtherStaffInProgressTasks] = useState(undefined)
    const [otherStaffDoneTasks, setOtherStaffDoneTasks] = useState(undefined)
    const [selectedScore, setSelectedScore] = useState('')
    const [selectedRole, setSelectedRole] = useState('')

    const [tempFilteredNewTasks, setTempFilteredNewTasks] = useState(undefined)
    const [tempFilteredInProgressTasks, setTempFilteredInProgressTasks] = useState(undefined)
    const [tempFilteredDoneTasks, setTempFilteredDoneTasks] = useState(undefined)

    const [userRoles, setUserRoles] = useState([])
    const [currUserRights, setCurrUserRights] = useState([])

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);
    
    const { newTasks, inProgressTasks, doneTasks, tasks } = useSelector(state => ({
        newTasks: state.taskReducer.tasks.filter(task => task.status == 'new'),
        inProgressTasks: state.taskReducer.tasks.filter(task => task.status == 'in_progress'),
        doneTasks: state.taskReducer.tasks.filter(task => task.status == 'done'),
        tasks: state.taskReducer.tasks
    }), shallowEqual);

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);

    const handleGetTasks = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetTasks(farmUid));
        }
    };

    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };

    const onPressScoreCheckbox = (score) => {
        if (selectedScore.includes(score)) {
            setSelectedScore('')
        } else {
            setSelectedScore(score)
        }
    }

    const onPressRoleCheckbox = (role) => {
        if (selectedRole.includes(role)) {
            setSelectedRole('')
        } else {
            setSelectedRole(role)
        }
    }

    function checkIsNum(num) {
        if ((typeof num === 'number') && (num % 1 === 0)) return true;
        if ((typeof num === 'number') && (num % 1 !== 0)) return true;
        if (typeof num === 'number') return true;
    }

    const filterTask = () => {
        let result = []
        let taskList = statusMode == 'new' ? newTasks : statusMode == 'in_progress' ? inProgressTasks : doneTasks
        
        result = taskList.filter((task) => {
            const filteredUsers = users.filter(user => user.title == selectedRole);
            const userIds = filteredUsers.map(user => user.uid);

            const roleMatch = userIds.length === 0 || userIds.includes(task.assignedTo)

            let filteredCows = []
            
            if (selectedScore == 'high') {
                filteredCows.push(herds.reduce((max, current) => parseFloat(checkIsNum(current.score) ? current.score : 0) > parseFloat(checkIsNum(max.score) ? max.score : 0) ? current : max))
            }
            else if (selectedScore == 'low') {
                filteredCows.push(herds.reduce((min, current) => parseFloat(checkIsNum(current.score) ? current.score : 0) < parseFloat(checkIsNum(min.score) ? min.score : 0) ? current : min))
            }

            const cowIds = filteredCows.map(cow => cow.uid);

            const scoreMatch = cowIds.length === 0 || cowIds.includes(task.cow)

            return scoreMatch && roleMatch;
        });
        // console.log('the res: ', result)

        if (statusMode == 'new') setTempFilteredNewTasks(result)
        if (statusMode == 'in_progress') setTempFilteredInProgressTasks(result)
        if (statusMode == 'done') setTempFilteredDoneTasks(result)
    }

    useEffect(() => {
        handleGetTasks(currUser.farm)
        handleGetUsers(currUser.farm)
    }, []);

    useEffect(() => {
        let result = []
        users.map(user => {
            result.push(user.title)
        })

        setUserRoles(result)
    }, [])
    
    useEffect(() => {
        let filteredUserData = users.filter(user => user.uid == currUser.uid)
        setCurrUserRights(filteredUserData[0].rights)
    },[])
    
    useEffect(() => {
        if (tasks) {
            const userTask = tasks.reduce((acc, task) => {
                const key = task.assignedTo;
                const index = acc.findIndex(p => p.userUid === key);
                if (index === -1) {
                  acc.push({ userUid: key, tasks: [task] });
                } else {
                  acc[index].tasks.push(task);
                }
                return acc;
            }, []);
            setOtherStaffTasks(userTask)
        }
        if (newTasks) {
            const userNewTask = newTasks.reduce((acc, task) => {
                const key = task.assignedTo;
                const index = acc.findIndex(p => p.userUid === key);
                if (index === -1) {
                  acc.push({ userUid: key, tasks: [task] });
                } else {
                  acc[index].tasks.push(task);
                }
                return acc;
            }, []);
            setOtherStaffNewTasks(userNewTask)
        }
        if (inProgressTasks) {
            const userInProgressTask = inProgressTasks.reduce((acc, task) => {
                const key = task.assignedTo;
                const index = acc.findIndex(p => p.userUid === key);
                if (index === -1) {
                  acc.push({ userUid: key, tasks: [task] });
                } else {
                  acc[index].tasks.push(task);
                }
                return acc;
            }, []);
            setOtherStaffInProgressTasks(userInProgressTask)
        }
        if (doneTasks) {
            const userDoneTask = doneTasks.reduce((acc, task) => {
                const key = task.assignedTo;
                const index = acc.findIndex(p => p.userUid === key);
                if (index === -1) {
                  acc.push({ userUid: key, tasks: [task] });
                } else {
                  acc[index].tasks.push(task);
                }
                return acc;
            }, []);
            setOtherStaffDoneTasks(userDoneTask)
        }
    },[tasks])

    return (
        <SafeAreaView style={{flex:1, backgroundColor: Colors.orange40}}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.orange40}
            />
            <View style={{ marginTop: 33 }} />
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        width: wp(100),
                        height: hp(15),
                        backgroundColor: Colors.orange40,
                        paddingBottom: 20,
                        borderBottomLeftRadius: 24,
                        borderBottomRightRadius: 24
                        // paddingTop:16
                    }}>
                        <View style={{ width: wp(90), alignSelf: 'center', marginTop: 'auto' , marginBottom:'auto'}}>
                            <Text style={Fonts.h5}>Task overview</Text>
                        </View>
                    </View>
                    <View style={{width: wp(90), flex:1, alignSelf:'center', marginTop: '-8%'}}>
                        <TaskGrid
                            users={users}
                            tasks={otherStaffTasks}
                            newTasks={otherStaffNewTasks}
                            inProgressTasks={otherStaffInProgressTasks}
                            doneTasks={otherStaffDoneTasks}
                            onPressCard={(staffName, staffTask) => navigation.navigate('StaffTaskListScreen', { staffName: staffName, staffTaskData: staffTask })} />
                        {/* <View style={{marginBottom: otherStaffTasks && otherStaffTasks.length != 0 ? 15 : 40}} /> */}
                        <TaskListMenu
                            otherStaffTasks={otherStaffTasks}
                            users={users}
                            herds={herds}
                            newTasks={tempFilteredNewTasks ? tempFilteredNewTasks : newTasks}
                            inProgressTasks={tempFilteredInProgressTasks ? tempFilteredInProgressTasks : inProgressTasks}
                            doneTasks={tempFilteredDoneTasks ? tempFilteredDoneTasks : doneTasks}
                            statusMode={statusMode}
                            onPressTask={(userData, herdData, taskData) => navigation.navigate('TaskDetailScreen', { userData: userData, herdData: herdData, taskData: taskData })}
                            onPressMode={(mode) => setStatusMode(mode)}
                            onPressFilter={() => setFilterModalShown(true)} />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {
                currUserRights.includes('show_support') && <TaskBottomNav onPressSupport={() => navigation.navigate('CustomerSupportScreen')} />
            }
            {
                filterModalShown &&
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
                    isOpen={filterModalShown}
                    onClosed={() => setFilterModalShown(false)}
                >
                    {
                        <FilterModal
                            selectedRole={selectedRole}
                            selectedScore={selectedScore}
                            onPressScoreCheckbox={(score) => onPressScoreCheckbox(score)}
                            onPressRoleCheckbox={(role) => onPressRoleCheckbox(role)}
                            onPressClose={() => setFilterModalShown(false)}
                            onPressSeeResult={() => {setFilterModalShown(false), filterTask()}}
                            userRoles={userRoles}
                        />
                    }
                </Modal>
            }
        </SafeAreaView>
    )
}

const TaskListMenu = (props) => {
    const { users, herds, newTasks, inProgressTasks, doneTasks, onPressTask, onPressMode, statusMode, onPressFilter, otherStaffTasks } = props
    
    return (
        <View style={{marginTop: otherStaffTasks.length != 0 ? 15 : 50, marginBottom: 12}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
                <Text style={Fonts.h4}>Task List</Text>
                <TouchableOpacity onPress={onPressFilter}>
                    <Filter width={24} height={24} />
                </TouchableOpacity>
            </View>
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
            <View style={{ marginTop: 15 }}>
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

const TaskGrid = (props) => {
    const { users, tasks, newTasks, inProgressTasks, doneTasks, onPressCard } = props
    const whichUser = (uid) => {
        return users.filter(user => user.uid == uid)
    }

    return (
        <View style={{ width: '100%' }}>
            <FlatList
                data={tasks}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() =>
                        onPressCard(whichUser(item.userUid ? item.userUid : '')[0] ? whichUser(item.userUid ? item.userUid : '')[0]?.name : '', item)
                    } style={{ flex: 1, height: 96, marginRight: 8, marginBottom: 8, borderRadius: 8, backgroundColor: Colors.orange, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{marginBottom:5, alignItems: 'center' }}>
                            <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>{ whichUser(item.userUid ? item.userUid : '')[0] ? whichUser(item.userUid ? item.userUid : '')[0]?.name : '-'  }</Text>
                            <Text style={[Fonts.captionMedium, { color: Colors.white }]}>{ whichUser(item.userUid ? item.userUid : '')[0] ? whichUser(item.userUid ? item.userUid : '')[0]?.title : '-'  }</Text>
                        </View>
                        <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>{item.tasks.length} tasks</Text>
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={2}
            />
            {/* <View style={{flexDirection:'row', alignItems:'center', marginBottom:8}}>
                <TouchableOpacity onPress={onPressCard} style={{flex: 1, height: 96, marginRight:8, borderRadius: 8, backgroundColor: Colors.orange, justifyContent:'center', alignItems:'center'}}>
                    <View style={{marginBottom:5, alignItems: 'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>John Doe</Text>
                        <Text style={[Fonts.captionMedium, {color: Colors.white}]}>Manager</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>2 tasks</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flex: 1, height: 96, borderRadius: 8, backgroundColor: Colors.orange, justifyContent:'center', alignItems:'center'}}>
                    <View style={{marginBottom:5, alignItems: 'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>Devon Lane</Text>
                        <Text style={[Fonts.captionMedium, {color: Colors.white}]}>Nutrition Staff</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>5 tasks</Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{flex: 1, height: 96, marginRight:8, borderRadius: 8, backgroundColor: Colors.orange, justifyContent:'center', alignItems:'center'}}>
                    <View style={{marginBottom:5, alignItems: 'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>Jerome Bell</Text>
                        <Text style={[Fonts.captionMedium, {color: Colors.white}]}>Farmer</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>2 tasks</Text>
                    </View>
                </View>
                <View style={{flex: 1, height: 96, borderRadius: 8, backgroundColor: Colors.orange, justifyContent:'center', alignItems:'center'}}>
                    <View style={{marginBottom:5, alignItems: 'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>Robert Fox</Text>
                        <Text style={[Fonts.captionMedium, {color: Colors.white}]}>Farmer</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <Text style={[Fonts.bodyLargeMedium, { color: Colors.white }]}>4 tasks</Text>
                    </View>
                </View>
            </View> */}
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
                    <Text style={[Fonts.captionRegular, { marginLeft: 4 }]}>Assigned to {userData && userData.length != 0 ? userData[0].name : '-'} • {userData && userData.length != 0 ? userData[0].title : '-'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <CowFillBlack width={12} height={12} />
                    {/* <Text style={[Fonts.captionRegular,{marginLeft:4}]}>8040 • Group 1</Text> */}
                    <Text style={[Fonts.captionRegular, { marginLeft: 4 }]}>{herdData && herdData.length != 0 ? herdData[0].id : '-'}</Text>
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
                    <View style={{ paddingHorizontal:12, height: 26, backgroundColor: getDatesDifference(convertDate(taskData.deadline)) < 1 ? Colors.alertRed60 : Colors.alertGreen20, flexDirection: 'row', alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        {getDatesDifference(convertDate(taskData.deadline)) < 1 ? 
                            <AlertRed width={10} height={10} />
                            :
                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.alertGreen }} />    
                        }   
                        <Text style={[Fonts.captionRegular, { color:getDatesDifference(convertDate(taskData.deadline)) < 1 ? Colors.alertRed : Colors.alertGreen, marginTop: 3, marginLeft: 4 }]}>{getDatesDifference(convertDate(taskData.deadline)) < 1 ? 'Overdue' : getDatesDifference(convertDate(taskData.deadline)) > 1 ? getDatesDifference(convertDate(taskData.deadline)) + ' Days left' :  getDatesDifference(convertDate(taskData.deadline)) + ' Day left'}</Text>
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


const FilterModal = (props) => { 
    const {
        onPressClose,
        onPressSeeResult,
        selectedScore, onPressScoreCheckbox,
        selectedRole, onPressRoleCheckbox,
        userRoles
    } = props

    return (
        <View style={{
            width: '100%',
            height: hp(45),
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
                <Text style={Fonts.h6}>Filter by</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                marginBottom:20
                
            }}>
                <Text style={Fonts.h6}>Cow score</Text>
                <TouchableOpacity onPress={() => onPressScoreCheckbox('high')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedScore.includes('high') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>High score</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressScoreCheckbox('low')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedScore.includes('low') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>Low score</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                <Text style={Fonts.h6}>Role</Text>
                {
                    userRoles.map(role => (
                        <TouchableOpacity onPress={() => onPressRoleCheckbox(role) } style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                            <View
                                style={{
                                    marginRight: 8
                            }}>
                                {
                                    selectedRole.includes(role) ?
                                        <CheckBoxFilled width={16} height={16} />
                                            :
                                        <CheckBox width={16} height={16} />
                                }
                            </View>
                            <Text style={Fonts.bodyLarge}>{role}</Text>
                        </TouchableOpacity>
                    ))
                }
                {/* <TouchableOpacity onPress={() => onPressRoleCheckbox('manager') } style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedRole.includes('manager') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>Manager</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressRoleCheckbox('nutritionist')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedRole.includes('nutrition') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>Nutrition Staff</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressRoleCheckbox('farmer')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedRole.includes('farmer') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>Farmer</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ width: '90%', alignSelf:'center', marginBottom: 'auto', marginTop: 'auto'}}>
                <CustomButton1 title="See result" onPress={onPressSeeResult} />
            </View>
        </View>
    )
} 


const TaskBottomNav = (props) => {
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