import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar , Switch, ImageBackground} from 'react-native'
import { nf, wp, hp, sw, sh } from '../../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from '../index'

import { CustomButton1 } from '../../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../../components/common/CustomButtonOutlined';
import { CustomTable } from '../../../components/common/CustomTable';

// import Auth, { AuthEventEmitter, AuthEvents } from 'react-native-firebaseui-auth';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from "react-native-modalbox"

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import DocumentPicker from 'react-native-document-picker'
import { readFile, DownloadDirectoryPath } from 'react-native-fs'
// import XLSX from 'xlsx'
import Papa from 'papaparse';


import {
    changeProgressIndex,
  } from '../../../store/account_overview/actions';

import LinearGradient from 'react-native-linear-gradient';

// SVG
import ExclamationMark from '../../../assets/svg/exclamation-mark.svg'
import File from '../../../assets/svg/file-with-circle.svg'
import Back from '../../../assets/svg/arrow-left.svg'
import Close from '../../../assets/svg/close.svg'
import CloseOrange from '../../../assets/svg/close-orange.svg'
import Search from '../../../assets/svg/search.svg'
import Filter from '../../../assets/svg/filter.svg'

import ScanVideo from '../../../assets/svg/scan-video.svg'
import PlayButton from '../../../assets/svg/video-fill.svg'

import ExpandLeft from '../../../assets/svg/pagination/expand-left-light.svg'
import ExpandLeftStop from '../../../assets/svg/pagination/expand-left-stop-light.svg'
import ExpandRight from '../../../assets/svg/pagination/expand-right-light.svg'
import ExpandRightStop from '../../../assets/svg/pagination/expand-right-stop-light.svg'

import CheckBox from '../../../assets/svg/checkbox.svg'
import CheckBoxFilled from '../../../assets/svg/checkbox-filled.svg'

import Dropdown from '../../../assets/svg/dropdown.svg'
import WarningOct from '../../../assets/svg/warning-octagon.svg'

import { useToast } from "react-native-toast-notifications";

import {
    requestGetHerds,
    requestAddNewHerd,
    resetSuccessAddNewHerd
} from '../../../store/herd/actions';

import { nanoId } from '../../../utils/reusableFunctions'

const PageSize = 7;
const SiblingCount = 3;

