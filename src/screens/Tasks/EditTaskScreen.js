import React, { useEffect, useState } from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, FlatList } from 'react-native'
import { nf, wp, hp , sw, sh} from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Modal from "react-native-modalbox"
import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';
import { HerdListTile } from './components';

import Dropdown from '../../assets/svg/dropdown.svg'
import Delete from '../../assets/svg/delete.svg'
import Close from '../../assets/svg/close.svg'
import Search from '../../assets/svg/search.svg'

import DatePicker from 'react-native-date-picker'
import moment from "moment";
import { useToast } from "react-native-toast-notifications";

import {
    requestGetTasks,
    requestEditTaskData,
    resetSuccessEditTaskData
} from '../../store/task/actions';


export default function EditTaskScreen({ route, navigation }) {
    const { taskData, userData, herdData } = route.params;

    const dispatch = useDispatch();
    const toast = useToast()

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
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

    const [assignTaskModalShown, setAssignTaskModalShown] = useState(false)
    const [chooseHerdModalShown, setChooseHerdModalShown] = useState(false)
    const [choosenUserName, setChoosenUserName] = useState('')
    const [choosenUserUid, setChoosenUserUid] = useState('')

    const [choosenHerdsUid, setChoosenHerdsUid] = useState([])

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDesc, setTaskDesc] = useState('')

    const [deadline, setDeadline] = useState(new Date())
    const [openDatePicker, setOpenDatePicker] = useState(false)

    useEffect(() => {
        if (taskData && !editTaskSuccess) {
            // let userData = findUserIdbyUid(taskData.assignedTo)
            let userName = `${userData && userData.length != 0 ? userData.name : ''} • ${userData && userData.length != 0 ? userData.title : ''}`
            setChoosenUserName(userName)
            setChoosenUserUid(taskData.assignedTo)

            if (choosenHerdsUid.includes(taskData.cow) == false) { 
                setChoosenHerdsUid(choosenHerdsUid => [...choosenHerdsUid, taskData.cow])
            }

            setTaskTitle(taskData.title)
            setTaskDesc(taskData.description)
            setDeadline(new Date(taskData.deadline))
        }

        if (editTaskSuccess) {
            toast.show("Successfully edit task data", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetTasks(currUser.farm)
            dispatch(resetSuccessEditTaskData())
            navigation.navigate('Tasks')
        }
        
    }, [editTaskSuccess]);

    function findHerdIdbyUid(uid) {
        let filteredHerds = herds.filter(herd => herd.uid == uid)
        return filteredHerds.length != 0 ? filteredHerds[0].id : ''
    }

    function findUserIdbyUid(uid) {
        return users.find(item => item.uid == uid)
    }

    function onPressCheckbox(uid) {
        if (choosenHerdsUid.includes(uid)) {
            setChoosenHerdsUid(choosenHerdsUid.filter(item => item !== uid))
        } else {
            setChoosenHerdsUid(choosenHerdsUid => [...choosenHerdsUid, uid])
        }
    }

    const handleGetTasks = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetTasks(farmUid));
        }
    };

    const handleEditTask = () => {
        if (choosenUserUid != '' && choosenHerdsUid.length != 0 && taskTitle != '' && taskDesc != '') {
            choosenHerdsUid.map(herdUid => {
                const task = {
                    assignedTo: choosenUserUid,
                    cow: herdUid,
                    deadline: moment(deadline).format('YYYY-MM-DDTHH:mm:ssZ'),
                    title: taskTitle,
                    description: taskDesc,
                    status: taskData.status,
                };
    
                dispatch(requestEditTaskData(taskData.uid,currUser.farm,task));
            })
        }

    };
    
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <AssignTaskCard
                            initialHerdId={herds[0].id}
                            choosenName={choosenUserName}
                            choosenHerdsUid={choosenHerdsUid}
                            onPressAssign={() => setAssignTaskModalShown(true)}
                            onPressChoose={() => setChooseHerdModalShown(true)}
                            unSelectHerd={(uid) => onPressCheckbox(uid)}
                            findHerdIdbyUid={(uid) => findHerdIdbyUid(uid)}
                        />
                        <TaskInformationFormCard
                            taskTitle={taskTitle}
                            taskDesc={taskDesc}
                            setTaskTitle={(title) => setTaskTitle(title)}
                            setTaskDesc={(desc) => setTaskDesc(desc)}

                            deadline={deadline}
                            onPressChooseDeadline={() => setOpenDatePicker(true)}
                        />
                        <CustomButton1 disabled={editTaskLoading} loading={editTaskLoading} title="Save task" onPress={() => handleEditTask()} />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            {
                assignTaskModalShown &&
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
                    isOpen={assignTaskModalShown}
                    onClosed={() => setAssignTaskModalShown(false)}
                >
                    {
                        <AssignTaskModal
                            users={users}
                            onChooseUser={(uid,name) => {setChoosenUserUid(uid), setChoosenUserName(name), setAssignTaskModalShown(false)}}
                            onPressClose={() => setAssignTaskModalShown(false)}
                        />
                    }
                </Modal>
            }
            {
                chooseHerdModalShown &&
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
                    isOpen={chooseHerdModalShown}
                    onClosed={() => setChooseHerdModalShown(false)}
                >
                    {
                        <ChooseHerdModal
                            herds={herds}
                            choosenHerdsUid={choosenHerdsUid}
                            onPressCheckbox={(uid) => onPressCheckbox(uid)}
                            onPressClose={() => setChooseHerdModalShown(false)}
                        />
                    }
                </Modal>
            }
            <DatePicker
                modal
                mode="date"
                open={openDatePicker}
                date={deadline}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    setDeadline(date)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
        </SafeAreaView>
    )
}


