import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { nf, wp, hp, sw, sh } from '../../utils/utility'
import { CustomButton1, CustomButton2 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1, CustomButtonOutlined2 } from '../../components/common/CustomButtonOutlined';
import { EstrusTable } from '../../components/common/EstrusTable';

import moment from "moment";
import ProgressCircle from 'react-native-progress-circle-rtl'
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modalbox"

//SVG
import Date from '../../assets/svg/date.svg'
import CowFilled from '../../assets/svg/navbar/cow-fill.svg'
import AlertRed from '../../assets/svg/alert-red.svg'
import CaretRight from '../../assets/svg/caret-right.svg'

import ExpandLeft from '../../assets/svg/pagination/expand-left-light.svg'
import ExpandLeftStop from '../../assets/svg/pagination/expand-left-stop-light.svg'
import ExpandRight from '../../assets/svg/pagination/expand-right-light.svg'
import ExpandRightStop from '../../assets/svg/pagination/expand-right-stop-light.svg'

import LinkSimple from '../../assets/svg/link-simple.svg'
import LinkSimpleOrange from '../../assets/svg/link-simple-orange.svg'

import UserFillBlack from '../../assets/svg/user-fill-black.svg'
import CowFillBlack from '../../assets/svg/cow-fill-black.svg'
import DateFillBlack from '../../assets/svg/date-fill-black.svg'
import Close from '../../assets/svg/close.svg'
import SupportIcon from '../../assets/svg/support-icon.svg'

import { convertDate, getDatesDifference } from '../../utils/reusableFunctions'

import { useDispatch, useSelector, shallowEqual } from 'react-redux';


import {
    requestGetHerds,
} from '../../store/herd/actions';

import {
    requestGetTasks,
} from '../../store/task/actions';

import {
    requestGetUsers,
} from '../../store/user/actions';

import {
    changeProgressIndex,
} from '../../store/account_overview/actions';


const PageSize = 7;
const SiblingCount = 3;

