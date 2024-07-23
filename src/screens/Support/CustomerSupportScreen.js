import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Colors, Fonts } from '../../constants'
import { nf, wp, hp } from '../../utils/utility'

import WebView from 'react-native-webview'

const CustomerSupportScreen = () => {
    return (
        // <View style={{ flex: 1, backgroundColor: Colors.white,alignItems: 'center', justifyContent:'center' }}>
            <WebView
                scalesPageToFit={true}
                javaScriptEnabled={true}
                automaticallyAdjustContentInsets={true}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                source={{ uri: 'https://tawk.to/chat/6433c6904247f20fefeac248/1gtl3v9dc' }}
                // onShouldStartLoadWithRequest={(event) => {
                //     if (event.url !== this.state.link) {
                //         // webViewRef.current.stopLoading()
                //     //   alert('Prevent loading')
                //         return false
                //     } else {
                //         return true
                //     }
                // }}
            />
        // </View>
    )
}

export default CustomerSupportScreen