const TaskInformationFormCard = (props) => {
    const { taskTitle, taskDesc, setTaskTitle, setTaskDesc, deadline, onPressChooseDeadline} = props;

    return (
        <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8, marginBottom: 20}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.orange, marginRight:8}}>
                    <Text style={[Fonts.captionRegular, { color: Colors.white }]}>2</Text>
                </View>
                <Text style={[Fonts.h4, {lineHeight: 26}]}>Task Information</Text>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Title task</Text>
                <TextInput  
                    autoCapitalize="none"    
                    autoCorrect={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass]}
                    placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => setTaskTitle(text)}
                    value={taskTitle}
                />
            </View>

            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Description</Text>
                <TextInput  
                    autoCapitalize="none"    
                    textAlignVertical='top'
                    autoCorrect={false}
                    style={[Fonts.bodySmall, styles.textInputStyleClass, { height: 323 }]}
                    multiline
                    placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    onChangeText={text => setTaskDesc(text)}
                    value={taskDesc}
                />
            </View>

            <TouchableOpacity onPress={onPressChooseDeadline} style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Deadline</Text>
                <TextInput  
                    autoCapitalize="none"    
                    editable={false}
                    autoCorrect={false}
                    style={[Fonts.bodySmall,styles.textInputStyleClass]}
                    placeholder="Type here" 
                    mode='outlined'
                    placeholderTextColor={Colors.neutral80}
                    // onChangeText={text => setEmail(text)}
                    value={ deadline != '' ? moment(deadline).format('YYYY/MM/DD') : moment().format('YYYY/MM/DD')}
                />
            </TouchableOpacity>
        </View>
    );
}


