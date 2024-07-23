import React, { memo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, Touchable } from 'react-native';
import { Colors, Icons, Fonts, wp, hp, nf } from '../../constants';
import moment from "moment";

// SVG
import CheckMark from '../../assets/svg/check.svg'

//normal button
const CustomTableComp = (props) => {
    const { data, onPressConnect, onPressHerd } = props;

    return (
        <View style={{ width:'100%', flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth:0.5, borderColor: Colors.orange60, borderRadius:8, overflow:'hidden' }}>
            <TableHeader />
            <FlatList
                data={data}
                renderItem={({ item , index}) => (
                    <TableItem item={item} index={index} onPressConnect={onPressConnect} onPressHerd={(herd) => onPressHerd(herd)}  />
                )}
                keyExtractor={(item,index)=>index.toString()}
            />
        </View>
    );
};
export const CustomTable = memo(CustomTableComp)

const TableHeader = (_) => {
    return (
        <View style={{ width:'100%', height:52, flexDirection:'row', backgroundColor: Colors.neutral }}>
            <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>ID</Text>
            </View>
            <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>Cam</Text>
            </View>
            <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                <Text style={[Fonts.captionRegular,{color: Colors.white}]}>Birthdate</Text>
            </View>
            <View style={{flex: 1, alignSelf: 'stretch'}}/>
        </View>
    )
}

const TableItem = (props) => {
    const { item, index, onPressConnect, onPressHerd} = props
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => onPressHerd(item)}>
            <View style={{ width:'100%', height:52, flexDirection:'row', justifyContent:'space-evenly', backgroundColor: (index % 2) == 0 ? Colors.white : Colors.orange40 }}>
                <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                    <Text style={Fonts.bodySmall}>{item.id}</Text>
                </View>
                <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                    <Text style={Fonts.bodySmall}>{item.camera}</Text>
                </View>
                <View style={{flex: 1, alignSelf: 'stretch', alignItems:'center', justifyContent:'center'}}>
                    <Text style={Fonts.bodySmall}>{moment(item.birthdate).format('YY/MM/DD')}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                    {/* {
                        item.connected ?
                            <CheckMark width={20} height={20} />
                            :
                            <TouchableOpacity onPress={onPressConnect}>
                                <Text style={[Fonts.button,{color: Colors.orange}]}>Connect</Text>
                            </TouchableOpacity>
                    } */}

                        <TouchableOpacity onPress={onPressConnect}>
                            <Text style={[Fonts.button,{color: Colors.orange}]}>Connect</Text>
                        </TouchableOpacity>
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