export default function UploadHerdInfo({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const [uploadHerd, setUploadHerd] = useState(false)
    const [uploadHerdModalShown, setUploadHerdModalShown] = useState(false)
    const [uploadHerdVideoModalShown, setUploadHerdVideoModalShown] = useState(false)
    const [filterHerdModalShown, setFilterHerdModalShown] = useState(false)
    const [uploadHerdStep, setUploadHerdStep] = useState(1)
    const [uploadHerdVideoStep, setUploadHerdVideoStep] = useState(1)
    const [fileUploaded, setFileUploaded] = useState(false)
    const [uploadHerdVideoMode, setUploadHerdVideoMode] = useState(false)
    const [tableMode, setTableMode] = useState(false)

    const [selectedFilter, setSelectedFilter] = useState('connected')

    const [herdProfileMode, setHerdProfileMode] = useState(false)
    const [editHerdProfileMode, setEditHerdProfileMode] = useState(false)

    const [deleteCowModalShown, setDeleteCowModalShown] = useState(false)
    const [repStatusModalShown, setRepStatusModalShown] = useState(false)
    const [chooseCSVFieldModalShown, setChooseCSVFieldModalShown] = useState(false)

    const [userSelectedField, setUserSelectedField] = useState({
        id: "",
        group: "",
        calvingDate: "",
        reproductionStatus: "",
        averageMilk: "",
    })

    const [csvFieldMode, setCsvFieldMode] = useState('cow_id')

    const [csvData, setCsvData] = useState([])

    const [fileResponse, setFileResponse] = useState([]);

    const { addNewHerdLoading } = useSelector(state => ({
        addNewHerdLoading: state.herdReducer.addNewHerdLoading,
    }), shallowEqual);

    const { addNewHerdSuccess } = useSelector(state => ({
        addNewHerdSuccess: state.herdReducer.addNewHerdSuccess,
    }), shallowEqual)

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil(csvData.length / itemsPerPage);

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

    const handleAddNewHerd = (csv) => {
        let tempCsvData = []

        csv.map(herd => {
            const uid = nanoId(12)

            let data = {
                uid: uid,
                id: userSelectedField.id ? herd[userSelectedField.id].split("-")[2] : '',
                localId: userSelectedField.id ? herd[userSelectedField.id] : '',
                calvingDate: userSelectedField.calvingDate ? herd[userSelectedField.calvingDate] : '',
                group: userSelectedField.group ? herd[userSelectedField.group] : '',
                averageMilk: userSelectedField.averageMilk ? herd[userSelectedField.averageMilk] : '',
                reproductionStatus: userSelectedField.reproductionStatus? herd[userSelectedField.reproductionStatus]: '',
            }

            tempCsvData.push(data)
        })


        dispatch(requestAddNewHerd(currUser.farm, tempCsvData));

        // csvData.map(herd => {
        //     dispatch(requestAddNewHerd(currUser.farm,herd, nanoId(12)));
        // })
    };

    const handleGetHerds = (farmUid) => {

        if (farmUid) {
            dispatch(requestGetHerds(farmUid));
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
        }
    }
    
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    useEffect(() => {
        if (addNewHerdSuccess) {
            toast.show("Successfully add herds", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            setTableMode(true)
            handleGetHerds(currUser.farm)
            dispatch(resetSuccessAddNewHerd())
            // navigation.navigate('Herd')
        }

    }, [addNewHerdSuccess]);    

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                // type: DocumentPicker.types.csv
            });
            console.log('file : ', response)

            readFile(response[0].uri, 'ascii')
                .then(res => {
                    let temp = []
                    Papa.parse(res, {
                        delimiter: ',',
                        header: true,
                        complete: (result) => {
                            temp = result.data
                        }
                    })
                    setCsvData(temp)
                })
                .catch (e => {
                    console.log('Error read file', e)
                })

            setFileResponse(response);
            setFileUploaded(true)
        } catch (err) {
            console.warn(err);
        }
    }, []);

    function onSave() {
        handleAddNewHerd(csvData)
    }

    function onPressNextModal() {
        if (uploadHerdStep != 3) { setUploadHerdStep(uploadHerdStep + 1) }
        if (uploadHerdStep == 3) {setUploadHerdStep(1), setUploadHerdModalShown(false), setUploadHerd(true) }
    }

    function onPressPrevModal() {
        if (uploadHerdStep != 1) { setUploadHerdStep(uploadHerdStep - 1) }
    }

    function onPressNextUploadVideoModal() {
        if (uploadHerdVideoStep != 3) { setUploadHerdVideoStep(uploadHerdVideoStep + 1) }
        if (uploadHerdVideoStep == 3) { setUploadHerdVideoStep(1), setUploadHerdVideoModalShown(false), setUploadHerdVideoMode(true), setTableMode(false), setUploadHerd(false)}
    }

    function onPressPrevUploadVideoModal() {
        if (uploadHerdVideoStep != 1) { setUploadHerdVideoStep(uploadHerdVideoStep - 1) }
    }

    // function onChangeProgressIdx (idx) {
    //     dispatch({
    //         type: types.CHANGE_PROGRESS_BAR_INDEX,
    //         payload: idx
    //     })
    // }

    function onChangeProgressIdx(idx) {
        dispatch(changeProgressIndex(idx));
    }

    function onSelectCSVField(field) {
        switch (csvFieldMode) {
            case 'cow_id':
                setUserSelectedField((prevState) => ({
                    ...prevState,
                    id: field
                }));
                break;
            case 'group_number':
                setUserSelectedField((prevState) => ({
                    ...prevState,
                    group: field
                }));
                break;
            case 'last_calving_date':
                setUserSelectedField((prevState) => ({
                    ...prevState,
                    calvingDate: field
                }));
                break;
            case 'repro_stat':
                setUserSelectedField((prevState) => ({
                    ...prevState,
                    reproductionStatus: field
                }));
                break;
            case 'avg_milk':
                setUserSelectedField((prevState) => ({
                    ...prevState,
                    averageMilk: field
                }));
                break;
                
        }
    }

   

    return (
        <>
            {
                ((uploadHerd ) && !tableMode && !herdProfileMode) && 
                <TouchableOpacity
                    onPress={()=> {setUploadHerd(false),setUploadHerdVideoMode(false), setTableMode(false)}}
                    style={{ width: '90%', height: 48, backgroundColor: Colors.white, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{alignSelf:'center',marginRight:14}}>
                        <Back width={16} height={16} />
                    </View>
                        <Text style={[Fonts.bodyLarge, { color: Colors.orange, textAlign: 'center' }]}>{ "Upload herd information" }</Text>
                </TouchableOpacity>
            }

            {
                ((uploadHerdVideoMode) && !tableMode && !herdProfileMode) && 
                <TouchableOpacity
                    onPress={()=> {setUploadHerd(false), setUploadHerdVideoMode(false), setTableMode(false)}}
                    style={{ width: '90%', height: 48, backgroundColor: Colors.white, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{alignSelf:'center',marginRight:14}}>
                        <Back width={16} height={16} />
                    </View>
                        <Text style={[Fonts.bodyLarge, { color: Colors.orange, textAlign: 'center' }]}>{"Upload video"}</Text>
                </TouchableOpacity>
            }

            {
                ( (herdProfileMode) && (!uploadHerd || !uploadHerdVideoMode || !tableMode)) && 
                <TouchableOpacity
                    onPress={()=> {setHerdProfileMode(false), setTableMode(true)}}
                    style={{ width: '90%', height: 48, backgroundColor: Colors.white, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{alignSelf:'center',marginRight:14}}>
                        <Back width={16} height={16} />
                    </View>
                        <Text style={[Fonts.bodyLarge, { color: Colors.orange, textAlign: 'center' }]}>Profile</Text>
                </TouchableOpacity>
            }

            {
                ( (editHerdProfileMode) && (!uploadHerd || !uploadHerdVideoMode || !tableMode)) && 
                <TouchableOpacity
                    onPress={()=> {setHerdProfileMode(true), setEditHerdProfileMode(false)}}
                    style={{ width: '90%', height: 48, backgroundColor: Colors.white, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{alignSelf:'center',marginRight:14}}>
                        <Back width={16} height={16} />
                    </View>
                        <Text style={[Fonts.bodyLarge, { color: Colors.orange, textAlign: 'center' }]}>Edit cow information</Text>
                </TouchableOpacity>
            }
           
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {
                        editHerdProfileMode ? 
                            <EditHerdProfileContent onPressSave={()=> {setHerdProfileMode(true), setEditHerdProfileMode(false)}} onPressRepStatus={ () => setRepStatusModalShown(true)} />
                            :
                            <>
                            {
                                herdProfileMode ?
                                    <HerdProfileContent />
                                    :
                                    <>
                                        {
                                            uploadHerdVideoMode ?
                                                <UploadHerdVideoContent onPressSave={() => {setUploadHerdVideoMode(false), setTableMode(true)}} />
                                                :
                                                <>
                                                    {
                                                        tableMode ?
                                                                <TableModeContent
                                                                    tableData={csvData}
                                                                    onPressFilter={() => setFilterHerdModalShown(true)}
                                                                    onPressConnectHerd={() => setUploadHerdVideoModalShown(true)}

                                                                    paginationRange={paginationRange}
                                                                    currentPage={currentPage}
                                                                    totalPages={totalPages}
                                                                    handleNext={handleNext}
                                                                    handlePrev={handlePrev}
                                                                    setCurrentPage={setCurrentPage}
                                                                />
                                                            :
                                                            <>
                                                                {
                                                                    uploadHerd ?
                                                                        <UploadHerdContent onPressSelectField={(fieldMode) => {setCsvFieldMode(fieldMode),setChooseCSVFieldModalShown(true)}} userSelectedField={userSelectedField} loading={addNewHerdLoading} file={fileResponse} fileUploaded={fileUploaded} onPressBrowse={() =>  handleDocumentSelection()} onPressDelete={() => {setFileResponse([]),setFileUploaded(false)}} onPressSave={() => onSave()} />
                                                                        :
                                                                        <NoHerdsContent onPressAdd={() => setUploadHerdModalShown(true)} onPressBack={() => onChangeProgressIdx(1)} onPressAddLater={() => onChangeProgressIdx(3)} />
                                                                }
                                                            </>
                                                    } 
                                                </>
                                        }
                                    </>
                            }
                            </>
                    }
                    {/* <View style={{marginVertical:30}} /> */}
                </View>
            </ScrollView>
            {tableMode && <HerdBottomNav onPressAddHerd={() => {setFileResponse([]),setFileUploaded(false), setUploadHerd(true), setTableMode(false)}}  onPressNext={() => onChangeProgressIdx(3)} onPressBack={() => onChangeProgressIdx(1)} />}
            {herdProfileMode && <HerdProfileBottomNav onPressEdit={() => {setEditHerdProfileMode(true), setHerdProfileMode(false), setUploadHerd(false)}} onPressDelete={() => setDeleteCowModalShown(true)} />}
            {
                uploadHerdModalShown &&
                <Modal
                    entry="center"
                    position={"center"}
                    backdropPressToClose={true}
                    swipeToClose={false}
                    coverScreen={true}
                    style={{
                        overflow: "hidden",
                        justifyContent: 'center',
                        alignItems:'center',
                        height: sh,
                        width: sw,
                        backgroundColor: "transparent"
                    }}
                    isOpen={uploadHerdModalShown}
                    onClosed={() => setUploadHerdModalShown(false)}
                >
                    {
                        <UploadHerdModal 
                            uploadHerdStep={uploadHerdStep}
                            onPressClose={() => {setUploadHerdStep(1), setUploadHerdModalShown(false)}}
                            onPressNext={() => onPressNextModal()}
                            onPressPrev={() => onPressPrevModal()}
                        />
                    }
                </Modal>
            }
            {
                deleteCowModalShown &&
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
                    isOpen={deleteCowModalShown}
                    onClosed={() => setDeleteCowModalShown(false)}
                >
                    {
                        <DeleteCowModal 
                           onPressCancel={()=> setDeleteCowModalShown(false)}
                            onPressDelete={() => {setDeleteCowModalShown(false),setHerdProfileMode(false), setTableMode(true)}}
                        />
                    }
                </Modal>
            }
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
                            onPressStatus={() => setRepStatusModalShown(false)}
                        />
                    }
                </Modal>
            }
            {
                filterHerdModalShown &&
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
                    isOpen={filterHerdModalShown}
                    onClosed={() => setFilterHerdModalShown(false)}
                >
                    {
                       <FilterHerdModal
                            selectedFilterMode={selectedFilter}
                            onPressCheckBox={(filter) => setSelectedFilter(filter)}
                            onPressClose={() => setFilterHerdModalShown(false)}
                            onPressSeeResult={() => setFilterHerdModalShown(false)}
                        />
                    }
                </Modal>
            }
            {
                uploadHerdVideoModalShown &&
                <Modal
                    entry="center"
                    position={"center"}
                    backdropPressToClose={true}
                    swipeToClose={false}
                    coverScreen={true}
                    style={{
                        overflow: "hidden",
                        justifyContent: 'center',
                        alignItems:'center',
                        height: sh,
                        width: sw,
                        backgroundColor: "transparent"
                    }}
                    isOpen={uploadHerdVideoModalShown}
                    onClosed={() => setUploadHerdVideoModalShown(false)}
                >
                    {
                        <HowToUploadVideoModal 
                            uploadHerdVideoStep={uploadHerdVideoStep}
                            onPressClose={() => {setUploadHerdVideoStep(1), setUploadHerdVideoModalShown(false)}}
                            onPressNext={() => onPressNextUploadVideoModal()}
                            onPressPrev={() => onPressPrevUploadVideoModal()}
                        />
                    }
                </Modal>
            }
            {
                chooseCSVFieldModalShown &&
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
                    isOpen={chooseCSVFieldModalShown}
                    onClosed={() => setChooseCSVFieldModalShown(false)}
                >
                    {
                        <ChooseCSVFieldModal 
                            csvData={csvData}
                            onChooseField={(field) => {onSelectCSVField(field),setChooseCSVFieldModalShown(false)}}
                            onPressClose={() => setChooseCSVFieldModalShown(false)}
                        />
                    }
                </Modal>
            }
        </>
    )
}

const EditHerdProfileContent = (props) => {
    const { onPressSave, onPressRepStatus } = props
    return (
        <>
            <View style={{marginBottom: 20, marginTop: 12, alignItems:'center', justifyContent:'center'}}>
                <Image style={{ borderRadius: 3, height: 98, width: 98, alignSelf: 'center', marginBottom:10 }} source={Images.cowImage} />
                <Text style={[Fonts.button,{color: Colors.orange}]}>Edit thumbnail</Text>
            </View>
            <EditHerdProfileFormCard onPressRepStatus={onPressRepStatus} />
            <CustomButton1 onPress={onPressSave} title="Save" />
            <View style={{height: hp(20), marginBottom:'auto'}} />
        </>
    )
}

const EditHerdProfileFormCard = (props) => {
    const { onPressRepStatus } = props
    
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
                        value={"8082"}
                    />
                </View>
                <View style={{ flex:2,marginLeft:12}}>
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
                </View>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Date of birth</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={"2020/02/15"}
                    />
                </View>
            </View>
            <View style={{marginTop:12}}>
                <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Reproduction status</Text>
                <TouchableOpacity onPress={onPressRepStatus} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{flex:1}}>
                        <Text style={Fonts.bodySmall}>Insemination</Text>
                    </View>
                    <TouchableOpacity>
                        <Dropdown width={14} height={14} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>7-days average milk reproduction</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={"32,96"}
                    />
                </View>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Lactation days</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={"151"}
                    />
                </View>
            </View>
            <View style={{ marginTop:12}}>
                <View style={{ flex:1}}>
                    <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Days since last insemination</Text>
                    <TextInput  
                        autoCapitalize="none"    
                        autoCorrect={false}
                        style={[Fonts.bodySmall,styles.textInputStyleClass]}
                        // placeholder="Type here" 
                        mode='outlined'
                        placeholderTextColor={Colors.neutral80}
                        // onChangeText={text => setEmail(text)}
                        value={"8"}
                    />
                </View>
            </View>
        </View>
    )
}