export default function EstrusOverviewScreen({ navigation }) {
    const dispatch = useDispatch();
    const flatListRef = useRef(null);
    
    const [tableTimeRange, setTableTimeRange] = useState('')
    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())

    const [dateRangePickerShown, setDateRangePickerShown] = useState(false)

    const [tempHerds, setTempHerds] = useState(undefined)
    const [currUserRights, setCurrUserRights] = useState([])
    
    const { currUser } = useSelector(state => ({
            currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);

    const { noHerdCollection } = useSelector(state => ({
        noHerdCollection: state.herdReducer.noHerdCollection,
    }), shallowEqual);

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil((tempHerds ? tempHerds.length : herds.length) / itemsPerPage);
    // const totalCount = tempHerds ? tempHerds.length : herds.length

    const paginationRange = useMemo(() => {
        const range = [];
    
        if (totalPages <= SiblingCount * 2 + 1) {
          for (let i = 1; i <= totalPages; i++) {
            range.push(i);
          }
        } else {
          let startPage;
          if (currentPage <= SiblingCount + 1) {
            startPage = 1;
          } else if (currentPage > totalPages - SiblingCount) {
            startPage = totalPages - (SiblingCount * 2);
          } else {
            startPage = currentPage - SiblingCount;
          }
    
          for (let i = startPage; i < startPage + (SiblingCount * 2) + 1; i++) {
            range.push(i);
          }
        }
    
        return range;
      }, [currentPage, totalPages]);

    const handleGetHerds = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetHerds(farmUid));
        }
    };

    const { tasks } = useSelector(state => ({
        tasks: state.taskReducer.tasks
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

    const paginateData = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    }
      
    const displayPageNumbers = () => {
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        return pageNumbers
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            // if (currentPage % 5 === 0) {
            //     flatListRef.current.scrollToIndex({
            //         animated: true,
            //         index: currentPage + 4
            //     });
            // }
        }
    }
    
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handlePageButton = (page) => {
        setCurrentPage(page)
        // if (page % 3 === 0) {
        //     console.log('masuk ga')
        //     flatListRef.current.scrollToIndex({
        //         animated: true,
        //         index: page + 4
        //     });
        // }
    }


    function onChangeProgressIdx(idx) {
        dispatch(changeProgressIndex(idx));
    }
    
    useEffect(() => {
        handleGetHerds(currUser.farm ? currUser.farm : '')
        handleGetTasks(currUser.farm ? currUser.farm : '')
        handleGetUsers(currUser.farm ? currUser.farm : '')

        if (noHerdCollection) {
            onChangeProgressIdx(2)
            navigation.replace('AccountOverviewScreen')
        }
    }, [noHerdCollection]);

    useEffect(() => {
        if (users.length != 0) {
            let filteredUserData = users.filter(user => user.uid == currUser.uid)
         
            if (filteredUserData) { 
                setCurrUserRights(filteredUserData[0].rights)
            }
        }
    }, [users]);
    
    const count5per5CowsTotal = (herds) => {
        let cnt = 0

        herds.map(cow => {
            if (Math.round(cow.score * 5) == 5) {
               cnt += 1
            }
        })

        return cnt
    }

    const count4per4CowsTotal = (herds) => {
        let cnt = 0

        herds.map(cow => {
            if (Math.round(cow.score * 5) == 4) {
               cnt += 1
            }
        })

        return cnt
    }

    const count5per5CowsPrcnt = (herds) => {
        let herdsLgth = herds.length
        let cowsScoreTotal = count5per5CowsTotal(herds)

        return (cowsScoreTotal / herdsLgth) * 100
        
    }

    const count4per4CowsPrcnt = (herds) => {
        let herdsLgth = herds.length
        let cowsScoreTotal = count4per4CowsTotal(herds)

        return (cowsScoreTotal / herdsLgth) * 100
    }

    const onDateChange = (date, type) => {
        date = moment(date).toISOString()
        
        if (type === 'END_DATE') {
            setSelectedEndDate(date)
        } else {
            setSelectedStartDate(date)
            setSelectedEndDate(null)
        }
   }
    
    const sortInRange = () => {
        let finalStartDate = selectedStartDate
        let finalEndDate = moment(selectedEndDate).endOf('day').toISOString()

        console.log(finalStartDate)
        console.log(finalEndDate)

        let result = herds.filter(herd => moment(herd.latestActivity).isBetween(finalStartDate, finalEndDate, null, '[]') || moment(herd.latestActivity).isSame(finalStartDate, 'day'))
        setTempHerds(result)
    }

    const sortByTimeRange = (range) => {
        let startDate
    
        switch(range) {
          case '24h':
            startDate = moment().subtract(24, 'hours')
            break;
          case '48h':
            startDate = moment().subtract(48, 'hours')
            break;
          case '1w':
            startDate = moment().subtract(1, 'weeks')
            break;
          default:
            throw new Error('Invalid range')
        }
        
        let result = herds.filter(herd => moment(herd.latestActivity).isAfter(startDate))
        setTempHerds(result)
    }

    const onPressFilteredHerd = (status) => {
        let herdsList = tempHerds ? tempHerds : herds
        let result = []
        
        result =  herdsList.filter((cow) => {
            const assignedToCow = tasks.find((task) => task.cow === cow.uid);
            const taskStatusMatch = status.length === 0 || assignedToCow && status.includes(assignedToCow.status);

            return taskStatusMatch;
        });

        navigation.navigate('FilteredHerdScreen', { taskStatus: status == 'new' ? 'Need to assign' : status == 'in_progress' ? 'Need to be complete' : 'Completed', herdData: result})
    }

    return ( 
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.orange40}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 20 }} />
                <View style={{
                    width: wp(100),
                    height: hp(45),
                    backgroundColor: Colors.orange40,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    paddingBottom: 20,
                    paddingTop:16
                }}>
                    <View style={{width: wp(90), alignSelf:'center', flexDirection:'row',alignItems:'center', justifyContent:'space-between', marginTop:'auto', marginBottom:24}}>
                        <Text style={Fonts.h5}>Estrus overview</Text>
                        <Text style={Fonts.captionRegular}>{ selectedStartDate ? moment(selectedStartDate).format('MMM DD, YYYY') : ''} { (selectedEndDate && ( moment(selectedEndDate).format('MMM DD, YYYY') != moment(selectedStartDate).format('MMM DD, YYYY'))) ? '- ' + moment(selectedEndDate).format('MMM DD, YYYY') : ''}</Text>
                    </View>
                    <View style={{ width: wp(90), alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        {
                            tableTimeRange == '24h' ?
                                <CustomButton1 onPress={() => {setTempHerds(undefined), setTableTimeRange('')}} title="24 hours" style={{ width: 90, height: 30, borderRadius: 4 }} textStyle={[Fonts.captionMedium, { color: Colors.white }]} />
                                :
                                <CustomButtonOutlined1 onPress={() => {sortByTimeRange('24h'),setTableTimeRange('24h')}} title="24 hours" style={{ width: 90, height:30, borderRadius:4, backgroundColor: Colors.orange20 }} textStyle={[Fonts.captionMedium,{ color: Colors.orange }]} />
                        }
                        {
                            tableTimeRange == '48h' ?
                                <CustomButton1 onPress={() => {setTempHerds(undefined), setTableTimeRange('')}} title="48 hours" style={{ width: 90, height: 30, borderRadius: 4 }} textStyle={[Fonts.captionMedium, { color: Colors.white }]} />
                                :
                                <CustomButtonOutlined1 onPress={() => {sortByTimeRange('48h'), setTableTimeRange('48h')}} title="48 hours" style={{ width: 90, height:30, borderRadius:4, backgroundColor: Colors.orange20 }} textStyle={[Fonts.captionMedium,{ color: Colors.orange }]} />
                        }
                        {
                            tableTimeRange == '1w' ?
                                <CustomButton1 onPress={() => {setTempHerds(undefined),setTableTimeRange('')}} title="1 week" style={{ width: 90, height: 30, borderRadius: 4 }} textStyle={[Fonts.captionMedium, { color: Colors.white }]} />
                                :
                                <CustomButtonOutlined1 onPress={() => {sortByTimeRange('1w'),setTableTimeRange('1w')}} title="1 week" style={{ width: 90, height:30, borderRadius:4, backgroundColor: Colors.orange20 }} textStyle={[Fonts.captionMedium,{ color: Colors.orange }]} />
                        }
                        <TouchableOpacity onPress={() => setDateRangePickerShown(true)}>
                            <Date width={32} height={32} />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: wp(90), alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12
                    }}>
                        <View style={{
                                width: wp(44),
                                height: 80,
                                borderRadius: 8,
                                backgroundColor: Colors.orange20,
                                marginRight: 6,
                                shadowColor: Colors.orange  ,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,

                                elevation: 9,
                                padding:10
                        }}>
                            <CowFilled width={18} height={18} /> 
                            <Text style={[Fonts.captionRegular, { marginTop: 5 }]}>All cows</Text>
                            <Text style={[Fonts.h3, { color: Colors.orange }]}>{tempHerds ? tempHerds.length : herds.length}</Text>
                        </View>
                        <View style={{
                                width: wp(44),
                                height: 80,
                                borderRadius: 8,
                                backgroundColor: Colors.orange20,
                                marginLeft: 6,
                                shadowColor: Colors.orange  ,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,

                                elevation: 9,
                                padding:10
                            }}>
                            <AlertRed width={18} height={18} /> 
                            <Text style={[Fonts.captionRegular, { marginTop: 5 }]}>Standing heat</Text>
                            {/* <Text style={[Fonts.h3, { color: Colors.orange }]}>{tempHerds ? tempHerds.length : herds.length}</Text> */}
                            <Text style={[Fonts.h3, { color: Colors.orange }]}>0</Text>
                        </View>
                    </View>
                    <View style={{ width:wp(90), alignSelf:'center', flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                        <View style={{
                                width: wp(44),
                                height: 90,
                                borderRadius: 8,
                                backgroundColor: Colors.orange20,
                                marginRight: 6,
                                shadowColor: Colors.orange  ,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,

                                elevation: 9,
                                padding:10
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ProgressCircle
                                    percent={count4per4CowsPrcnt(tempHerds? tempHerds : herds)}
                                    radius={32}
                                    borderWidth={8}
                                    color={Colors.alertRed}
                                    shadowColor={Colors.alertRed60}
                                    bgColor={Colors.white}
                                >
                                    <Text style={[Fonts.h5,{fontSize: 16, color:Colors.alertRed}]}>4/5</Text>
                                </ProgressCircle>
                                {/* <View style={{ width: 65, height: 65, borderRadius: 65/2, backgroundColor: Colors.alertRed60, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{width: 45, height: 45, borderRadius: 45/2, backgroundColor: Colors.white, alignItems:'center', justifyContent:'center'}}>
                                        <Text style={[Fonts.h5,{fontSize: 16, color:Colors.alertRed}]}>4/5</Text>
                                    </View>
                                </View> */}
                                <View style={{marginLeft:10}}>
                                    <AlertRed width={22} height={22} /> 
                                    <Text style={[Fonts.bodyLargeMedium,{color: Colors.alertRed, marginTop:5}]}>{count4per4CowsTotal(tempHerds? tempHerds : herds)} cows</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{
                                width: wp(44),
                                height: 90,
                                borderRadius: 8,
                                backgroundColor: Colors.orange20,
                                marginLeft: 6,
                                shadowColor: Colors.orange  ,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,

                                elevation: 9,
                                padding:10
                        }}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <ProgressCircle
                                    percent={count5per5CowsPrcnt(tempHerds ? tempHerds : herds)}
                                    radius={32}
                                    borderWidth={8}
                                    color={Colors.alertRed}
                                    shadowColor={Colors.alertRed60}
                                    bgColor={Colors.white}
                                >
                                    <Text style={[Fonts.h5,{fontSize: 16, color:Colors.alertRed}]}>5/5</Text>
                                </ProgressCircle>
                                <View style={{marginLeft:10}}>
                                    <AlertRed width={22} height={22} /> 
                                    <Text style={[Fonts.bodyLargeMedium, { color: Colors.alertRed, marginTop: 5 }]}>{count5per5CowsTotal(tempHerds ? tempHerds : herds)} cows</Text>
                                </View>
                            </View>
                           
                        </View>
                    </View>
                </View>
                <View style={{width: '90%', alignSelf:'center', alignItems:'center', marginBottom:16}}>
                    <View style={{width: wp(90), height:66, backgroundColor: Colors.orange20, borderRadius:8, marginVertical:16, paddingTop:6, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                        <TouchableOpacity
                            onPress={() => onPressFilteredHerd('new')}
                            style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 18, height: 18, backgroundColor: Colors.alertRed60, marginBottom: 6 }} />
                            <Text style={Fonts.captionRegular}>Open</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPressFilteredHerd('in_progress')}
                            style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 18, height: 18, backgroundColor: Colors.alertBlue60, marginBottom: 6 }} />
                            <Text style={Fonts.captionRegular}>Assigned</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPressFilteredHerd('done')}
                            style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 18, height: 18, backgroundColor: Colors.alertGreen60, marginBottom: 6 }} />
                            <Text style={Fonts.captionRegular}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: wp(90), alignSelf: 'center' }}>
                    <EstrusTable
                        data={tempHerds ? paginateData(tempHerds) : paginateData(herds)}
                        onPressHerd={(herd) => navigation.navigate('HerdProfileScreen',{herdData: herd})}
                    />
                </View>
                <TablePagination
                    pageRef={flatListRef}
                    totalPages={paginationRange}
                    currPage={currentPage}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    handleFirst={() => setCurrentPage(1)}
                    handleLast={() => setCurrentPage(totalPages)}
                    onPressPageButton={(page) => handlePageButton(page)}
                />
                <View style={{ marginTop:30, marginBottom: 24, alignSelf:'center'}}>
                    <TouchableOpacity onPress={()=> navigation.navigate('Herd')} style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={[Fonts.button, { color: Colors.orange, marginRight: 15, marginTop:3 }]}>View all</Text>
                        <CaretRight height={12} />
                    </TouchableOpacity>
                </View>
                {/* <View style={{width:wp(90), alignSelf:'center'}}>
                    <CustomButton2
                        title="Copy pdf link"
                        svgIcon={ 
                            <LinkSimple width={20} height={20} />
                        }
                    />
                    <View style={{ marginBottom: 10 }} />
                    <CustomButtonOutlined2
                        title="Copy excel link"
                        svgIcon={ 
                            <LinkSimpleOrange width={20} height={20} />
                        }
                    />
                </View> */}
                <TasksContent users={users} herds={herds} tasks={tasks} onPressTask={(userData, herdData, taskData) => navigation.navigate('TaskDetailScreen', { userData: userData, herdData : herdData, taskData: taskData })} onPressSeeAll={()=> navigation.navigate('Tasks')} />
                <View style={{width:wp(90), alignSelf:'center', marginTop: 4}}>
                    <CustomButtonOutlined1 onPress={()=> navigation.navigate('Tasks')} title="See all tasks" />
                </View>
                <View style={{height: hp(20), marginBottom:'auto'}} />
            </ScrollView>
            {
                currUserRights.includes('show_support') && <EstrusBottomNav onPressSupport={() => navigation.navigate('CustomerSupportScreen')} />
            }
            {
                dateRangePickerShown &&
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
                    isOpen={dateRangePickerShown}
                    onClosed={() => setDateRangePickerShown(false)}
                >
                    <DateRangePickerModal 
                        onPressClose={()=> setDateRangePickerShown(false)}
                        onChangeDate={onDateChange}
                        onChooseDate={()=> {sortInRange(),setDateRangePickerShown(false) }}
                    />
                </Modal>
            }
        </SafeAreaView>
    )
}


