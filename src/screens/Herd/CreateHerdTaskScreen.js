import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, TextInput, View, ScrollView, SafeAreaView } from 'react-native'
import { nf, wp, hp, sh, sw } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { nanoId } from '../../utils/reusableFunctions'

import Modal from "react-native-modalbox"
import DatePicker from 'react-native-date-picker'
import moment from "moment";

import { CustomButton1 } from '../../components/common/CustomButton';
import { HerdListTile } from './components';
import Dropdown from '../../assets/svg/dropdown.svg'
import Close from '../../assets/svg/close.svg'
import Search from '../../assets/svg/search.svg'
import Delete from '../../assets/svg/delete.svg'

import { useToast } from "react-native-toast-notifications";

import {
    requestGetUsers,
} from '../../store/user/actions';

import {
    requestGetTasks,
    requestCreateNewTask,
    resetSuccessCreateNewTask
} from '../../store/task/actions';

import { FlatList } from 'react-native-gesture-handler';

export default function CreateHerdTaskScreen({ route, navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()
    const { selectedHerdUid } = route.params

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { createNewTaskLoading } = useSelector(state => ({
        createNewTaskLoading: state.taskReducer.createNewTaskLoading,
    }), shallowEqual);

    const { createNewTaskSuccess } = useSelector(state => ({
        createNewTaskSuccess: state.taskReducer.createNewTaskSuccess,
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

    const [tempHerds, setTempHerds] = useState(undefined)


    function onPressCheckbox(uid) {
        if (choosenHerdsUid.includes(uid)) {
            setChoosenHerdsUid(choosenHerdsUid.filter(item => item !== uid))
        } else {
            setChoosenHerdsUid(choosenHerdsUid => [...choosenHerdsUid, uid])
        }
    }

    function findHerdIdbyUid(uid) {
       return herds.find(item => item.uid == uid).localId 
    }

    const searchCows = (searchTerm) => {
        if (searchTerm.length > 0) {
            searchTerm = searchTerm.replace('-', '')

            const regex = new RegExp(searchTerm, 'gi');
            let result =  herds.filter(herd => 
            herd.localId.replace('-', '').match(regex) || herd.camera.match(regex)
            );
            
            setTempHerds(result)
        }
        else {
            setTempHerds(undefined)
        }
    }

    const handleGetUsers = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetUsers(farmUid));
        }
    };

    const handleGetTasks = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetTasks(farmUid));
        }
    };

    useEffect(() => {
        handleGetUsers(currUser.farm)
        if (selectedHerdUid) {
            setChoosenHerdsUid(choosenHerdsUid => [...choosenHerdsUid, selectedHerdUid])
        }
        if (createNewTaskSuccess) {
            toast.show("Successfully create new task", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetTasks(currUser.farm)
            dispatch(resetSuccessCreateNewTask())
            navigation.navigate('Tasks')
        }

    }, [createNewTaskSuccess]);
    
    const handleCreateNewTask = () => {
        if (taskTitle == '') {
            toast.show("Task title cannot be empty!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }

        if (taskDesc == '') {
            toast.show("Task description cannot be empty!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }

        if (choosenUserUid == '') {
            toast.show("You must assign task to task holder", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }

        if (choosenHerdsUid.length == 0) {
            toast.show("Chosen cow cannot be empty", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }

        if (choosenUserUid != '' && choosenHerdsUid.length != 0 && taskTitle != '' && taskDesc != '') {
            
            choosenHerdsUid.map(herdUid => {
                const task = {
                    assignedTo: choosenUserUid,
                    cow: herdUid,
                    deadline: moment(deadline).format('YYYY-MM-DDTHH:mm:ssZ'),
                    title: taskTitle,
                    description: taskDesc,
                    status: 'new',
                };
    
                dispatch(requestCreateNewTask(currUser.farm,task, nanoId(12) ));
                console.log('create new task: ', task)
            })
        }

    };

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <AssignTaskCard
                            initialHerdId={herds[0].localId}
                            choosenName={choosenUserName}
                            choosenHerdsUid={choosenHerdsUid}
                            onPressAssign={() => setAssignTaskModalShown(true)}
                            onPressChoose={() => setChooseHerdModalShown(true)}
                            findHerdIdbyUid={(uid) => findHerdIdbyUid(uid)}
                        />
                        <TaskInformationFormCard
                            deadline={deadline}
                            onPressChooseDeadline={() => setOpenDatePicker(true)}
                            setTaskTitle={(title) => setTaskTitle(title)}
                            setTaskDesc={(desc) => setTaskDesc(desc)}
                        />
                        <View style={{marginBottom:20}} />
                        <CustomButton1 disabled={createNewTaskLoading} loading={createNewTaskLoading} title="Create task" onPress={() => handleCreateNewTask()} />
                    </View>
                    <View style={{height: hp(10), marginBottom:'auto'}} />
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
                            herds={tempHerds ? tempHerds : herds}
                            choosenHerdsUid={choosenHerdsUid}
                            onPressCheckbox={(uid) => onPressCheckbox(uid)}
                            onPressClose={() => {setChooseHerdModalShown(false), setTempHerds(undefined)}}
                            searchCows={(text) => searchCows(text)}
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


const AssignTaskCard = (props) => {
    const { initialHerdId, choosenName, choosenHerdsUid, onPressAssign, onPressChoose, findHerdIdbyUid } = props;

    return (
        <View style={{
            width:'100%', marginTop: 8, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
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
                            <Text style={Fonts.bodySmall}>{choosenHerdsUid.length != 0 ? findHerdIdbyUid(choosenHerdsUid[0]) : 'Choose cow'}</Text>
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
                                    <View style={{paddingHorizontal:10, marginBottom:10, height: 23, backgroundColor: Colors.orange60, borderRadius: 45, flexDirection:'row', alignItems:'center', justifyContent:'center', marginRight:12}}>
                                        <Text style={[Fonts.bodySmall, { color: Colors.orange, fontSize: 12, marginRight: 4, marginTop: 3 }]}>{findHerdIdbyUid(item)}</Text>
                                        <Delete width={11} height={11} />
                                    </View>
                                ))
                            }
                        </View>
                }
            </View>
        </View>
    );
};



const TaskInformationFormCard = (props) => {
    const { setTaskTitle, setTaskDesc, deadline, onPressChooseDeadline} = props;

    return (
        <View style={{
            width:'100%', marginTop: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', paddingVertical:20, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
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
        </View>
    );
}

const ChooseHerdModal = (props) => { 
    const { herds, choosenHerdsUid, onPressCheckbox, onPressClose, searchCows } = props

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
                        onChangeText={text => searchCows(text)}
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
            height: hp(35),
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