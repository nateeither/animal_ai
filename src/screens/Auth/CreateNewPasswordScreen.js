import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, useWindowDimensions, TextInput, SafeAreaView } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';

export default function CreateNewPasswordScreen({ navigation }) {

    return (
        <View style={{flex:1, backgroundColor: Colors.white }}>
            <View style={styles.container}>
               
                <View style={{ justifyContent:'flex-start', marginTop:16 }}>

                    <View style={{marginTop:24}}>
                        <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Password</Text>
                        <View style={[styles.textInputStyleClass, {flexDirection:'row', alignItems:'center'}]}>
                            <TextInput
                                autoCapitalize="none"    
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType='password'  
                                style={[Fonts.bodySmall,{ flex: 1 }]}
                                placeholder="Type here" 
                                placeholderTextColor={Colors.neutral80}
                                // onChangeText={text => this.setState({email:text})}
                            />
                            <Image resizeMode='contain' style={{ height: 16, width: 16, alignSelf:'center'}} source={Icons.eyeSlash} />
                        </View>
                        <Text style={[Fonts.captionRegular,{marginTop:8, color: Colors.neutral80}]}>Must be at least 8 characters</Text>
                    </View>

                  
                    <View style={{marginTop:24}}>
                        <Text style={[Fonts.bodySmall, {marginBottom: 8 }]}>Confirm Password</Text>
                        <View style={[styles.textInputStyleClass, {flexDirection:'row', alignItems:'center'}]}>
                            <TextInput
                                autoCapitalize="none"    
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType='password'  
                                style={[Fonts.bodySmall,{ flex: 1 }]}
                                placeholder="Type here" 
                                placeholderTextColor={Colors.neutral80}
                                // onChangeText={text => this.setState({email:text})}
                            />
                            <Image resizeMode='contain' style={{ height: 16, width: 16, alignSelf:'center'}} source={Icons.eyeSlash} />
                        </View>
                        <Text style={[Fonts.captionRegular,{marginTop:8, color: Colors.neutral80}]}>Must be at least 8 characters</Text>
                    </View>

                </View>
                
                <View style={{marginTop:24}}>
                    <CustomButton1 title="Reset Password" onPress={()=> navigation.navigate('SuccessResetPasswordScreen')} />
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
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})