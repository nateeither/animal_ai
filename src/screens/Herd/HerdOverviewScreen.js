import React, { useEffect, useState, useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { ScrollView } from 'react-native-gesture-handler'
import { nf, wp, hp, sh, sw } from '../../utils/utility'
import { CustomButton1, CustomButton2 } from '../../components/common/CustomButton'
import { CustomButtonOutlined1, CustomButtonOutlined2 } from '../../components/common/CustomButtonOutlined'
import { EstrusTable } from '../../components/common/EstrusTable'
import Modal from "react-native-modalbox"

import ExpandLeft from '../../assets/svg/pagination/expand-left-light.svg'
import ExpandLeftStop from '../../assets/svg/pagination/expand-left-stop-light.svg'
import ExpandRight from '../../assets/svg/pagination/expand-right-light.svg'
import ExpandRightStop from '../../assets/svg/pagination/expand-right-stop-light.svg'

import Filter from '../../assets/svg/filter.svg'
import Search from '../../assets/svg/search.svg'
import Close from '../../assets/svg/close.svg'
import CheckBox from '../../assets/svg/checkbox.svg'
import CheckBoxFilled from '../../assets/svg/checkbox-filled.svg'
import SupportIcon from '../../assets/svg/support-icon.svg'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import {
    requestGetHerds,
} from '../../store/herd/actions'

import {
    changeProgressIndex,
} from '../../store/account_overview/actions';


const PageSize = 7;
const SiblingCount = 3;

export default function HerdOverviewScreen({ navigation }) {
    const dispatch = useDispatch()
    
    const [filterModalShown, setFilterModalShown] = useState(false)
    const [tempHerds, setTempHerds] = useState(undefined)
    const [tempFilteredHerds, setTempFilteredHerds] = useState(undefined)
    const [selectedScores, setSelectedScores] = useState([])
    const [selectedCams, setSelectedCams] = useState([])
    const [selectedStatus, setSelectedStatus] = useState([])

    const [currUserRights, setCurrUserRights] = useState([])

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const { herds } = useSelector(state => ({
        herds: state.herdReducer.herds,
    }), shallowEqual);

    const { tasks } = useSelector(state => ({
        tasks: state.taskReducer.tasks
    }), shallowEqual);

    const { noHerdCollection } = useSelector(state => ({
        noHerdCollection: state.herdReducer.noHerdCollection,
    }), shallowEqual);

    const { farmData } = useSelector(state => ({
        farmData: state.userReducer.farmData,
    }), shallowEqual);

    const { users } = useSelector(state => ({
        users: state.userReducer.users
    }), shallowEqual);


    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil((tempFilteredHerds ? tempFilteredHerds.length : tempHerds ? tempHerds.length : herds.length) / itemsPerPage);

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

    const searchCows = (searchTerm) => {
        if (searchTerm.length > 0) {
            // searchTerm = searchTerm.replace('-', '')

            const regex = new RegExp(searchTerm, 'gi');
            let result =  herds.filter(herd => 
                regex.test(herd.id)
            );

            setTempHerds(result)
        }
        else {
            setTempHerds(undefined)
            setTempFilteredHerds(undefined)
        }
    }

    function checkIsNum(num) {
        if ((typeof num === 'number') && (num % 1 === 0)) return true;
        if ((typeof num === 'number') && (num % 1 !== 0)) return true;
        if (typeof num === 'number') return true;
    }

    const filterCows = () => {
        let herdsList = tempHerds ? tempHerds : herds
        let result = []
        
        result =  herdsList.filter((cow) => {
            const scoreMatch = selectedScores.length === 0 || selectedScores.includes( checkIsNum(cow.score) ? Math.round(cow.score * 5) : 0);
            const cameraMatch = selectedCams.length === 0 || selectedCams.some((range) => {
                const [min, max] = range.split('-');
                return parseInt(cow.camera) >= parseInt(min) && parseInt(cow.camera) <= parseInt(max);
            });
            const assignedToCow = tasks.find((task) => task.cow === cow.uid);
            const taskStatusMatch = selectedStatus.length === 0 || assignedToCow && selectedStatus.includes(assignedToCow.status);

            return scoreMatch && cameraMatch && taskStatusMatch;
        });
        // console.log('the res: ', result)
        setTempFilteredHerds(result)
    }

    const onPressScoreCheckbox = (score) => {
        if (selectedScores.includes(score)) {
            setSelectedScores(selectedScores.filter(item => item !== score))
        } else {
            setSelectedScores(selectedScores => [...selectedScores, score])
        }
    }

    const onPressCamCheckbox = (cam) => {
        if (selectedCams.includes(cam)) {
            setSelectedCams(selectedCams.filter(item => item !== cam))
        } else {
            setSelectedCams(selectedCams => [...selectedCams, cam])
            // setSelectedCams(cam)
        }
    }

    const onPressStatusCheckbox = (status) => {
        if (selectedStatus.includes(status)) {
            setSelectedStatus(selectedStatus.filter(item => item !== status))
        } else {
            setSelectedStatus(selectedStatus => [...selectedStatus, status])
        }
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
        }
    }
    
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    
    function onChangeProgressIdx(idx) {
        dispatch(changeProgressIndex(idx));
    }

    useEffect(() => {
        handleGetHerds(currUser.farm)
        if (noHerdCollection) {
            onChangeProgressIdx(2)
            navigation.replace('AccountOverviewScreen')
        }
    }, [noHerdCollection]);

    useEffect(() => {
        let filteredUserData = users.filter(user => user.uid == currUser.uid)
        setCurrUserRights(filteredUserData[0].rights)
    },[])

    return (
        <SafeAreaView style={{flex:1, backgroundColor: Colors.orange40}}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.orange40}
            />
            <View style={{ marginTop: 20 }} />
            <View style={{
                width: wp(100),
                height: hp(20),
                backgroundColor: Colors.orange40,
                paddingBottom: 20,
                paddingTop:16
            }}>
                <View style={{width: wp(90), alignSelf:'center', marginTop:'auto', marginBottom:19}}>
                    <Text style={Fonts.h5}>Herd: <Text style={{ color: Colors.orange }}>{ tempFilteredHerds ? tempFilteredHerds.length : tempHerds ? tempHerds.length : herds.length} cows</Text></Text>
                </View>
                <View style={{width: wp(90), alignSelf:'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={[styles.textInputStyleClass, { width: wp(80), flexDirection: 'row', alignItems: 'center', paddingHorizontal:10 }]}>
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
                    <TouchableOpacity onPress={() => setFilterModalShown(true)}>
                        <Filter width={24} height={24} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
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
                    <View style={{width: wp(90), alignSelf:'center'}}>
                        <EstrusTable
                            data={tempFilteredHerds ? paginateData(tempFilteredHerds) : tempHerds ? paginateData(tempHerds) : paginateData(herds)}
                            onPressHerd={(herd) => navigation.navigate('HerdProfileScreen',{herdData: herd})}
                        />
                    </View>
                    <TablePagination
                        totalPages={paginationRange}
                        currPage={currentPage}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        handleFirst={() => setCurrentPage(1)}
                        handleLast={() => setCurrentPage(totalPages)}
                        onPressPageButton={(page) => setCurrentPage(page)}
                    />
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            <HerdBottomNav currUserRights={currUserRights} onPressAdd={() => navigation.navigate('UploadHerdScreen')} onPressSupport={() => navigation.navigate('CustomerSupportScreen')} />
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
                            onPressClose={() => setFilterModalShown(false)}
                            onPressSeeResult={() => {setFilterModalShown(false), filterCows()}}
                            selectedScores={selectedScores}
                            onPressScoreCheckbox={(score) => onPressScoreCheckbox(score)}
                            selectedCams={selectedCams}
                            onPressCamCheckbox={(cam) => onPressCamCheckbox(cam)}
                            selectedStatus={selectedStatus}
                            onPressStatusCheckbox={(status) => onPressStatusCheckbox(status)}
                        />
                    }
                </Modal>
            }
        </SafeAreaView>
    )
}

