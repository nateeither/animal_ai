import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';




export default function ManageFeatureScreen({ navigation }) {
    const [hidePass, setHidePass] = useState(true)

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <ManageFeaturesContent onPressLearnMore={(type) => navigation.navigate('MyFeatureDetailScreen', {feature: type})} />
                    </View>
                    <View style={{height: hp(5), marginBottom:'auto'}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}


const ManageFeaturesContent = (props) => {
    const { onPressLearnMore} = props;

    return (
        <>
            {/* <View style={{marginBottom:20}}>
                <Text style={[Fonts.h4, { marginBottom: 4 }]}>Hello Go Harvest!</Text>
                <Text style={[Fonts.bodyLarge, { marginBottom: 12 }]}>Thanks for being a our partner!</Text>
                <Text style={[Fonts.bodyLargeMedium, { marginBottom: 12 }]}>Estrus alert</Text>
                <Text style={Fonts.bodySmall}>You’re part of the Estrus alert. Only the farmer’s admin can make changes. To avoid losing benefits, renew your subscription</Text>
            </View> */}
            <View style={{marginTop:10}} />
            <FeatureCard
                title="Estrus alert"
                desc="Our AI technology monitors important behavioral signs that pinpoint when your cattle are going into heat. 24/7 observations track each cow on an individual level, so you are alerted when your cow is at optimal fertility for breeding."
                onPressLearn={() => onPressLearnMore('estrus_alert')}
            />
            <FeatureCard
                title="Bunkline reading"
                desc="Ineffective feed management is both costly and harmful to the environment. Effectively manage your cattle’s consumption and bunkline levels with Bunkline Reading. Bunkline reading streamlines feedlot operations by tracking how much feed is available, and when cattle are reaching in the bunkline at any point in the day."
                onPressLearn={() => onPressLearnMore('bunkline_reading')}
            />
            <FeatureCard
                title="Coming Soon…"
                desc="Add short description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ultrices magna. Donec sodales, leo eu maTrack your cow’s progress from the first moment with Calving Alert, Growth Monitoring and more!"
                onPressLearn={() => onPressLearnMore('coming_soon')}
            />
            <View style={{height: hp(10),marginBottom: 'auto'}} />
        </>
    );
}


const FeatureCard = (props) => { 
    const { title, desc, onPressLearn } = props

    return (
        <View style={{
            width:'100%',marginBottom: 20, alignSelf:'center', alignItems:'center'
        }}>
            <View style={{width:'100%', alignItems:'center', justifyContent:'center', padding:14, backgroundColor: Colors.orange40, borderRadius: 8}}>
                <View style={{alignItems:'flex-start'}}>
                    <Text style={[Fonts.h4, { marginBottom: 16 }]}>{title}</Text>
                    <Text style={[Fonts.bodySmall, { marginBottom: 16 }]}>{desc}</Text>
                </View>
                <CustomButton1
                    title="Learn more"
                    onPress={onPressLearn}
                    style={{ width: '50%' }}
                />
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