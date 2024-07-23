import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, TextInput, View, ScrollView, SafeAreaView } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { useSelector } from 'react-redux';
1
import { CustomButton1 } from '../../components/common/CustomButton';
import File from '../../assets/svg/file-with-circle.svg'

export default function UploadHerdVideoScreen({ navigation }) {
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <View style={{flex:1}}>
                            <View style={{ width: '100%', height: 234, borderRadius: 8, marginBottom: 16, backgroundColor: Colors.orange40, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{width:'70%', alignSelf:'center', alignItems:'center'}}>
                                    <Text style={[Fonts.h3, { textAlign: 'center', marginBottom: 24 }]}>Upload your existing cow video</Text>
                                    <CustomButton1 onPress={()=>{}} title="Upload video" style={{ width: wp(40)}} />
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 234, borderRadius: 8, marginBottom: 16, backgroundColor: Colors.orange40, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{width:'70%', alignSelf:'center', alignItems:'center'}}>
                                    <Text style={[Fonts.h3, { textAlign: 'center', marginBottom: 24 }]}>Take a video</Text>
                                    <CustomButton1 onPress={()=>{}} title="Take video now" style={{ width: wp(40)}} />
                                </View>
                            </View>
                            <View style={{marginTop:'10%'}}>
                                <CustomButton1 onPress={() => navigation.goBack()} title="Save" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
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