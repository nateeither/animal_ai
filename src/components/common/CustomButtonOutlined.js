import React, { memo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Icons, Fonts, wp, hp, nf } from '../../constants';

//normal button
const CustomButtonOutlinedNormal = (props) => {
    const { title, style = {}, textStyle = {}, onPress, disabled, loading = false } = props;

    return (

        <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.button, ...style, opacity: disabled ? 0.3 : 1 }}>
            {loading ?
                <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    size="small"
                    color={Colors.white} /> :
                <>
                    <Text style={[Fonts.button, styles.orangeColoredText, textStyle]}>{title}</Text>
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButtonOutlined1 = memo(CustomButtonOutlinedNormal)

//button with left icon
const CustomButtonOutlinedWithLeftIcon = (props) => {
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
                    <Text style={[Fonts.button, styles.orangeColoredText, textStyle, {marginLeft:8}]}>{title}</Text>
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButtonOutlined2 = memo(CustomButtonOutlinedWithLeftIcon)


//button with right icon
const CustomButtonOutlinedWithRightIcon = (props) => {
    const { title, style = {}, textStyle = {}, onPress, image, disabled, loading = false} = props;

    return (

        <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.button, ...style, flexDirection:'row', opacity: disabled ? 0.3 : 1 }}>
            {loading ?
                <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    size="small"
                    color={Colors.white} /> :
                <>
                    <Text style={[Fonts.button, styles.orangeColoredText, textStyle]}>{title}</Text>
                    <Image resizeMode='contain' style={{ height: 12, width: 12, marginLeft: 12, ...imageStyle }} source={image} />
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButtonOutlined3 = memo(CustomButtonOutlinedWithRightIcon)



//button with right icon & left icon
const CustomButtonOutlinedCombinedIcon = (props) => {
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
                    <Text style={[Fonts.button, styles.orangeColoredText, textStyle]}>{title}</Text>
                    <Image resizeMode='contain' style={{ height: 12, width: 12, marginLeft: 12, ...imageStyle }} source={rightImage} />
                </>
            }
        </TouchableOpacity>

    );
};
export const CustomButtonOutlined4 = memo(CustomButtonOutlinedCombinedIcon)



const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.orange,
        borderRadius: 5, height: 40, justifyContent: 'center', alignItems: 'center',
    },
    orangeColoredText: {
        color: Colors.orange,
    },
})