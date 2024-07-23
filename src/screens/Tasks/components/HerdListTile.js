import React, { memo, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Icons, Fonts, wp, hp, nf } from '../../../constants';

import CheckBox from '../../../assets/svg/checkbox.svg'
import CheckBoxFilled from '../../../assets/svg/checkbox-filled.svg'

//normal button
const HerdListTileComp = (props) => {
    const { herdData, choosenHerdsUid, onPressCheckbox  } = props
    
    return (
        <View style={{
            width: '100%',
            backgroundColor: Colors.white,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom:12
        }}>
            <TouchableOpacity activeOpacity={1} onPress={() => onPressCheckbox(herdData.uid)}>
                {
                    choosenHerdsUid.includes(herdData.uid) ?
                        <CheckBoxFilled width={16} height={16} />
                        :
                        <CheckBox width={16} height={16} />
                }
            </TouchableOpacity>
            <View style={{marginLeft:12, justifyContent:'flex-start'}}>
                <Text style={[Fonts.h6, { marginBottom: 4 }]}>{herdData.localId}</Text>
                <Text style={[Fonts.bodySmall]}>{herdData.id} • Cam {herdData.camera}</Text>
                {/* <Text style={[Fonts.bodySmall]}>{herdData.id} • Group 1 • Cam 1</Text> */}
            </View>
        </View>

    );
};
export const HerdListTile = memo(HerdListTileComp)


const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: Colors.orange,
        borderRadius: 5, height: 40, justifyContent: 'center', alignItems: 'center',
    },
    whiteColoredText: {
        color: Colors.white,
    },
})