import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector, shallowEqual } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { nf, wp, hp } from '../../utils/utility'
import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';
import { EstrusTable } from '../../components/common/EstrusTable';

//SVG
import Date from '../../assets/svg/date.svg'
import HeartFilled from '../../assets/svg/heart-fill.svg'
import AlertRed from '../../assets/svg/alert-red.svg'
import CaretRight from '../../assets/svg/caret-right.svg'

import ExpandLeft from '../../assets/svg/pagination/expand-left-light.svg'
import ExpandLeftStop from '../../assets/svg/pagination/expand-left-stop-light.svg'
import ExpandRight from '../../assets/svg/pagination/expand-right-light.svg'
import ExpandRightStop from '../../assets/svg/pagination/expand-right-stop-light.svg'

export default function OtherFeatureScreen({ navigation }) {
    const hours24Data = [
        { id: 8081, latest_act: "Standing heat", cam: "1-5", score: "5/5", status: "assigned" },
        { id: 8091, latest_act: "Standing heat", cam: "1-5", score: "3/5", status: "open" },
        { id: 8021, latest_act: "Standing heat", cam: "1-5", score: "3/5", status: "done" },
        { id: 8041, latest_act: "Standing heat", cam: "1-5", score: "4/5", status: "assigned" },
        { id: 8011, latest_act: "Standing heat", cam: "1-5", score: "5/5", status: "open" },
        { id: 8071, latest_act: "Standing heat", cam: "1-5", score: "3/5", status: "done" },

    ]

    const hours48Data = [
        { id: 8081, latest_act: "Standing heat", cam: "1-5", score: "5/5", status: "assigned" },
        { id: 8091, latest_act: "Standing heat", cam: "1-5", score: "3/5", status: "open" },
        { id: 8021, latest_act: "Standing heat", cam: "1-5", score: "3/5", status: "done" },
        { id: 8041, latest_act: "Standing heat", cam: "1-5", score: "4/5", status: "assigned" },
    ]

     const week1Data = [
        { id: 8081, latest_act: "Standing heat", cam: "1-5", score: "5/5", status: "assigned" },
        { id: 8091, latest_act: "Standing heat", cam: "1-5", score: "3/5", status: "open" },
    ]
    
    const [tableTimeRange, setTableTimeRange ] = useState('24h')

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    width: wp(100),
                    height: hp(40),
                    backgroundColor: Colors.orange40,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    paddingBottom: 20,
                    paddingTop:16
                }}>
                    <View style={{width: wp(90), alignSelf:'center', flexDirection:'row',alignItems:'center', justifyContent:'space-between', marginTop:'auto', marginBottom:24}}>
                        <Text style={Fonts.h5}>Estrus overview</Text>
                        <Text style={Fonts.captionRegular}>Mon, Nov 21 2022</Text>
                    </View>
                    <View style={{ width: wp(90), alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        {
                            tableTimeRange == '24h' ?
                                <CustomButton1 onPress={() => setTableTimeRange('24h')} title="24 hours" style={{ width: 90, height: 30, borderRadius: 4 }} textStyle={[Fonts.captionMedium, { color: Colors.white }]} />
                                :
                                <CustomButtonOutlined1 onPress={() => setTableTimeRange('24h')} title="24 hours" style={{ width: 90, height:30, borderRadius:4, backgroundColor: Colors.orange20 }} textStyle={[Fonts.captionMedium,{ color: Colors.orange }]} />
                        }
                        {
                            tableTimeRange == '48h' ?
                                <CustomButton1 onPress={() => setTableTimeRange('48h')} title="48 hours" style={{ width: 90, height: 30, borderRadius: 4 }} textStyle={[Fonts.captionMedium, { color: Colors.white }]} />
                                :
                                <CustomButtonOutlined1 onPress={() => setTableTimeRange('48h')} title="48 hours" style={{ width: 90, height:30, borderRadius:4, backgroundColor: Colors.orange20 }} textStyle={[Fonts.captionMedium,{ color: Colors.orange }]} />
                        }
                        {
                            tableTimeRange == '1w' ?
                                <CustomButton1 onPress={() => setTableTimeRange('1w')} title="48 hours" style={{ width: 90, height: 30, borderRadius: 4 }} textStyle={[Fonts.captionMedium, { color: Colors.white }]} />
                                :
                                <CustomButtonOutlined1 onPress={() => setTableTimeRange('1w')} title="1 week" style={{ width: 90, height:30, borderRadius:4, backgroundColor: Colors.orange20 }} textStyle={[Fonts.captionMedium,{ color: Colors.orange }]} />
                        }
                        <Date width={32} height={32} />
                    </View>
                    <View style={{
                        width: wp(90), alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12
                    }}>
                        <View style={{
                                flex:1,
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
                            <HeartFilled width={18} height={18} /> 
                            <Text style={[Fonts.captionRegular, { marginTop: 5 }]}>Add title here</Text>
                            <Text style={[Fonts.h3,{color:Colors.orange}]}>30</Text>
                        </View>
                        <View style={{
                            flex:1,
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
                            <HeartFilled width={18} height={18} /> 
                            <Text style={[Fonts.captionRegular, { marginTop: 5 }]}>Add title here</Text>
                            <Text style={[Fonts.h3,{color:Colors.orange}]}>24</Text>
                        </View>
                        <View style={{
                            flex:1,
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
                            <HeartFilled width={18} height={18} /> 
                            <Text style={[Fonts.captionRegular, { marginTop: 5 }]}>Add title here</Text>
                            <Text style={[Fonts.h3,{color:Colors.orange}]}>6</Text>
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
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{ width: 65, height: 65, borderRadius: 65/2, backgroundColor: Colors.alertRed60, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{width: 45, height: 45, borderRadius: 45/2, backgroundColor: Colors.white, alignItems:'center', justifyContent:'center'}}>
                                        <Text style={[Fonts.h5,{fontSize: 16, color:Colors.alertRed}]}>5/5</Text>
                                    </View>
                                </View>
                                <View style={{marginLeft:10}}>
                                    <AlertRed width={22} height={22} /> 
                                    <Text style={[Fonts.captionRegular,{marginTop:5}]}>Add title here</Text>
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
                                <View style={{ width: 65, height: 65, borderRadius: 65/2, backgroundColor: Colors.alertRed60, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{width: 45, height: 45, borderRadius: 45/2, backgroundColor: Colors.white, alignItems:'center', justifyContent:'center'}}>
                                        <Text style={[Fonts.h5,{fontSize: 16, color:Colors.alertRed}]}>4/5</Text>
                                    </View>
                                </View>
                                <View style={{marginLeft:10}}>
                                    <AlertRed width={22} height={22} /> 
                                    <Text style={[Fonts.captionRegular,{marginTop:5}]}>Add title here</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{width: '90%', alignSelf:'center', alignItems:'center', marginBottom:16}}>
                    <View style={{width: wp(90), height:66, backgroundColor: Colors.orange20, borderRadius:8, marginVertical:16, paddingTop:6, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <View style={{ width: 18, height: 18, backgroundColor: Colors.alertRed60, marginBottom: 6 }} />
                            <Text style={Fonts.captionRegular}>Open</Text>
                        </View>
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <View style={{ width: 18, height: 18, backgroundColor: Colors.alertBlue60, marginBottom: 6 }} />
                            <Text style={Fonts.captionRegular}>Assigned</Text>
                        </View>
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <View style={{ width: 18, height: 18, backgroundColor: Colors.alertGreen60, marginBottom: 6 }} />
                            <Text style={Fonts.captionRegular}>Done</Text>
                        </View>
                    </View>
                </View>
                <View style={{width: wp(90), alignSelf:'center'}}>
                    <EstrusTable data={tableTimeRange == '24h' ? hours24Data : tableTimeRange == '48h' ? hours48Data : week1Data}  />
                </View>
                <TablePagination />
                <View style={{ marginTop:30, marginBottom: 24, alignSelf:'center'}}>
                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={[Fonts.button, { color: Colors.orange, marginRight: 15, marginTop:3 }]}>View all</Text>
                        <CaretRight height={12} />
                    </TouchableOpacity>
                </View>
                <View style={{width:wp(90), alignSelf:'center'}}>
                    <CustomButton1 title="Copy pdf link" />
                    <View style={{ marginBottom: 10 }} />
                    <CustomButtonOutlined1 title="Copy excel link" />
                </View>
                <TasksContent />
                <View style={{width:wp(90), alignSelf:'center', marginTop: 4}}>
                    <CustomButtonOutlined1 title="See all tasks" />
                </View>
                <View style={{height: hp(20), marginBottom:'auto'}} />
            </ScrollView>
        </View>
    )
}

const TablePagination = (props) => { 
    return (
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 16 }}>
            <View opacity={0.3}>
                <TouchableOpacity disabled={true} style={{marginRight:12}}>
                    <ExpandLeftStop width={21} height={21} />
                </TouchableOpacity>
            </View>
            <View opacity={0.3}>
                <TouchableOpacity disabled={true} style={{marginRight:12}}>
                    <ExpandLeft width={21} height={21} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 36/2, backgroundColor: Colors.orange, alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.bodySmall,{color: Colors.white}]}>1</Text>
            </TouchableOpacity>
            <View opacity={0.3}>
                <TouchableOpacity disabled={true} style={{marginLeft:12}}>
                    <ExpandRight width={21} height={21} />
                </TouchableOpacity>
            </View>
            <View opacity={0.3}>
                <TouchableOpacity disabled={true} style={{marginLeft:12}}>
                    <ExpandRightStop width={21} height={21} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const TasksContent = (props) => {
    return (
        <>
            <View style={{width:wp(90), marginTop:18, marginBottom:16, alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <Text style={Fonts.h5}>Tasks</Text>
                <Text style={[Fonts.button,{color: Colors.orange}]}>See all</Text>
            </View>
            <View style={{width:wp(90),alignSelf:'center'}}>
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
            </View>
        </>
    )
}

const TaskCard = (props) => {
    return (
        <View style={{
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
                <Text style={[Fonts.h6, { marginBottom: 4 }]}>Task title</Text>
                <View style={{flexDirection:'row',alignItems:'center', marginBottom:4}}>
                    <Text style={Fonts.captionRegular}>Assigned to John Doe • Manager</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center', marginBottom:4}}>
                    <Text style={Fonts.captionRegular}>8040 • Group 1</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center', marginBottom:4}}>
                    <Text style={Fonts.captionRegular}>Nov 24 - 27, 2022</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{ paddingHorizontal:12, height: 26, backgroundColor: Colors.alertRed60, flexDirection: 'row', alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        <AlertRed width={10} height={10} />
                        <Text style={[Fonts.captionRegular,{color: Colors.alertRed, marginTop:3, marginLeft:4}]}>5/5</Text>
                    </View>
                    <View style={{ paddingHorizontal:12, height: 26, backgroundColor: Colors.alertGreen20, flexDirection: 'row', alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        <View style={{width:4, height: 4, borderRadius:2, backgroundColor: Colors.alertGreen}} />    
                        <Text style={[Fonts.captionRegular,{color: Colors.alertGreen, marginTop:3, marginLeft:4}]}>3 Days left</Text>
                    </View>
                    <View style={{ paddingHorizontal:12, height: 26, backgroundColor: Colors.alertBlue40, alignItems:'center', justifyContent:'center', borderRadius: 35, marginRight: 4}}>
                        <Text style={[Fonts.captionRegular,{color: Colors.alertBlue, marginTop:3}]}>In progress</Text>
                    </View>
                </View>
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