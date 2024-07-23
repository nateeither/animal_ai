import React, { memo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, Alert } from 'react-native';
import { Colors, Icons, Fonts, wp, hp, nf } from '../../constants';

// SVG
import AlertRed from '../../assets/svg/alert-red.svg'

//normal button
const EstrusTableComp = (props) => {
    const { data, onPressHerd } = props;

    return (
        <View style={{ width:'100%', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius:8, overflow:'hidden' }}>
            <TableHeader />
            <FlatList
                data={data}
                renderItem={({ item , index}) => (
                    <TableItem item={item} index={index} onPressHerd={(herd) => onPressHerd(herd)}  />
                )}
                keyExtractor={(item,index)=>index.toString()}
            />
        </View>
    );
};
export const EstrusTable = memo(EstrusTableComp)

const TableHeader = (_) => {
    return (
        <View style={{ width:'100%', height:52, flexDirection:'row', backgroundColor: Colors.neutral }}>
            <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>ID</Text>
            </View>
            <View style={{flex: 2, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>Latest activity</Text>
            </View>
            <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>Cam</Text>
            </View>
            <View style={{ flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center' }}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>Score</Text>
            </View>
        </View>
    )
}

const TableItem = (props) => {
    const { item, index, onPressHerd } = props

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    function checkIsNum(num) {
        if ((typeof num === 'number') && (num % 1 === 0)) return true;
        if ((typeof num === 'number') && (num % 1 !== 0)) return true;
        if (typeof num === 'number') return true;
    }
     
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => onPressHerd(item)}>
            <View style={{ width:'100%', height:52, flexDirection:'row', justifyContent:'space-evenly', borderTopWidth: 1, borderColor: Colors.orange60, backgroundColor: item.status == 'done' ? Colors.alertGreen40 : item.status == 'assigned' ? Colors.alertBlue40 : Colors.alertRed40 }}>
                <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                    <Text style={Fonts.bodySmall}>{item.id}</Text>
                </View>
                <View style={{flex: 2, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                    <Text style={Fonts.bodySmall}>{item.latestActivity ? formatDate(item.latestActivity) : '-'}</Text>
                </View>
                <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                    <Text style={Fonts.bodySmall}>{item.camera ? item.camera : '-'}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={[Fonts.bodySmall,{marginRight:4}]}>{item.score && checkIsNum(item.score) ? Math.round(item.score * 5) : '0'}/5</Text>
                        {/* <AlertRed width={10} height={10} /> */}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: Colors.orange,
        borderRadius: 5, height: 40, justifyContent: 'center', alignItems: 'center',
    },
    whiteColoredText: {
        color: Colors.white,
    },
    fadedBlackColoredText: {
        color: Colors.neutral80,
    },
})