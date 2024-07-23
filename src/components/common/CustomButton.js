import React, { memo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Icons, Fonts, wp, hp, nf } from '../../constants';

//normal button
const CustomButtonNormal = (props) => {
    const { title, style = {}, textStyle = {}, onPress, disabled, initDisable, loading = false } = props;

    return (

        <TouchableOpacity disabled={initDisable? initDisable : disabled} onPress={onPress} style={{ ...styles.button, ...style, opacity: disabled ? 0.3 : 1, backgroundColor: initDisable ? Colors.neutral40 : Colors.orange }}>
            {loading ?
                <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    size="small"
                    color={Colors.white} /> :
                <>
                    <Text style={[Fonts.button, initDisable? styles.fadedBlackColoredText : styles.whiteColoredText, textStyle]}>{title}</Text>
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButton1 = memo(CustomButtonNormal)

//button with left icon
const CustomButtonWithLeftIcon = (props) => {
    const { title, style = {}, textStyle = {}, onPress, svgIcon, disabled, loading = false} = props;

    return (

        <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.button, ...style, flexDirection:'row', opacity: disabled ? 0.3 : 1 }}>
            {loading ?
                <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    size="small"
                    color={Colors.white} /> :
                <>
                   {svgIcon}
                    <Text style={[Fonts.button, styles.whiteColoredText, textStyle, {marginLeft:8}]}>{title}</Text>
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButton2 = memo(CustomButtonWithLeftIcon)


//button with right icon
const CustomButtonWithRightIcon = (props) => {
    const { title, style = {}, textStyle = {}, onPress, image, disabled, loading = false} = props;

    return (

        <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.button, ...style, flexDirection:'row', opacity: disabled ? 0.3 : 1 }}>
            {loading ?
                <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    size="small"
                    color={Colors.white} /> :
                <>
                    <Text style={[Fonts.button, styles.whiteColoredText, textStyle]}>{title}</Text>
                    <Image resizeMode='contain' style={{ height: 12, width: 12, marginLeft: 12, ...imageStyle }} source={image} />
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButton3 = memo(CustomButtonWithRightIcon)



//button with right icon & left icon
const CustomButtonCombinedIcon = (props) => {
    const { title, style = {}, textStyle = {}, onPress, leftImage, rightImage, disabled, loading = false} = props;

    return (

        <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.button, ...style, flexDirection:'row', opacity: disabled ? 0.3 : 1 }}>
            {loading ?
                <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    size="small"
                    color={Colors.white} /> :
                <>
                    <Image resizeMode='contain' style={{ height: 12, width: 12, marginLeft: 11, ...imageStyle }} source={leftImage} />
                    <Text style={[Fonts.button, textStyle]}>{title}</Text>
                    <Image resizeMode='contain' style={{ height: 12, width: 12, marginLeft: 12, ...imageStyle }} source={rightImage} />
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButton4 = memo(CustomButtonCombinedIcon)



const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: Colors.orange,
        borderRadius: 5, height: 40, justifyContent: 'center', alignItems: 'center',
    },
    whiteColoredText: {
        color: Colors.white,
    },
    fadedBlackColoredText: {
        color: Colors.neutral80,
    },
})