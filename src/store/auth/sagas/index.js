import { takeLatest, put, call, select } from 'redux-saga/effects';

import { authError, signIn, signUp, successGetCurrentUser } from '../actions';

import {
  signInWithEmailPasswordFirebase,
  signUpWithEmailPasswordFirebase,
  getCurrentUserFirebase
  } from '../repository';

import {
    AuthTypes,
} from '../types';
  
export function* requestSignInEmailPasswordSaga(
  props
) {
  const email = props.payload.email;
  const password = props.payload.password;
  
    try {
      if (email && password) {
        const userCredentials = yield call( 
          signInWithEmailPasswordFirebase,
          email,
          password,
        );

        console.log('user sign in sagas: ', userCredentials)

        if (userCredentials._user) {
          let currentUser = yield call(
            getCurrentUserFirebase,
            userCredentials._user.uid,
          );

          if (!currentUser.uid && !currentUser.email) {
            currentUser = {
              ...currentUser, uid :  userCredentials._user.uid, email:  userCredentials._user.email
            }
          }

          console.log('curr user sagas: ', currentUser)

          yield put(signIn(currentUser));
        }
        else {
          yield put(authError(userCredentials))
        }
  
      }
     
    } catch (err) {
      console.log(err)
      yield put(authError('try_again'));
    }
}

  
export function* requestSignUpEmailPasswordSaga(
  props
) {
  const email = props.payload.email;
  const password = props.payload.password;
  
    try {
      if (email && password) {
        const userCredentials = yield call( 
          signUpWithEmailPasswordFirebase,
          email,
          password,
        );

        if (userCredentials.user) {
          yield put(signUp(userCredentials.user.uid));
        }
        else {
          yield put(authError(userCredentials));
        }

        // console.log('user sign up sagas: ', userCredentials)

      }
     
    } catch (err) {
      console.log(err)
      yield put(authError('try_again'));
    }
}

export function* requestGetCurrentUserSaga(
  props
) {
  const uid = props.payload
    console.log('uid : ', uid)
    try {
      if (uid) {
        const currentUser = yield call(
          getCurrentUserFirebase,
          uid,
        );

        console.log('get curr user sagas: ', currentUser)

        yield put(successGetCurrentUser(currentUser));
      }
     
    } catch (err) {
      console.log(err)
      yield put(authError('try_again'));
    }
}

  
export default [
  takeLatest(
    AuthTypes.REQUEST_SIGNIN_EMAIL_PASSWORD,
    requestSignInEmailPasswordSaga,
  ),
  takeLatest(
    AuthTypes.REQUEST_SIGNUP_EMAIL_PASSWORD,
    requestSignUpEmailPasswordSaga,
  ),
  takeLatest(
    AuthTypes.REQUEST_GET_CURRENT_USER,
    requestGetCurrentUserSaga,
  )
];