const TablePagination = (props) => { 
    const { pageRef, totalPages, currPage, handleNext, handlePrev, handleFirst, handleLast, onPressPageButton } = props
    return (
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 24 }}>
            <View opacity={1}>
                <TouchableOpacity onPress={handleFirst} disabled={totalPages.length == 1} style={{marginRight:12}}>
                    <ExpandLeftStop width={21} height={21} />
                </TouchableOpacity>
            </View>
            <View opacity={1}>
                <TouchableOpacity onPress={handlePrev} disabled={totalPages.length == 1} style={{marginRight:12}}>
                    <ExpandLeft width={21} height={21} />
                </TouchableOpacity>
            </View>
            {
                totalPages.map(item => (
                    <TouchableOpacity onPress={()=> onPressPageButton(item)} key={item} style={{ width: 36, height: 36, borderRadius: 36/2, backgroundColor: item == currPage ? Colors.orange : Colors.white, alignItems:'center', justifyContent:'center'}}>
                        <Text style={[Fonts.bodySmall, { color: item == currPage ? Colors.white : Colors.neutral }]}>{item}</Text>
                    </TouchableOpacity>
                ))
            }
            {/* <FlatList
                ref={pageRef}
                data={totalPages}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={2}
                keyExtractor={(item, index) => item}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={()=> onPressPageButton(item)} key={item} style={{ width: 36, height: 36, borderRadius: 36/2, backgroundColor: item == currPage ? Colors.orange : Colors.white, alignItems:'center', justifyContent:'center'}}>
                        <Text style={[Fonts.bodySmall, { color: item == currPage ? Colors.white : Colors.neutral }]}>{item}</Text>
                    </TouchableOpacity>
                )}
                horizontal
                // scrollEnabled={false}
            /> */}
            <View opacity={1}>
                <TouchableOpacity onPress={handleNext} disabled={totalPages.length == 1} style={{marginLeft:12}}>
                    <ExpandRight width={21} height={21} />
                </TouchableOpacity>
            </View>
            <View opacity={1}>
                <TouchableOpacity onPress={handleLast} disabled={totalPages.length == 1} style={{marginLeft:12}}>
                    <ExpandRightStop width={21} height={21} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const TasksContent = (props) => {
    const { tasks, herds, users, onPressTask , onPressSeeAll} = props;
    return (
        <>
            <View style={{width:wp(90), marginTop:18, marginBottom:16, alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <Text style={Fonts.h5}>Tasks</Text>
                <TouchableOpacity onPress={onPressSeeAll}>
                    <Text style={[Fonts.button,{color: Colors.orange}]}>See all</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
                {
                    tasks.map(task => 
                        <TaskCard users={users} herds={herds} taskData={task} onPressTask={(userData, herdData, taskData) => onPressTask(userData, herdData, taskData)} />
                    )
                }
            </View>
        </>
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
                    <Text style={[Fonts.captionRegular,{marginLeft:4}]}>{herdData && herdData.length != 0 ? herdData[0].id : '-'}</Text>
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
                        <Text style={[Fonts.captionRegular,{color: getDatesDifference(convertDate(taskData.deadline)) < 1 ? Colors.alertRed :  Colors.alertGreen, marginTop:3, marginLeft:4}]}>{getDatesDifference(convertDate(taskData.deadline)) < 1 ? 'Overdue' : getDatesDifference(convertDate(taskData.deadline)) > 1 ? getDatesDifference(convertDate(taskData.deadline)) + ' Days left' :  getDatesDifference(convertDate(taskData.deadline)) + ' Day left'}</Text>
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

const EstrusBottomNav = (props) => {
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

const DateRangePickerModal = (props) => { 
    const {  onChangeDate, onPressClose, onChooseDate } = props

    return (
        <View style={{
            width: '100%',
            height: hp(65),
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
                    <Text style={Fonts.h6}>Choose date</Text>
                    <TouchableOpacity onPress={onPressClose}>
                        <Close width={18} height={18} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: '90%',
                    alignSelf: 'center',
                    
                }}>
                    <CalendarPicker
                        enableSwipe={true}
                        startFromMonday={true}
                        allowRangeSelection={true}
                        // todayBackgroundColor={Colors.white}
                        selectedDayColor={Colors.orange}
                        selectedDayTextColor={Colors.white}
                        onDateChange={onChangeDate}
                    />
                </View>

            <View style={{ width: '90%', alignSelf:'center', marginBottom: 'auto', marginTop: 'auto'}}>
                <CustomButton1 title="Choose Date" onPress={onChooseDate} />
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