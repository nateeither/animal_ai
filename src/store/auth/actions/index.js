import {
    AuthTypes,
  } from '../types';
  
  export function signIn(
    currentUser
  ) {
    return {
      type: AuthTypes.SIGNIN,
      payload: currentUser,
    };
  }

  export function signOut(
  ) {
    return {
      type: AuthTypes.SIGNOUT,
    };
  }

  export function signUp(
    uid
  ) {
    return {
      type: AuthTypes.SIGNUP,
      payload: uid,
    };
  }

  export function resetSignupId(
  ) {
    return {
      type: AuthTypes.RESET_SIGNUP_ID,
    };
  }


  export function requestSignInEmailPassword(
    email, password
  ) {
    return {
      type: AuthTypes.REQUEST_SIGNIN_EMAIL_PASSWORD,
      payload: email,password
    };
  }

  export function requestSignUpEmailPassword(
    email, password
  ) {
    return {
      type: AuthTypes.REQUEST_SIGNUP_EMAIL_PASSWORD,
      payload: email,password
    };
  }

  export function authError(error) {
    return {
      type: AuthTypes.AUTH_ERROR,
      payload: error,
    };
  }

  export function requestGetCurrentUser(
    uid
  ) {
    return {
      type: AuthTypes.REQUEST_GET_CURRENT_USER,
      payload: uid
    };
  }

  export function successGetCurrentUser(
    currUser
  ) {
    return {
      type: AuthTypes.SUCCESS_GET_CURRENT_USER,
      payload: currUser
    };
  }

  export function resetSuccessGetCurrentUser(
  ) {
    return {
      type: AuthTypes.RESET_SUCCESS_GET_CURRENT_USER,
    };
  }