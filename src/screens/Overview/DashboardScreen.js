import * as React from 'react';
import { View, useWindowDimensions, SafeAreaView, StatusBar, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { CustomButton1 } from '../../components/common/CustomButton';
import { Colors, Fonts } from '../../constants'
import { nf, wp, hp, sw, sh } from '../../utils/utility'
import { EstrusOverviewScreen, OtherFeatureScreen } from './index'

import Modal from "react-native-modalbox"

import ExclamationMark from '../../assets/svg/exclamation-mark.svg'
import SupportIcon from '../../assets/svg/support-icon.svg'

const FirstRoute = () => (
    <EstrusOverviewScreen />
);

const SecondRoute = () => (
    <OtherFeatureScreen />
);

const ThirdRoute = () => (
    <OtherFeatureScreen />
);

const FourthRoute = () => (
    <OtherFeatureScreen />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  fourth: FourthRoute
});

export default function DashboardScreen({ navigation }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Estrus' },
    { key: 'second', title: 'Feature 2' },
    { key: 'third', title: 'Feature 3' },
    { key: 'fourth', title: 'Feature 4' },
  ]);
  const [estrusAlertModalShown, setEstrusAlertModalShown] = React.useState(false);
  
  React.useEffect(() => {
    setEstrusAlertModalShown(true)
  }, []);

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
        <View style={{flexDirection: 'row'}}>
            {props.navigationState.routes.map((route, i) => {
                const opacity = props.position.interpolate({
                    inputRange,
                    outputRange: inputRange.map((inputIndex) =>
                        inputIndex === i ? 1 : 0.5
                    ),
                });
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        key={i}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 33,
                            paddingTop: 6,
                            backgroundColor: Colors.orange40
                            // padding: wp(3)
                        }}
                        onPress={() => setIndex(i)}>
                        <Animated.Text style={[Fonts.button,{ color: Colors.orange, opacity }]}>{route.title}</Animated.Text>
                        {index === i && <View style={{flex: 1, width: 72, borderBottomWidth: 2, borderColor: Colors.orange }} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
  };
    
  return (
    <SafeAreaView style={{flex:1, backgroundColor: Colors.orange40}}>
        <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.orange40}
        />
        <View style={{marginTop:40}} />
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={_renderTabBar}
        />
        <EstrusBottomNav onPressSupport={() => navigation.navigate('CustomerSupportScreen')} />
        {
            estrusAlertModalShown &&
            <Modal
                entry="center"
                position={"center"}
                backdropPressToClose={true}
                swipeToClose={false}
                coverScreen={true}
                style={{
                    overflow: "hidden",
                    justifyContent: 'center',
                    alignItems:'center',
                    height: sh,
                    width: sw,
                    backgroundColor: "transparent"
                }}
                isOpen={estrusAlertModalShown}
                onClosed={() => setEstrusAlertModalShown(false)}
            >
                {
                    <EstrusAlertModal onPressCheck={() => setEstrusAlertModalShown(false)} />
                }
            </Modal>
        }
    </SafeAreaView>
  );
}


const EstrusAlertModal = (props) => { 
    const { onPressCheck } = props

    return (
        <View style={{
            width: '80%',
            height: hp(40),
            backgroundColor: Colors.white,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems:'center'
        }}>
            
            <View style={{width:'90%', alignSelf:'center', alignItems:'center'}}>
                <View style={{ alignSelf:'center', width:80, height: 80, borderRadius: 40, marginBottom: 20, backgroundColor: Colors.orange40, alignItems:'center', justifyContent:'center'}}>
                    <ExclamationMark width={38} height={38}/>
                </View>
                <Text style={[Fonts.h2, { textAlign: 'center', marginBottom: 20 }]}>Estrus Alert</Text>
                <Text style={[Fonts.bodyLarge, { textAlign: 'center', marginBottom: 20 }]}>6 cows have a high score</Text>
                <CustomButton1 title="Check report" onPress={onPressCheck} style={{width: '40%'}}  />
            </View>
        </View>
    )
} 


const EstrusBottomNav = (props) => {
    const { onPressSupport } = props;
    
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
                    paddingVertical:16,
                    // paddingHorizontal: 20,
                    // backgroundColor: Colors.white,
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>
                    <View style={{ width: '75%' }} />
                    <TouchableOpacity onPress={onPressSupport}>
                        <SupportIcon width={60} height={67} />
                    </TouchableOpacity>
                </View >
            </View>
        </View>
    )
}