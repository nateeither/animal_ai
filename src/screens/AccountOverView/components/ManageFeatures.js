import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, View, useWindowDimensions, TextInput, SafeAreaView, StatusBar , Switch} from 'react-native'
import { nf, wp, hp, sw, sh } from '../../../utils/utility'
import { Colors, Fonts, Icons, Images } from '../../../constants'
import { OverviewProfile, HistoryProfile, AccountProfile } from '../index'

import { CustomButton1 } from '../../../components/common/CustomButton';
import { CustomButtonOutlined1 } from '../../../components/common/CustomButtonOutlined';

// import Auth, { AuthEventEmitter, AuthEvents } from 'react-native-firebaseui-auth';
import { ScrollView } from 'react-native-gesture-handler';

import {
    changeProgressIndex,
  } from '../../../store/account_overview/actions';


import { useDispatch, useSelector, shallowEqual } from 'react-redux';

//SVG
import Back from '../../../assets/svg/arrow-left.svg'
import Star from '../../../assets/svg/star-fill.svg'


export default function ManageFeatures({ navigation }) {
    const dispatch = useDispatch();

    const [seeDetail, setSeeDetail] = useState(false)
    const [type, setType] = useState('')

    // function onChangeProgressIdx (idx) {    
    //     dispatch({
    //         type: types.CHANGE_PROGRESS_BAR_INDEX,
    //         payload: idx
    //     })
    // }

    function onChangeProgressIdx(idx) {
        dispatch(changeProgressIndex(idx));
    }

    return (
        <>
            {
                seeDetail && 
                <TouchableOpacity
                    onPress={()=> setSeeDetail(false)}
                    style={{ width: '90%', height: 48, backgroundColor: Colors.white, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{alignSelf:'center',marginRight:14}}>
                        <Back width={16} height={16} />
                    </View>
                    <Text style={[Fonts.bodyLarge, {color: Colors.orange, textAlign:'center'}]}>{type == 'estrus_alert' ? 'Estrus Alert' : type == 'bunkline_reading' ? 'Bunkline Reading' : 'Coming Soon'}</Text>
                </TouchableOpacity>
            }
           
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {
                        seeDetail ?
                            <FeatureDetailContent type={type} onPressContact={() => navigation.navigate('CustomerSupportScreen')} />
                            :
                            <ManageFeaturesContent onPressLearnMore={(feature) =>{ setType(feature), setSeeDetail(true)}} />
                    } 
                </View>
            </ScrollView>
            <FeatureBottomNav onPressBack={()=> onChangeProgressIdx(2)} onPressSkip={()=> onChangeProgressIdx(4)} />
        </>
    )
}

const ManageFeaturesContent = (props) => {
    const { onPressLearnMore} = props;

    return (
        <>
            <View style={{marginVertical:20}}>
                <Text style={[Fonts.h4, { marginBottom: 12 }]}>Manage features</Text>
                <Text style={[Fonts.bodySmall, {marginBottom:12}]}>Managing the needs of hundreds of cattle is no easy task. Aided by advanced computer vision technology, Djurvakt monitors all members of your herd so you’re alerted each and every time there is important activity. Here you can find the services you currently work with and have a glimpse of upcoming features.</Text>
            </View>
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
                desc="Track your cow’s progress from the first moment with Calving Alert, Growth Monitoring and more!"
                onPressLearn={() => onPressLearnMore('coming_soon')}
            />
            <View style={{height: hp(10),marginBottom: 'auto'}} />
        </>
    );
}

const FeatureDetailContent = (props) => {
    const { type, onPressContact } = props;

    return (
        <>
            <View style={{ marginTop: 20, marginBottom:20, alignItems:'center'}}>
                <Image resizeMode='contain' style={{ height: 69, width: 191, alignSelf: 'center', marginBottom: 12 }} source={Images.animalAiLogo} />
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
};

const FeatureBenefit = (props) => {
    const { title, desc } = props

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <View style={{marginRight:22, marginTop:10}}>
                <Star width={34} height={34} />
            </View>
            <View style={{flex:2}}>
                <Text style={[Fonts.h5, { marginBottom: 12 }]}>{title}</Text>
                <Text style={[Fonts.bodySmall, { marginBottom: 12 }]}>Add short description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ultrices magna. Donec sodales, leo eu max</Text>                
            </View>
        </View>
    )
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


const FeatureBottomNav = (props) => {
    const { onPressBack, onPressSkip } = props;
    
    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            // paddingBottom: 20,
        }}>
            <View style={{
                    height: '100%',
                    justifyContent:'center'
            }}>
                <View style={{
                    width: '90%',
                    alignSelf:'center',
                    paddingVertical:25,
                    // paddingHorizontal: 20,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <CustomButtonOutlined1 title="Back" onPress={onPressBack} style={{width:'48.5%'}} />
                    <CustomButton1 title="Skip" onPress={onPressSkip} style={{width:'48.5%'}}  />
                </View >
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
        // textAlign: 'auto',
        paddingHorizontal: 20,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.orange60,
        borderRadius: 5 ,
        backgroundColor : Colors.white
    }
})