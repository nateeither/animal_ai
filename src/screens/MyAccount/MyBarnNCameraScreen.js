import React, { useEffect, useState } from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, Switch } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import Search from '../../assets/svg/search.svg'
import ImagePict from '../../assets/svg/image.svg'
import PlayButton from '../../assets/svg/video-fill.svg'
import Download from '../../assets/svg/download.svg'

export default function MyBarnNCameraScreen({ navigation }) {
    const [statusMode, setStatusMode ] = useState('new')

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                {/* <View style={{
                        width: wp(100),
                        alignSelf:'center',
                        backgroundColor: Colors.orange40,
                        paddingBottom: 16,
                        marginBottom: 12
                    }}>
                        <View style={[styles.textInputStyleClass, { width: '90%', alignSelf:'center', flexDirection: 'row', alignItems: 'center', paddingHorizontal:10 }]}>
                            <TouchableOpacity>
                                <Search width={16} height={16} />
                            </TouchableOpacity>
                            <TextInput
                                autoCapitalize="none"    
                                autoCorrect={false}
                                style={[Fonts.bodySmall,{ flex: 1, top:3, left: 4 }]}
                                placeholder="Search" 
                                placeholderTextColor={Colors.neutral80}
                                // onChangeText={text => setPassword(text)}
                            />
                        </View>
                    </View> */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center'}}>
                        

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            {
                                statusMode == 'new' ?
                                    <CustomButton1 onPress={() => setStatusMode('new')} title="Add title here" textStyle={{fontSize:12}} style={{ flex: 1, height:30, paddingHorizontal:10, paddingTop: 3 }} />
                                    :
                                    <CustomButtonOutlined1 onPress={() => setStatusMode('new')} title="Add title here" textStyle={{fontSize:12}} style={{ flex: 1, height:30, paddingHorizontal: 10, paddingTop: 3 }} />
                            }
                            {
                                statusMode == 'in_progress' ?
                                    <CustomButton1 onPress={() => setStatusMode('in_progress')} title="Add title here" textStyle={{fontSize:12}} style={{ flex: 1, marginHorizontal: 12, height:30, paddingHorizontal: 10, paddingTop: 3 }} />
                                    :
                                    <CustomButtonOutlined1 onPress={() => setStatusMode('in_progress')} title="Add title here" textStyle={{fontSize:12}} style={{ flex: 1, marginHorizontal: 12, height:30, paddingHorizontal: 10, paddingTop: 3 }} />
                            }
                            {
                                statusMode == 'done' ?
                                    <CustomButton1 onPress={() => setStatusMode('done')} title="Add title here" textStyle={{fontSize:12}} style={{ flex: 1, height:30, paddingHorizontal: 10, paddingTop: 3 }} />
                                    :
                                    <CustomButtonOutlined1 onPress={() => setStatusMode('done')} title="Add title here" textStyle={{fontSize:12}} style={{flex:1, height:30, paddingHorizontal: 10, paddingTop: 3}} />
                            }
                        </View> */}
                        <View style={{marginBottom:30}}>
                            <Text style={[Fonts.h2, { marginBottom: 16 , marginTop:40}]}>Welcome to Your Farm,</Text>
                            <Text style={[Fonts.bodySmall, { marginBottom: 16 }]}>Nestled in the heart of Sweden, your farm is home to a thriving herd of cows. Our AI technology is here to help you manage them more efficiently.</Text>
                            <View style={{width:'90%'}}>
                                <Image resizeMode='cover' style={{ width:'100%', height: 120, alignSelf: 'center' }} source={Images.demoFarmImage} />
                            </View>
                        </View>
                        <View style={{marginBottom:30}}>
                            <Text style={[Fonts.h5, { marginBottom: 16}]}>My Cameras</Text>
                            <Text style={[Fonts.bodySmall, { marginBottom: 16 }]}>6 <Text style={{ textDecorationLine: 'underline' }}>Tapo C320</Text> cameras have been strategically installed across your farm, ensuring comprehensive coverage of your barn and pasture areas. For detailed information:</Text>
                            <CustomButton1 onPress={() => Linking.openURL('https://drive.google.com/file/d/11F8uvPNoNiREvXjbKt2X5JUr_VTwqfpt/view')} title="Check My Cams" style={{ width: 150}} />
                        </View>
                        <View style={{marginBottom:30}}>
                            <Text style={[Fonts.h5, { marginBottom: 16}]}>Hardware User Manuals</Text>
                            <Text style={[Fonts.bodySmall, { marginBottom: 16 }]}>Your farm is equipped with the following hardware, for detailed information on each device and their user manuals, please click the links below:</Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.tp-link.com/se/support/download/tapo-c320ws/')} style={{ marginBottom: 16}}>
                                <Text style={[Fonts.bodySmall, {color: Colors.orange }]}>1. Tapo C320 Cameras</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://drive.google.com/file/d/1LktQRTQTtTjnN326DKxy7hfLDFQMDxbE/view')} style={{ marginBottom: 16}}>
                                <Text style={[Fonts.bodySmall, {color: Colors.orange }]}>2. Estrus Alert AI box</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.tp-link.com/se/support/download/archer-ax3000/')} style={{ marginBottom: 16}}>
                                <Text style={[Fonts.bodySmall, {color: Colors.orange }]}>3. Tplink AX3000 Router</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginBottom:30}}>
                            <Text style={[Fonts.h5, { marginBottom: 16}]}>FAQ</Text>
                            <Text style={[Fonts.bodySmall, { marginBottom: 16 }]}>Got questions? We're here to help. Click the button below to chat with our support bot.</Text>
                            <CustomButton1 onPress={() => navigation.navigate('CustomerSupportScreen')} title="Chat with Support" style={{ width: 160}} />
                        </View>
                    </View>
                    <View style={{height: hp(10), marginBottom:'auto'}} />
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