const AssignTaskCard = (props) => {
    const { initialHerdId,choosenName, choosenHerdsUid, onPressAssign, onPressChoose, findHerdIdbyUid, unSelectHerd } = props;

    return (
        <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8, marginBottom:20}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.orange, marginRight:8}}>
                    <Text style={[Fonts.captionRegular, { color: Colors.white }]}>1</Text>
                </View>
                <Text style={[Fonts.h4, {lineHeight: 26}]}>Assign a task</Text>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Assign to</Text>
                <TouchableOpacity activeOpacity={1} onPress={onPressAssign} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{flex:1}}>
                        <Text style={Fonts.bodySmall}>{choosenName != '' ? choosenName : "Choose here"}</Text>
                    </View>
                    <TouchableOpacity>
                        <Dropdown width={14} height={14} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Choose cow</Text>
                <TouchableOpacity activeOpacity={1} onPress={onPressChoose} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{flex:1}}>
                        <Text style={Fonts.bodySmall}>{choosenHerdsUid.length != 0 ? findHerdIdbyUid(choosenHerdsUid[0]) : initialHerdId}</Text>
                    </View>
                    <TouchableOpacity>
                        <Dropdown width={14} height={14} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            {
                choosenHerdsUid.length != 0 &&
                    <View style={{marginTop:12, flexDirection:'row', alignItems:'center', flexWrap:'wrap'}}>
                        {
                            choosenHerdsUid.map(item => (
                                <TouchableOpacity onPress={()=> unSelectHerd(item)} style={{paddingHorizontal:10, marginBottom:10, height: 23, backgroundColor: Colors.orange60, borderRadius: 45, flexDirection:'row', alignItems:'center', justifyContent:'center', marginRight:12}}>
                                    <Text style={[Fonts.bodySmall, { color: Colors.orange, fontSize: 12, marginRight: 4, marginTop: 3 }]}>{findHerdIdbyUid(item)}</Text>
                                    <Delete width={11} height={11} />
                                </TouchableOpacity>
                            ))
                        }
                    </View>
            }
        </View>
    );
};

const ChooseHerdModal = (props) => { 
    const { herds, choosenHerdsUid, onPressCheckbox, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(80),
            backgroundColor: Colors.white,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            // justifyContent: 'space-between',
            alignItems: 'center',
        }}>

                <View style={{
                    width: '90%',
                    height: 48,
                    marginBottom:4,
                    alignSelf: 'center',
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'space-between'
                }}>
                    <Text style={Fonts.h6}>Choose cow</Text>
                    <TouchableOpacity onPress={onPressClose}>
                        <Close width={18} height={18} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.textInputStyleClass, { width: '90%', marginBottom:16, flexDirection: 'row', alignItems: 'center', paddingHorizontal:10 }]}>
                    <TouchableOpacity>
                        <Search width={16} height={16} />
                    </TouchableOpacity>
                    <TextInput
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,{ flex: 1, top:3, left: 4 }]}
                        placeholder="Search cow" 
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setPassword(text)}
                    />
                </View>
                <View style={{
                    width: '90%',
                    alignSelf: 'center',
                }}>
                    <ScrollView showsVerticalScrollIndicator={true}>
                        {herds.map(item => (<HerdListTile herdData={item} choosenHerdsUid={choosenHerdsUid} onPressCheckbox={(uid) => onPressCheckbox(uid)} />))}
                        <View style={{height:hp(30) ,marginBottom:'auto'}} />
                    </ScrollView>
                </View>
                <ChooseHerdBottomNav onPressAssign={onPressClose} />
        </View>
    )
}


const AssignTaskModal = (props) => { 
    const { users, onChooseUser, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            height: hp(34),
            backgroundColor: Colors.white,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            // justifyContent: 'space-between',
            alignItems: 'center',
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
                    <Text style={Fonts.h6}>Assign to</Text>
                    <TouchableOpacity onPress={onPressClose}>
                        <Close width={18} height={18} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: '90%',
                    alignSelf: 'center',
                    
                }}>
                   <FlatList
                        data={users}
                        renderItem={({item,index}) => (
                            <TouchableOpacity onPress={() => onChooseUser(item.uid, `${item.name} • ${item.title}`)} activeOpacity={0.5} style={{marginBottom:14}}>
                                <Text style={[Fonts.bodyLarge, { color: Colors.neutral }]}>{item.name} • {item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
        </View>
    )
} 


const ChooseHerdBottomNav = (props) => {
    const { onPressAssign } = props;
    
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
                    paddingVertical: 16,
                    // paddingBottom:30,
                    // paddingHorizontal: 20,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <CustomButton1 title="Assign" onPress={onPressAssign} style={{width:'100%'}}  />
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