import React, { useEffect, useState, useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, TextInput, View, ScrollView, SafeAreaView, ImageBackground} from 'react-native'
import { nf, wp, hp, sh, sw } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Modal from "react-native-modalbox"

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomTable } from '../../components/common/CustomTable';

import Search from '../../assets/svg/search.svg'
import Filter from '../../assets/svg/filter.svg'

import ExpandLeft from '../../assets/svg/pagination/expand-left-light.svg'
import ExpandLeftStop from '../../assets/svg/pagination/expand-left-stop-light.svg'
import ExpandRight from '../../assets/svg/pagination/expand-right-light.svg'
import ExpandRightStop from '../../assets/svg/pagination/expand-right-stop-light.svg'

import CheckBox from '../../assets/svg/checkbox.svg'
import CheckBoxFilled from '../../assets/svg/checkbox-filled.svg'

import Close from '../../assets/svg/close.svg'
import CloseOrange from '../../assets/svg/close-orange.svg'
import ScanVideo from '../../assets/svg/scan-video.svg'
import PlayButton from '../../assets/svg/video-fill.svg'
import ExclamationMark from '../../assets/svg/exclamation-mark.svg'

import LinearGradient from 'react-native-linear-gradient';

const PageSize = 7;
const SiblingCount = 3;

export default function AddHerdScreen({ route, navigation }) {
    const { csvData } = route.params

    const [filterHerdModalShown, setFilterHerdModalShown] = useState(false)
    const [uploadHerdVideoModalShown, setUploadHerdVideoModalShown] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState('connected')
    const [uploadHerdVideoStep, setUploadHerdVideoStep] = useState(1)

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

    function onPressNextUploadVideoModal() {
        if (uploadHerdVideoStep != 3) { setUploadHerdVideoStep(uploadHerdVideoStep + 1) }
        if (uploadHerdVideoStep == 3) { setUploadHerdVideoStep(1), setUploadHerdVideoModalShown(false), navigation.navigate('UploadHerdVideoScreen')}
    }

    function onPressPrevUploadVideoModal() {
        if (uploadHerdVideoStep != 1) { setUploadHerdVideoStep(uploadHerdVideoStep - 1) }
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


    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
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
                            <TouchableOpacity onPress={() => setFilterHerdModalShown(true)}>
                                <Filter width={24} height={24} />
                            </TouchableOpacity>
                         </View>
                        <View style={{marginBottom:12}}>
                            <Text style={Fonts.bodyLargeMedium}>Total herd : <Text style={{ color: Colors.orange }}>{csvData.length} cows</Text></Text>
                        </View>
                        <CustomTable
                            data={csvData}
                            onPressConnect={() => setUploadHerdVideoModalShown(true)}
                            onPressHerd={(herd) => navigation.navigate('HerdProfileScreen',{herdData: herd})}
                        />
                         <TablePagination
                            totalPages={paginationRange}
                            currPage={currentPage}
                            handleNext={handleNext}
                            handlePrev={handlePrev}
                            handleFirst={() => setCurrentPage(1)}
                            handleLast={() => setCurrentPage(totalPages)}
                            onPressPageButton={(page) => setCurrentPage(page)}
                        />
                    </View>
                    <View style={{height: hp(20), marginBottom:'auto'}} />
                </ScrollView>
            </View>
            <AddHerdBottomNav onPressAdd={() => navigation.goBack()} />
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

const AddHerdBottomNav = (props) => {
    const { onPressAdd } = props;
    
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
                    <CustomButton1 title="Add more" onPress={onPressAdd} style={{width:'100%'}}  />
                </View >
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