const HerdProfileContent = (props) => {
    const { onPressEdit, onPressDelete } = props
    return (
        <>
            <Image style={{ borderRadius: 6, height: 224, width: 224, alignSelf: 'center', marginBottom: 20, marginTop: 12 }} source={Images.cowImage} />
            <HerdBasicInfoCard />
            <HerdReproductionCard />
            <View style={{height: hp(30), marginBottom:'auto'}} />
        </>
    )
}

const HerdReproductionCard = (props) => {
    return (
        <View style={{width:'100%', alignSelf:'center', alignItems:'center', justifyContent:'center', height:256, backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16}}>
            <Text style={[Fonts.h4,{alignSelf:'flex-start', marginBottom:12}]}>Reproduction</Text>
            <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
                <View style={{flex:2, height:84, paddingVertical:10 , marginRight:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Reproduction status</Text>
                    <Text style={[Fonts.h6]}>Insemination</Text>
                </View>
                <View style={{ flex:2, height:84, paddingVertical: 10, marginLeft:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>7-days average milk reproduction</Text>
                    <Text style={[Fonts.h6]}>32,96</Text>
                </View>
            </View>
            <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={{flex:2, height:84, paddingVertical:10 , marginRight:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Lactation days</Text>
                    <Text style={[Fonts.h6]}>151</Text>
                </View>
                <View style={{ flex:2, height:84, paddingVertical: 10, marginLeft:5, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Days since last insemination</Text>
                    <Text style={[Fonts.h6]}>8</Text>
                </View>
            </View>
        </View>
    )
}

const HerdBasicInfoCard = (props) => {
    return (
        <View style={{width:'100%', alignSelf:'center', alignItems:'center', justifyContent:'center', marginBottom:20, height:147, backgroundColor: Colors.orange40, borderRadius: 8, paddingHorizontal: 16}}>
            <Text style={[Fonts.h4,{alignSelf:'flex-start', marginBottom:12}]}>Basic information</Text>
            <View style={{ width:'100%', alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={{flex:2, paddingVertical:10 , alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Cow ID</Text>
                    <Text style={[Fonts.h6]}>8082</Text>
                </View>
                <View style={{ flex:2, paddingVertical: 10, marginHorizontal:10, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Group</Text>
                    <Text style={[Fonts.h6]}>3</Text>
                </View>
                <View style={{flex:2.5, paddingVertical:10, alignItems:'center', justifyContent:'center', borderRadius: 4, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.orange60}}>
                    <Text style={[Fonts.captionRegular, { marginBottom: 4 }]}>Birth date</Text>
                    <Text style={[Fonts.h6]}>2019/07/30</Text>
                </View>
            </View>
        </View>
    )
}

const UploadHerdVideoContent = (props) => {
    const { onPressOpenGallery, onPressTakeCamera, onPressSave } = props
    return (
        <View style={{flex:1}}>
            <View style={{ width: '100%', height: 234, borderRadius: 8, marginBottom: 16, backgroundColor: Colors.orange40, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width:'70%', alignSelf:'center', alignItems:'center'}}>
                    <Text style={[Fonts.h3, { textAlign: 'center', marginBottom: 24 }]}>Upload your existing cow video</Text>
                    <CustomButton1 onPress={onPressOpenGallery} title="Upload video" style={{ width: wp(40)}} />
                </View>
            </View>
            <View style={{ width: '100%', height: 234, borderRadius: 8, marginBottom: 16, backgroundColor: Colors.orange40, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width:'70%', alignSelf:'center', alignItems:'center'}}>
                    <Text style={[Fonts.h3, { textAlign: 'center', marginBottom: 24 }]}>Take a video</Text>
                    <CustomButton1 onPress={onPressTakeCamera} title="Take video now" style={{ width: wp(40)}} />
                </View>
            </View>
            <View style={{marginTop:'10%'}}>
                <CustomButton1 onPress={onPressSave} title="Save" />
            </View>
        </View>
    )
}

const TableModeContent = (props) => {
    const {
        tableData,
        onPressFilter,
        onPressConnectHerd,
        onPressHerd,
        paginationRange,
        currentPage,
        totalPages,
        handleNext,
        handlePrev,
        setCurrentPage
    } = props
    return (
        <>    
            <View style={{ marginTop: 17, marginBottom:29, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                        // onChangeText={text => setPassword(text)}
                    />
                </View>
                <TouchableOpacity onPress={onPressFilter}>
                    <Filter width={24} height={24} />
                </TouchableOpacity>
            </View>
            <View style={{marginBottom:12}}>
                <Text style={Fonts.bodyLargeMedium}>Total herd : <Text style={{ color: Colors.orange }}>{tableData.length} cows</Text></Text>
            </View>
            <CustomTable data={tableData} onPressConnect={onPressConnectHerd} onPressHerd={onPressHerd} />
            <TablePagination
                totalPages={paginationRange}
                currPage={currentPage}
                handleNext={handleNext}
                handlePrev={handlePrev}
                handleFirst={() => setCurrentPage(1)}
                handleLast={() => setCurrentPage(totalPages)}
                onPressPageButton={(page) => setCurrentPage(page)}
            />
            <View style={{height: hp(20), marginBottom: 'auto'}} />
        </>
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


const NoHerdsContent = (props) => {
    const { onPressAdd, onPressAddLater , onPressBack} = props;

    return (
        <>
            <View style={{ width: '50%', alignSelf:'center', alignItems:'center', marginTop: 56, marginBottom: 40  }}>
                <View style={{width:80, height: 80, borderRadius: 40, marginBottom: 20, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                    <ExclamationMark width={38} height={38}/>
                </View>
                <Text style={[Fonts.h2, {textAlign:'center'}]}>You don't have herd lists yet</Text>
            </View>

            <CustomButton1
                title="Add herd"
                onPress={onPressAdd}
            />
            <View style={{ marginTop: 10 }} />
            <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                <CustomButtonOutlined1
                    title="Back"
                    style={{ width: '48.5%' }}
                    onPress={onPressBack}
                />
               <CustomButton1
                    title="I will set it up later"
                    style={{ width: '48.5%' }}
                    onPress={onPressAddLater}
                />
            </View>
        </>
    );
};

const UploadHerdContent = (props) => {
    const { loading, file, onPressBrowse, onPressDelete , onPressSave, fileUploaded, userSelectedField, onPressSelectField} = props;

    return (
        <>
            <UploadHerdCard onPressSelectField={(fieldMode) => onPressSelectField(fieldMode)} userSelectedField={userSelectedField} file={file} uploaded={fileUploaded} onPressBrowse={onPressBrowse} onPressDelete={onPressDelete} />
            <View style={{marginBottom:12}} />
            <CustomButton1 loading={loading} disabled={loading} initDisable={!fileUploaded} title="Save" onPress={onPressSave} />
            <View style={{height:40}} />
        </>
    );
};

const UploadHerdCard = (props) => { 
    const {
        file, onPressBrowse,
        onPressDelete, uploaded,
        onPressSelectField,
        userSelectedField
    } = props

    return (
        <View style={{
            width:'100%', marginTop: 8, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingVertical:30, paddingHorizontal:16, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{ alignSelf: 'center', marginBottom: 23, alignItems: 'center', justifyContent: 'center' }}>
                    <File width={58} height={58} />
                </View>
                <Text style={[Fonts.h5, { marginBottom: 23 }]}>{uploaded? file[0].name : "Select a .csv file to upload"}</Text>
                <CustomButton1
                    title={uploaded ? "Delete" : "Browse file"}
                    onPress={uploaded ? onPressDelete : onPressBrowse}
                    style={{ width: '40%' }}
                />
                {
                    uploaded &&
                    <>
                        <Text style={[Fonts.h5, { fontSize:16, marginBottom: 20, marginTop:30 }]}>Please select the right data:</Text>
            
                        <View style={{width:'80%',alignSelf:'center', alignItems:'center', marginBottom: 10}}>
                            <Text style={[Fonts.bodySmall, { marginBottom: 10 }]}>Cow Id</Text>
                            <TouchableOpacity onPress={() => onPressSelectField('cow_id')} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={{flex:1}}>
                                    <Text style={Fonts.bodySmall}>{userSelectedField.id ? userSelectedField.id : "Select an option"}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Dropdown width={14} height={14} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'80%',alignSelf:'center', alignItems:'center', marginBottom: 10}}>
                            <Text style={[Fonts.bodySmall, { marginBottom: 10 }]}>Group Number</Text>
                            <TouchableOpacity onPress={() => onPressSelectField('group_number')} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={{flex:1}}>
                                    <Text style={Fonts.bodySmall}>{userSelectedField.group ? userSelectedField.group : "Select an option"}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Dropdown width={14} height={14} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'80%',alignSelf:'center', alignItems:'center', marginBottom: 10}}>
                            <Text style={[Fonts.bodySmall, { marginBottom: 10 }]}>Last Calving Date</Text>
                            <TouchableOpacity onPress={() => onPressSelectField('last_calving_date')}activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={{flex:1}}>
                                    <Text style={Fonts.bodySmall}>{userSelectedField.calvingDate ? userSelectedField.calvingDate : "Select an option"}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Dropdown width={14} height={14} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'80%',alignSelf:'center', alignItems:'center', marginBottom: 10}}>
                            <Text style={[Fonts.bodySmall, { marginBottom: 10 }]}>Reproduction Stat</Text>
                            <TouchableOpacity onPress={() => onPressSelectField('repro_stat')} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={{flex:1}}>
                                    <Text style={Fonts.bodySmall}>{userSelectedField.reproductionStatus ? userSelectedField.reproductionStatus : "Select an option"}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Dropdown width={14} height={14} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'80%',alignSelf:'center', alignItems:'center', marginBottom: 10}}>
                            <Text style={[Fonts.bodySmall, { marginBottom: 10 }]}>7 Days Avg Milk</Text>
                            <TouchableOpacity onPress={() => onPressSelectField('avg_milk')} activeOpacity={1} style={[styles.textInputStyleClass, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={{flex:1}}>
                                    <Text style={Fonts.bodySmall}>{userSelectedField.averageMilk ? userSelectedField.averageMilk : "Select an option"}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Dropdown width={14} height={14} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </>
                }
            </View>
        </View>
    )
}

const HerdProfileBottomNav = (props) => {
    const { onPressEdit, onPressDelete } = props;
    
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
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
            }}>
                <View style={{paddingVertical:25}}>
                    <View style={{ width: '90%', alignSelf: 'center', marginBottom:10}}>
                        <CustomButton1 title="Edit" onPress={onPressEdit} style={{ width: '100%' }} />
                    </View>
                    <View style={{ width: '90%', alignSelf: 'center', marginBottom:10}}>
                        <CustomButtonOutlined1 title="Delete" onPress={onPressDelete} style={{ width: '100%' }} />
                    </View>
                </View>
            </View>
        </View>
    )
}


const HerdBottomNav = (props) => {
    const { onPressBack, onPressNext, onPressAddHerd } = props;
    
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
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
            }}>
                <View style={{paddingVertical:25}}>
                    <View style={{ width: '90%', alignSelf: 'center', marginBottom:10}}>
                        <CustomButton1 title="Add more" onPress={onPressAddHerd} style={{ width: '100%' }} />
                    </View>
                    <View style={{
                        width: '90%',
                        alignSelf:'center',
                        // paddingHorizontal: 20,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection:'row'
                    }}>
                        <CustomButtonOutlined1 title="Back" onPress={onPressBack} style={{width:'48.5%'}} />
                        <CustomButton1 title="Next" onPress={onPressNext} style={{width:'48.5%'}}  />
                    </View >
                </View>
            </View>
        </View>
    )
}


const FilterHerdModal = (props) => { 
    const { onPressClose, onPressSeeResult, onPressCheckBox, selectedFilterMode } = props

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
                    <Text style={Fonts.h6}>Filter by</Text>
                    <TouchableOpacity onPress={onPressClose}>
                        <Close width={18} height={18} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: '90%',
                    alignSelf: 'center',
                    
                }}>
                    <Text style={Fonts.h6}>Connection</Text>
                    <TouchableOpacity onPress={() => onPressCheckBox('connected')} style={{ flexDirection: 'row', alignItems: 'center', marginVertical:8 }}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedFilterMode == 'connected' ?
                                    <CheckBoxFilled width={16} height={16} />
                                    :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>Connected</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressCheckBox('not_connected')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                marginRight: 8
                        }}>
                            {
                                selectedFilterMode == 'not_connected' ? 
                                    <CheckBoxFilled width={16} height={16} />
                                    :
                                    <CheckBox width={16} height={16} />
                            }
                        </View>
                        <Text style={Fonts.bodyLarge}>Not connected</Text>
                    </TouchableOpacity>
                </View>


            <View style={{ width: '90%', alignSelf:'center', marginBottom: 'auto', marginTop: 'auto'}}>
                <CustomButton1 title="See result" onPress={onPressSeeResult} />
            </View>
        </View>
    )
} 


const UploadHerdModal = (props) => { 
    const { onPressClose, uploadHerdStep, onPressNext, onPressPrev } = props

    return (
        <View style={{
            width: '90%',
            height: '70%',
            backgroundColor: Colors.white,
            borderRadius: 20,
            justifyContent:'space-between'
        }}>
            <TouchableOpacity onPress={onPressClose} style={{ alignSelf: 'flex-end', marginRight: 16, marginTop: 16 }}>
                <CloseOrange width={25} height={25} />
            </TouchableOpacity>
            
            <View style={{flex:4, width:'90%', alignSelf:'center', top: '-8 %'}}>
                <View style={{ alignSelf:'center', width:80, height: 80, borderRadius: 40, marginTop: 41, marginBottom: 40, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                    <ExclamationMark width={38} height={38}/>
                </View>
                <Text style={[Fonts.h4, { textAlign: 'center', marginBottom: 12 }]}>Step {uploadHerdStep}</Text>
                {
                    uploadHerdStep == 1 &&
                    <>
                        <Text style={[Fonts.h2, { textAlign: 'center', marginBottom: 16 }]}>Prepare your csv file</Text>
                        <Text style={[Fonts.bodyLarge, { marginBottom: 16 }]}>Make sure your excel sheet contains the following columns :</Text>
                        <View style={{ marginBottom: 16 }}>
                            <Text style={[Fonts.bodySmall, {marginBottom:8}]}>1. Cow ID</Text>
                            <Text style={[Fonts.bodySmall, {marginBottom:8}]}>2. Group Number</Text>
                            <Text style={[Fonts.bodySmall, {marginBottom:8}]}>3. Last Calving Date</Text>
                            <Text style={[Fonts.bodySmall, {marginBottom:8}]}>4. Reproduction Status</Text>
                            <Text style={[Fonts.bodySmall]}>5. 7 days average milk production</Text>
                        </View>
                        <Text style={[Fonts.bodyLarge]}><Text style={[Fonts.extraBold, {fontSize:16, lineHeight: 24}]}>.CSV</Text> File format</Text>
                    </>
                }
                {
                    uploadHerdStep == 2 &&
                    <>
                        <Text style={[Fonts.h2, { textAlign: 'center', marginBottom: 16 }]}>Upload your CSV file</Text>
                        <Text style={[Fonts.bodyLarge, { marginBottom: 16 }]}>Upload your CSV file</Text>
                    </>
                }
                {
                    uploadHerdStep == 3 &&
                    <>
                        <Text style={[Fonts.h2, { textAlign: 'center', marginBottom: 16 }]}>Double-check your herd</Text>
                        <Text style={[Fonts.bodyLarge, { marginBottom: 16 }]}>After you have uploaded the file, please re-check your data. If there is a trouble's data, then you can edit directly via our app</Text>
                    </>
                }
            </View>

            <View style={{ width: '80%', bottom: '10%', alignSelf: 'center',flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: uploadHerdStep == 1 ?  Colors.orange :  Colors.orange60  }} />
                    <View style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: uploadHerdStep == 2 ?  Colors.orange :  Colors.orange60  }} />
                    <View style={{width:8, height:8, borderRadius:4, marginHorizontal:4, backgroundColor: uploadHerdStep == 3 ?  Colors.orange :  Colors.orange60 }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {uploadHerdStep > 1 &&
                        <TouchableOpacity onPress={onPressPrev}>
                          <Text style={[Fonts.button, { color: Colors.orange }]}>Prev</Text>
                        </TouchableOpacity>
                    }
                    <View style={{ width: 16 }} />
                    <TouchableOpacity onPress={onPressNext}>
                        <Text style={[Fonts.button, { color: Colors.orange }]}>{uploadHerdStep == 3 ? 'Finish' : 'Next'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
} 


const HowToUploadVideoModal = (props) => { 
    const { onPressClose, uploadHerdVideoStep, onPressNext, onPressPrev } = props

    return (
        <>
         {
            uploadHerdVideoStep == 3 ?
            <View style={{
                width: '90%',
                height: '70%',
                justifyContent:'space-between'
            }}>
                <ImageBackground 
                    source={Images.cowImage}
                    imageStyle={{ borderRadius: 20}}
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        resizeMode: 'cover'
                        
                    }}
                >
                    <TouchableOpacity onPress={onPressClose} style={{alignSelf:'flex-end', marginRight: 16, marginTop: 16}}>
                        <CloseOrange width={25} height={25} />
                    </TouchableOpacity>
                    
                    <View style={{ flex: 4, width: '90%', alignSelf: 'center', top:'10%'}}>
                        <Text style={[Fonts.h4, { textAlign: 'center', color: Colors.white}]}>Sample Video</Text>
                    </View>
                    <LinearGradient
                        opacity={0.7}
                        colors={['transparent', Colors.neutral80, Colors.neutral, Colors.neutral]} 
                        style={{
                            width: '100%',
                            height: hp(20),
                            position: 'absolute',
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            bottom: '0%'
                        }}
                    />
                    <View style={{ width: '80%', bottom: '10%', alignSelf: 'center',flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: uploadHerdVideoStep == 1 ?  Colors.orange :  Colors.orange60  }} />
                            <View style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: uploadHerdVideoStep == 2 ?  Colors.orange :  Colors.orange60  }} />
                            <View style={{width:8, height:8, borderRadius:4, marginHorizontal:4, backgroundColor: uploadHerdVideoStep == 3 ?  Colors.orange :  Colors.orange60 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {uploadHerdVideoStep > 1 &&
                                <TouchableOpacity onPress={onPressPrev}>
                                <Text style={[Fonts.button, { color: Colors.orange }]}>Prev</Text>
                                </TouchableOpacity>
                            }
                            <View style={{ width: 16 }} />
                            <TouchableOpacity onPress={onPressNext}>
                                <Text style={[Fonts.button, { color: Colors.orange }]}>{uploadHerdVideoStep == 3 ? 'Finish' : 'Next'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex:1, width:'100%', height:'100%',justifyContent:'center',alignItems:'center', position:'absolute'}}>
                        <PlayButton />
                    </View>
                </ImageBackground>
            </View>
            :
            <View style={{
                width: '90%',
                height: '70%',
                backgroundColor: Colors.white,
                borderRadius: 20,
                justifyContent:'space-between'
            }}>
                <TouchableOpacity onPress={onPressClose} style={{alignSelf:'flex-end', marginRight: 16, marginTop: 16}}>
                    <CloseOrange width={25} height={25} />
                </TouchableOpacity>
                
                <View style={{ flex: 4, width: '90%', alignSelf: 'center'}}>
                    {
                        uploadHerdVideoStep == 1 &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <ScanVideo width={222} height={175} />
                        </View>
                    }
                    {
                        uploadHerdVideoStep == 2 &&
                        <View style={{ alignSelf:'center', width:80, height: 80, borderRadius: 40, marginTop: 41, marginBottom: 40, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                            <ExclamationMark width={38} height={38}/>
                        </View>
                    }
                    <View style={{ width: '80%', alignSelf: 'center' }}>
                        {
                            (uploadHerdVideoStep == 1 || uploadHerdVideoStep == 2) && 
                            <Text style={[Fonts.h4, { textAlign: 'center', marginBottom: 12 }]}>Step {uploadHerdVideoStep}</Text>
                        }
                        
                        {
                            uploadHerdVideoStep == 1 &&
                            <>
                                <Text style={[Fonts.h2, { textAlign: 'center', marginBottom: 16 }]}>How to upload your cow video</Text>
                                <Text style={[Fonts.bodyLarge, { marginBottom: 16 }]}>Take a video/upload an existing video of this cow. The video needs to be taken by walking around it 360 degrees</Text>
                            </>
                        }
                        {
                            uploadHerdVideoStep == 2 &&
                            <>
                                <Text style={[Fonts.h2, { textAlign: 'center', marginBottom: 16 }]}>Rules</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={[Fonts.bodyLarge]}>1. </Text>
                                    <Text style={[Fonts.bodyLarge]}>File size of each video should be no more than 20MB</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={[Fonts.bodyLarge]}>2. </Text>
                                    <Text style={[Fonts.bodyLarge]}>Max duration is 46 sec</Text>
                                </View>
                            </>
                        }
                    </View>
                </View>

                <View style={{ width: '80%', bottom: '10%', alignSelf: 'center',flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: uploadHerdVideoStep == 1 ?  Colors.orange :  Colors.orange60  }} />
                        <View style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: uploadHerdVideoStep == 2 ?  Colors.orange :  Colors.orange60  }} />
                        <View style={{width:8, height:8, borderRadius:4, marginHorizontal:4, backgroundColor: uploadHerdVideoStep == 3 ?  Colors.orange :  Colors.orange60 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {uploadHerdVideoStep > 1 &&
                            <TouchableOpacity onPress={onPressPrev}>
                            <Text style={[Fonts.button, { color: Colors.orange }]}>Prev</Text>
                            </TouchableOpacity>
                        }
                        <View style={{ width: 16 }} />
                        <TouchableOpacity onPress={onPressNext}>
                            <Text style={[Fonts.button, { color: Colors.orange }]}>{uploadHerdVideoStep == 3 ? 'Finish' : 'Next'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }
        </>
    )
} 

const DeleteCowModal = (props) => { 
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
                    title="Delete Now"
                    onPress={onPressDelete}
                    style={{ width: '38.5%'}}
                />
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
                <TouchableOpacity onPress={onPressStatus}  style={{ marginBottom: 14 }}>
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

const ChooseCSVFieldModal = (props) => { 
    const { csvData, onChooseField, onPressClose } = props

    return (
        <View style={{
            width: '100%',
            paddingBottom:40,
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
                <Text style={Fonts.h6}>CSV Fields</Text>
                <TouchableOpacity onPress={onPressClose}>
                    <Close width={18} height={18} />
                </TouchableOpacity>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                
            }}>
                {
                    Object.keys(csvData[0]).map((key) => (
                        <TouchableOpacity onPress={() => onChooseField(key)}  style={{ marginBottom: 14 }}>
                            <Text style={Fonts.bodyLarge}>{key}</Text>
                        </TouchableOpacity>
                    ))
                }
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
        paddingVertical: 0,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})