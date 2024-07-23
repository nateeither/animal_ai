import React, { useEffect, useState, useCallback } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, TextInput, View, ScrollView, SafeAreaView } from 'react-native'
import { nf, wp, hp, sh, sw } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';

import File from '../../assets/svg/file-with-circle.svg'
import Dropdown from '../../assets/svg/dropdown.svg'
import Close from '../../assets/svg/close.svg'

import DocumentPicker from 'react-native-document-picker'
import { readFile, DownloadDirectoryPath } from 'react-native-fs'
import { useToast } from "react-native-toast-notifications";
import XLSX from 'xlsx'
import Papa from 'papaparse';
import Modal from "react-native-modalbox"
import { nanoId } from '../../utils/reusableFunctions'

import {
    requestGetHerds,
    requestAddNewHerd,
    resetSuccessAddNewHerd
} from '../../store/herd/actions';

export default function UploadHerdScreen({ navigation }) {
    const dispatch = useDispatch();
    const toast = useToast()

    const [fileUploaded, setFileUploaded] = useState(false)
    const [fileResponse, setFileResponse] = useState([])
    const [csvData, setCsvData] = useState([])
    const [chooseCSVFieldModalShown, setChooseCSVFieldModalShown] = useState(false)

    const [userSelectedField, setUserSelectedField] = useState({
        id: "",
        group: "",
        calvingDate: "",
        reproductionStatus: "",
        averageMilk: "",
    })

    const [csvFieldMode, setCsvFieldMode] = useState('cow_id')

    const { addNewHerdSuccess } = useSelector(state => ({
        addNewHerdSuccess: state.herdReducer.addNewHerdSuccess,
    }), shallowEqual)

    const { addNewHerdLoading } = useSelector(state => ({
        addNewHerdLoading: state.herdReducer.addNewHerdLoading,
    }), shallowEqual)

    const { currUser } = useSelector(state => ({
        currUser: state.authReducer.currentUser,
    }), shallowEqual);

    useEffect(() => {
        if (addNewHerdSuccess) {
            toast.show("Successfully add herds", { type: 'success', placement: 'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in', });
            handleGetHerds(currUser.farm)
            dispatch(resetSuccessAddNewHerd())
            setFileResponse([])
            setFileUploaded(false)
            navigation.navigate('AddHerdScreen', {csvData: csvData})
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
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <UploadCard onPressSelectField={(fieldMode) => {setCsvFieldMode(fieldMode),setChooseCSVFieldModalShown(true)}} userSelectedField={userSelectedField} file={fileResponse} uploaded={fileUploaded} onPressBrowse={() => handleDocumentSelection()} onPressDelete={() => { setFileResponse([]), setFileUploaded(false) }} />
                        <View style={{marginBottom:12}} />
                        <CustomButton1 loading={addNewHerdLoading} disabled={addNewHerdLoading} initDisable={!fileUploaded} title="Save" onPress={() => onSave()} />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
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
        </SafeAreaView>
    )
}

const UploadCard = (props) => { 
    const {
        file, uploaded,
        onPressDelete, onPressBrowse,
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
        textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})