import React, { memo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Icons, Fonts, wp, hp, nf } from '../../../constants';

//normal button
const ProgressBarComp = (props) => {
    const { step = 1 } = props;

    return (
        <View style={{
            width: '100%',
            justifyContent:'flex-end',
            height: 126,
            backgroundColor: Colors.orange,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12
        }}>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginTop: 52
            }}>
                <View style={{ alignItems: 'center', width: 38, height: 76, position: 'relative', justifyContent:'space-between' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: Colors.white}}>
                        <Text style={[Fonts.captionRegular,{ color: Colors.orange }]}>1</Text>
                    </View>
                    <Text style={[Fonts.captionRegular, { color: Colors.white, textAlign: 'center', marginTop: 24, position: 'absolute', left: '-50%', right: '-50%' }]}>Manage Roles</Text>

                    { step == 1 && <View style={{  bottom:'auto',  width: 58, height: 4, backgroundColor: Colors.orange60, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />}
                </View>
                <View style={{ width: 56, marginTop: 10, borderBottomWidth: 1, borderColor: Colors.white }} />
                
                <View style={{alignItems:'center', width:38, height: 76,  position: 'relative', justifyContent:'space-between' }}>
                    <View style={{ width: 18, height: 18, borderRadius: 18 / 2, justifyContent: 'center', alignItems: 'center', backgroundColor: step >= 2 ? Colors.white : Colors.orange80 }}>
                        <Text style={[Fonts.captionRegular,{ color: Colors.orange }]}>2</Text>
                    </View>
                    <Text style={[Fonts.captionRegular,{color: step >= 2  ? Colors.white : Colors.orange80, textAlign: 'center', marginTop:24, position:'absolute', left: '-50%', right:'-50%' }]}>Upload herd information</Text>

                   { step == 2  &&  <View style={{  bottom:'auto',  width: 58, height: 4, backgroundColor: Colors.orange60, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />}
                </View>
                <View style={{ width: 56, marginTop: 10, borderBottomWidth: 1, borderColor: step >= 2 ? Colors.white : Colors.orange80 }} />
                
                <View style={{alignItems:'center', width:38, height: 76, position: 'relative', justifyContent:'space-between' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: step >= 3 ? Colors.white : Colors.orange80}}>
                        <Text style={[Fonts.captionRegular,{ color: Colors.orange }]}>3</Text>
                    </View>
                    <Text style={[Fonts.captionRegular, { color: step >= 3 ? Colors.white : Colors.orange80, textAlign: 'center', marginTop: 24, position: 'absolute', left: '-50%', right: '-50%' }]}>Manage features</Text>
                    
                   { step == 3 &&  <View style={{  bottom:'auto',  width: 58, height: 4, backgroundColor: Colors.orange60, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />}
                </View>
                <View style={{ width: 56, marginTop: 10, borderBottomWidth: 1, borderColor: step >= 3 ? Colors.white : Colors.orange80 }} />
                
                <View style={{alignItems:'center', width:38, height: 76, position: 'relative', justifyContent:'space-between' }}>
                    <View style={{width:18, height:18,borderRadius:18/2, justifyContent:'center',alignItems:'center',backgroundColor: step >= 4 ? Colors.white : Colors.orange80}}>
                        <Text style={[Fonts.captionRegular,{ color: Colors.orange }]}>4</Text>
                    </View>
                    <Text style={[Fonts.captionRegular, { color: step >= 4 ? Colors.white : Colors.orange80, textAlign: 'center', marginTop: 24, position: 'absolute', left: '-50%', right: '-50%' }]}>Manage notifications</Text>
                    
                   { step == 4 &&  <View style={{  bottom:'auto',  width: 58, height: 4, backgroundColor: Colors.orange60, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />}
                </View>
                
            </View>

        </View>

    );
};
export const ProgressBar = memo(ProgressBarComp)


const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: Colors.orange,
        borderRadius: 5, height: 40, justifyContent: 'center', alignItems: 'center',
    },
    whiteColoredText: {
        color: Colors.white,
    },
})