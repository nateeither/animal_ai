import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviceUrl } from '../constants/Api';
import NavigatorService from '../routing/NavigationService';
import { Dimensions, PixelRatio, Platform } from 'react-native';

exports.apiCall = async function (url, body, method, token = null) {
    if (!token) {
        token = await AsyncStorage.getItem("access-token")
    }
    // console.log('timezone : ', (-1 * ((new Date()).getTimezoneOffset())).toString())
    return fetch(url, {
        method: method,
        headers: !token ? //anonymous apis
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                // 'client_secret': "2B4D6251655468576D5A7134743777217A25432646294A404E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226"
            }
            :
            {      // logged in user
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': `${token}`,
                // 'timezone': (-1 * ((new Date()).getTimezoneOffset())).toString()
            },
        body: body ? JSON.stringify(body) : null,
    })
        .then((response) => {
            // console.log('response util : ', response);
            return new Promise(function (resolve, reject) {
                response.json().then(responseParsed => {
                    // console.log('response util : ', responseParsed);
                    if (response.status == 200 || response.status == 201 || response.status == 204) {               // success
                        resolve({ status: true, result: responseParsed })

                    } else if (response.status == 401 || response.status == 409) {             // access token unauthorised
                        // // BY CALLBACK
                        // exports.apiCallForRefreshToken(function () {
                        //     resolve(exports.apiCall(url, body, method))
                        // })
                        // BY PROMISE
                        // Snackbar.show({ title: "Unable to process", duration: Snackbar.LENGTH_LONG });  
                        resolve({ status: false, result: responseParsed })
                    } else {
                        resolve({ status: false, result: responseParsed })                                         // failed
                        // resolve(response.json())
                    }
                })

            })
        })
        .catch((err) => {

            // alert('yay')
            //  console.log("error at utility in function apiCall at catch: " + err)
            showSnackbar('Something went wrong, please check your network.')
            // Snackbar.show({ text: "Something went wrong", duration: Snackbar.LENGTH_LONG });
        })
}

// to refresh token by calling api BY PROMISE
exports.apiCallForRefreshToken = async function () {
    await AsyncStorage.removeItem("accessToken")
    var refreshToken = await AsyncStorage.getItem("refreshToken")
    return new Promise(function (resolve, reject) {
        resolve(exports.apiCall(`${serviceUrl.local}refresh-token`, { token: refreshToken }, "POST")
            .then(function (response) {
                if (response.status) {
                    // Snackbar.show({ title: "Refreshed Token", duration: Snackbar.LENGTH_LONG });   
                    // success
                    AsyncStorage.setItem('accessToken', response.result.accessToken).then(_ => {
                        AsyncStorage.setItem('refreshToken', response.result.refreshToken).then(_ => {
                            return false;
                        })
                    })
                } else {                                                                // logout
                    //   Snackbar.show({ title: "Multiple sign in", duration: Snackbar.LENGTH_LONG });  
                    AsyncStorage.removeItem("accessToken").catch(err => {
                        // console.log("can ot be removed due to",err)
                    })
                    AsyncStorage.removeItem("refreshToken").catch(err => {
                        // console.log("can ot be removed due to",err)
                    })
                    NavigatorService.navigate('login');
                    return true
                }
            })
            .catch(function (error) {
                // console.log("Error at utility in function3: apiCallForRefreshToken" + error)
                return { error: true, errorMessage: error }
            })
        )
    })
}


// Multipart Api call
exports.multipartApi = async function (url, body, method) {
    let token;
    token = await AsyncStorage.getItem("accessToken")
    // console.log('utility data : ', url)
    // console.log('utility data : ', body)
    // console.log('utility data : ', token)
    // if(Platform.OS=="ios"){
    return fetch(url, {
        method: method,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            // 'access_token': `${token}`,
            'client_secret': "2B4D6251655468576D5A7134743777217A25432646294A404E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226"
        },
        body: body,
    })
        .then((response) => {
            return new Promise(function (resolve, reject) {
                if (response.status == 200 || response.status == 201 || response.status == 204) {               // success
                    resolve(response.json())
                } else if (response.status == 401) {             // access token unauthorised
                    resolve(response.json())
                } else {                                                                // failed
                    resolve(response.json())
                }
            })
        }).catch((err) => {
            console.log("error : " + err)
        })

}



export const getDeepLink = (path = "") => {
    const scheme = 'engarde'
    const prefix = `${scheme}`
    return prefix + path
}


const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

//FONT SCALING
//Usage: nf(16)
const scale = SCREEN_WIDTH / 375;
const normalizeFont = (size) => {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}


//DYNAMIC DIMENSION CONSTANTS   
//Usage: wp(5), hp(20)
const widthPercentageToDP = widthPercent => {
    // Convert string input to decimal number
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(SCREEN_WIDTH * elemWidth / 100);
};
const heightPercentageToDP = heightPercent => {
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(SCREEN_HEIGHT * elemHeight / 100);
};

export {
    SCREEN_WIDTH as sw,
    SCREEN_HEIGHT as sh,
    normalizeFont as nf,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
};