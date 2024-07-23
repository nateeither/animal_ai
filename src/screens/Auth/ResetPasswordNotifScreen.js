import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, useWindowDimensions, TextInput, SafeAreaView } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';

export default function ResetPasswordNotifScreen({ navigation }) {

    function redirect() {
        setTimeout(() => {
            navigation.replace('LoginScreen')
        }, 3000)
    }

    useEffect(() => {
        redirect()
      }, []);
    

    return (
        <View style={{flex:1, backgroundColor: Colors.white }}>
            <View style={styles.container}>
                <View style={{ width: '50%', alignSelf:'center', alignItems:'center', marginTop: 187  }}>
                    <View style={{width:80, height: 80, borderRadius: 40, marginBottom: 20, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                        <Image resizeMode='contain' style={{ height: 38, width: 38, alignSelf:'center'}} source={Icons.checkMark} />
                    </View>
                    <Text style={Fonts.h2}>Mail sent!</Text>
                    <Text style={[Fonts.captionRegular, {lineHeight:18, marginTop: 8, textAlign:'center'}]}>We have sent a password recovery link to your e-mail</Text>
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
        textAlign: 'auto',
        paddingHorizontal: 20,
        paddingVertical:12,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})