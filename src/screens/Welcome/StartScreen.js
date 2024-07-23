import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Colors, Fonts, Icons } from '../../constants'
import { nf, wp, hp } from '../../utils/utility'
import * as Animatable from 'react-native-animatable';
import DjurvaktLogo from '../../assets/svg/djurvakt-logo.svg'

const StartScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white,alignItems: 'center', justifyContent:'center' }}>
            <Animatable.View
                animation="zoomIn"
                style={{ alignItems: 'center', justifyContent:'center'}}>
                  {/* <DjurvaktLogo width={124} height={124} /> */}
                  <Image source={Icons.djurvaktLogo} resizeMode='contain' style={{width:100, height:100, borderRadius: 10}} /> 
            </Animatable.View>
        </View>
    )
}

export default StartScreen