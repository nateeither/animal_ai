import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput, Switch, Touchable } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import CircleCheckBox from '../../assets/svg/circle-checkbox.svg'
import CircleCheckBoxFill from '../../assets/svg/circle-checkbox-fill.svg'

// Country SVG
import English from '../../assets/svg/languages/eng.svg'
import Swedish from '../../assets/svg/languages/swedish.svg'
import German from '../../assets/svg/languages/german.svg'
import Switzerland from '../../assets/svg/languages/switzerland.svg'

export default function LanguageSettingScreen({ navigation }) {
    const [selectedLang, setSelectedLang] = useState("english")

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <LanguageBar
                            selectedLang={selectedLang}
                            onPressChoose={() => setSelectedLang("english")}
                            title="English"
                            isDefault={true}
                            countryIcon={
                                <English width={25} height={25} />
                            }
                        />
                        <LanguageBar
                            selectedLang={selectedLang}
                            onPressChoose={() => setSelectedLang("swedish")}
                            title="Swedish"
                            countryIcon={
                                <Swedish width={25} height={25} />
                            }
                        />
                        <LanguageBar
                            selectedLang={selectedLang}
                            onPressChoose={() => setSelectedLang("german")}
                            title="German"
                            countryIcon={
                                <German width={25} height={25} />
                            }
                        />
                        {/* <LanguageBar
                            selectedLang={selectedLang}
                            onPressChoose={() => setSelectedLang("switzerland")}
                            title="Switzerland"
                            countryIcon={
                                <Switzerland width={25} height={25} />
                            }
                        /> */}
                    </View>
                    <View style={{height: hp(5), marginBottom:'auto'}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}


const LanguageBar = (props) => {
    const { selectedLang, onPressChoose, countryIcon, isDefault = false, title } = props;
    
    return (
        <TouchableOpacity
            onPress={onPressChoose}
            activeOpacity={0.5}
            style={{
            width:'100%', marginTop: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{ width: '100%', alignItems:'center', flexDirection:'row', paddingVertical: 16, paddingHorizontal: 16, backgroundColor: Colors.orange40, borderRadius: 8 }}>
                {
                    selectedLang == title.toLowerCase() ?
                        <CircleCheckBoxFill width={20} height={20} /> :
                        <CircleCheckBox width={20} height={20} />   
                }
                <View style={{ marginRight: 14 }} />
                {countryIcon}
                <View style={{ marginRight: 10 }} />
                <Text style={Fonts.bodyLarge}>{title} {isDefault ? "(Default)" : ""}</Text>
            </View>
        </TouchableOpacity>
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