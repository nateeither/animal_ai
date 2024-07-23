import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, View, useWindowDimensions, TextInput, SafeAreaView } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import auth from '@react-native-firebase/auth';

import { useToast } from "react-native-toast-notifications";

export default function ResetPasswordScreen({ navigation }) {
    const toast = useToast()
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);

    function forgotPassword() {
        setSending(true)

        if (email != '') {
            auth()
            .sendPasswordResetEmail(email)
            .then(function (user) {
                setSending(false)
                navigation.replace('ResetPasswordNotifScreen')
            }).catch(error => {
                setSending(false)

                if (error.code === 'auth/invalid-email') {
                    toast.show("That email address is invalid!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                    animationType: 'slide-in',});
                    console.log('That email address is invalid!');
                }

                if (error.code === 'auth/user-not-found') {
                    toast.show("There is no user record corresponding to this identifier. The user may have been deleted.", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
                    animationType: 'slide-in',});
                    console.log('There is no user record corresponding to this identifier. The user may have been deleted.');
                }
            })
        }
       
        if (email == '') {
            setSending(false)
            toast.show("Email cannot be empty!", {type: 'danger',placement:'top',style: { marginTop: StatusBar.currentHeight }, // <- This solve the problem!
            animationType: 'slide-in',});
        }
      }

    return (
        <View style={{flex:1, backgroundColor: Colors.white }}>
            <View style={styles.container}>
               
                <View style={{ justifyContent:'flex-start', marginTop:16 }}>
                    <Text style={Fonts.bodyLarge}>Please insert your email account, we will send you a password recovery link via e-mail</Text>
                    
                    <View style={{marginTop:16}}>
                        <Text style={[Fonts.bodySmall,{marginBottom:8}]}>Email</Text>
                        <TextInput  
                            autoCapitalize="none"    
                            autoCorrect={false}
                            style={[Fonts.bodySmall,styles.textInputStyleClass]}
                            placeholder="Type here" 
                            mode='outlined'
                            placeholderTextColor={Colors.neutral80}
                            onChangeText={text => setEmail(text)}
                        />
                    </View>

                </View>
                
                <View style={{marginTop:16}}>
                    <CustomButton1 disabled={sending} loading={sending} title="Send" onPress={()=> forgotPassword() } />
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