const TablePagination = (props) => { 
    const { totalPages, currPage, handleNext, handlePrev, handleFirst, handleLast, onPressPageButton } = props
    
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


const HerdBottomNav = (props) => {
    const { onPressAdd, onPressSupport, currUserRights } = props;
    
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
                    {
                        currUserRights.includes('add_herd') ?
                        <CustomButton1 title="Add herd" onPress={onPressAdd} style={{ width: '75%' }} />
                        :
                        <View style={{ width: 10}} />
                    }
                    {
                        currUserRights.includes('show_support') &&
                        <TouchableOpacity onPress={onPressSupport}>
                            <SupportIcon width={60} height={67} />
                        </TouchableOpacity>
                    }
                </View >
            </View>
        </View>
    )
}

const FilterModal = (props) => { 
    const {
        onPressClose, onPressSeeResult,
        selectedScores, onPressScoreCheckbox,
        selectedCams, onPressCamCheckbox,
        selectedStatus, onPressStatusCheckbox
    } = props

    return (
        <View style={{
            width: '100%',
            height: hp(65),
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
                <Text style={Fonts.h6}>Alert</Text>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <TouchableOpacity onPress={()=> onPressScoreCheckbox(5)} style={{ flexDirection: 'row', alignItems: 'center', marginRight:24}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedScores.includes(5) ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>5/5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPressScoreCheckbox(2)}  style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedScores.includes(2) ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>2/5</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <TouchableOpacity onPress={()=> onPressScoreCheckbox(4)}  style={{ flexDirection: 'row', alignItems: 'center', marginRight:24}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedScores.includes(4) ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>4/5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPressScoreCheckbox(1)}  style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedScores.includes(1) ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>1/5</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <TouchableOpacity onPress={()=> onPressScoreCheckbox(3)}  style={{ flexDirection: 'row', alignItems: 'center', marginRight:24}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedScores.includes(3) ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>3/5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPressScoreCheckbox(0)}  style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedScores.includes(0) ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>0/5</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                marginBottom:20
                
            }}>
                <Text style={Fonts.h6}>Cam</Text>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <TouchableOpacity onPress={()=> onPressCamCheckbox('1-5')} style={{ flexDirection: 'row', alignItems: 'center', marginRight:24}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedCams.includes('1-5') ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>1-5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPressCamCheckbox('16-20')} style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedCams.includes('16-20') ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>16-20</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <TouchableOpacity onPress={()=> onPressCamCheckbox('6-10')} style={{ flexDirection: 'row', alignItems: 'center', marginRight:24}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedCams.includes('6-10') ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>6-10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPressCamCheckbox('21-25')} style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedCams.includes('21-25') ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>21-25</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <TouchableOpacity onPress={()=> onPressCamCheckbox('11-15')} style={{ flexDirection: 'row', alignItems: 'center', marginRight:24}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedCams.includes('11-15') ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>11-15</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> onPressCamCheckbox('26-30')} style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedCams.includes('26-30') ?
                                    <CheckBoxFilled width={16} height={16} />
                                        :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>26-30</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                marginBottom:20
                
            }}>
                <Text style={Fonts.h6}>Task status</Text>
                <TouchableOpacity onPress={()=> onPressStatusCheckbox('new')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedStatus.includes('new') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> onPressStatusCheckbox('in_progress')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedStatus.includes('in_progress') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>In progress</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> onPressStatusCheckbox('done')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                    <View
                        style={{
                            marginRight: 8
                    }}>
                        {
                            selectedStatus.includes('done') ?
                                <CheckBoxFilled width={16} height={16} />
                                    :
                                <CheckBox width={16} height={16} />
                        }
                    </View>
                    <Text style={Fonts.bodyLarge}>Done</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '90%', alignSelf:'center', marginBottom: 'auto', marginTop: 'auto'}}>
                <CustomButton1 title="See result" onPress={onPressSeeResult} />
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