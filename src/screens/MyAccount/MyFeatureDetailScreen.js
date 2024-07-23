import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Animated, View, ScrollView, SafeAreaView, TextInput } from 'react-native'
import { nf, wp, hp } from '../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from './index'
import { useSelector } from 'react-redux';

import { CustomButton1 } from '../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../components/common/CustomButtonOutlined';

import Star from '../../assets/svg/star-fill.svg'


export default function MyFeatureDetailScreen({ route, navigation }) {
    const {feature} = route.params
    const [hidePass, setHidePass] = useState(true)

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, backgroundColor: Colors.white }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <FeatureDetailContent type={feature} onPressContact={() => navigation.navigate('CustomerSupportScreen')} />
                    </View>
                    <View style={{height: hp(5), marginBottom:'auto'}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}


const FeatureDetailContent = (props) => {
    const { type, onPressContact } = props;

    return (
        <>
            <View style={{ marginBottom:30, alignItems:'center'}}>
                <Image resizeMode='contain' style={{ height: 69, width: 191, alignSelf: 'center', marginBottom: 14 }} source={Images.animalAiLogo} />
                <Text style={[Fonts.h3, { marginBottom: 14 }]}>{type == 'estrus_alert' ? 'Estrus Alert' : type == 'bunkline_reading' ? 'Bunkline Reading' : 'Coming Soon'}</Text>
                <CustomButton1
                    onPress={onPressContact}
                    title="Contact us to request feature"
                    style={{ width: '100%' }}
                />
            </View>
            <View tyle={{ marginTop: 12}}>
                <Text style={[Fonts.h4, { marginBottom: 12 }]}>Description</Text>
                <Text style={[Fonts.bodySmall, { marginBottom: 30 }]}>
                    {
                        type == 'estrus_alert' ?
                            'Observation is key to recognizing the signs of heat, yet 50% of heat detection is missed via manual observation. This is why Estrus Alert is designed specifically to monitor the visual and behavioral signs of the oestrus cycle. Djurvakt Estrus Alert is a comprehensive solution designed to improve reproduction results and increase labor efficiency in your livestock farming operations.The best part? Estrus Alert is 100% optical-based computer vision technology, meaning no uncomfortable collars or bracelets required.'
                            :
                        type == 'bunkline_reading' ?
                            'Have the ultimate control over your cattle’s feed intake with Bunkline Reading. Determining optimal feed utilization is essential for ensuring the health and wellbeing of farm animals. Changes in feed consumption can be an early indication of underlying health issues such as ketosis and rumen acidosis, which can be costly and painful if not addressed. Djurvakt Bunkline Reading keeps consistent detailed records of bunkline levels as well as the frequency of feed intake by your animals to prevent wastage and ensuring optimal nutrition for the cows.'
                            :
                            '-'
                    }
                </Text>                
            </View>
            <FeatureBenefit
                title={
                    type == 'estrus_alert' ?
                        'Precise Individual Monitoring and Improved Reproduction Results'
                        :
                    type == 'bunkline_reading' ?
                        'Efficient Feed and Labor Management'
                        :
                        'Calving Alert: "Perfect Timing for Every Birth"'
                }
                desc={
                    type == 'estrus_alert' ?
                        `Our system provides round-the-clock monitoring, ensuring you're notified at the optimal time when your cattle are most fertile. Additionally, Djurvakt Estrus Alert helps you identify non-cycling and irregular-cycling cows, allowing for targeted intervention and management.`
                        :
                    type == 'bunkline_reading' ?
                        'By tracking feed consumption patterns, the system allows for early detection of health issues, ensuring timely veterinary intervention. It also helps optimize Dry Matter Intake, a key factor in milk production. This not only improves animal welfare but also enhances milk yield, contributing to overall farm profitability.'
                        :
                        '-'
                }
            />
            <FeatureBenefit
                title={
                    type == 'estrus_alert' ?
                        '24/7 Monitoring and Exception Management'
                        :
                    type == 'bunkline_reading' ?
                        'Improved Animal Health and Milk Production'
                        :
                        'Improved Animal Health and Milk Production'
                }
                desc={
                    type == 'estrus_alert' ?
                        `Our system provides round-the-clock monitoring, ensuring you're notified at the optimal time when your cattle are most fertile. Additionally, Djurvakt Estrus Alert helps you identify non-cycling and irregular-cycling cows, allowing for targeted intervention and management.`
                        :
                    type == 'bunkline_reading' ?
                        'By tracking feed consumption patterns, the system allows for early detection of health issues, ensuring timely veterinary intervention. It also helps optimize Dry Matter Intake, a key factor in milk production. This not only improves animal welfare but also enhances milk yield, contributing to overall farm profitability.'
                        :
                        '-'
                }
            />
            <FeatureBenefit
                title={
                    type == 'estrus_alert' ?
                        'Customizable Dashboard and Notifications'
                        :
                    type == 'bunkline_reading' ?
                        'Customized Notifications and Cost Savings'
                        :
                        'Health Monitoring: "Exceptional Care for Exceptional Cows"'
                }
                desc={
                    type == 'estrus_alert' ?
                        `Tailor your profile to your farm management preferences. Choose how frequently you want to receive updates on your animals' activity and select your preferred notification method. With Djurvakt Estrus Alert, you gain a powerful tool that enhances efficiency and contributes to the sustainability and profitability of your farming operations.`
                        :
                    type == 'bunkline_reading' ?
                        `Tailor your alerts to your preferences, choosing the frequency and method of updates on your animals' activity. The system is not only user-friendly but also cost-effective, paying for itself in a short time due to improved animal health management, increased milk production, and reduced treatment costs.`
                        :
                        '-'
                }
            />
            <View style={{height: hp(10),marginBottom: 'auto'}} />
        </>
    );
}

const FeatureBenefit = (props) => {
    const { title, desc } = props

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <View style={{marginRight:22, marginTop:10}}>
                <Star width={30} height={30} />
            </View>
            <View style={{flex:2}}>
                <Text style={[Fonts.h5, { marginBottom: 12 }]}>{title}</Text>
                <Text style={[Fonts.bodySmall, { marginBottom: 12 }]}>{desc}</Text>                
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