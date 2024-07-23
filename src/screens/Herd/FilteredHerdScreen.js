import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, Switch, Touchable } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import { EstrusTable } from '../../components/common/EstrusTable';

import CircleCheckBox from '../../assets/svg/circle-checkbox.svg'
import CircleCheckBoxFill from '../../assets/svg/circle-checkbox-fill.svg'

// Country SVG
import English from '../../assets/svg/languages/eng.svg'
import Swedish from '../../assets/svg/languages/swedish.svg'
import German from '../../assets/svg/languages/german.svg'
import Switzerland from '../../assets/svg/languages/switzerland.svg'

import ExpandLeft from '../../assets/svg/pagination/expand-left-light.svg'
import ExpandLeftStop from '../../assets/svg/pagination/expand-left-stop-light.svg'
import ExpandRight from '../../assets/svg/pagination/expand-right-light.svg'
import ExpandRightStop from '../../assets/svg/pagination/expand-right-stop-light.svg'

const PageSize = 7;
const SiblingCount = 3;

export default function FilteredHerdScreen({ route, navigation }) {
    const flatListRef = useRef(null);

    const { taskStatus, herdData } = route.params;

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil(herdData.length / itemsPerPage);

    const paginateData = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    }

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

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <EstrusTable
                            data={paginateData(herdData)}
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
                    <View style={{height: hp(5), marginBottom:'auto'}} />
                </ScrollView>
            </View>
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