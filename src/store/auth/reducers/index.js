import produce from 'immer';
import { Reducer } from 'redux';

import { AuthTypes } from '../types';

const initialState = {
    isLogged: false,
    isLoading: false,
    successGetCurrUser: false,
    email: '',
    currentUser: undefined,
    error: undefined,
    signUpUid: undefined,
};

const authReducer = (state = initialState, action) => {
    return produce(state, draft => {
      switch (action.type) {
        case AuthTypes.SIGNIN: {
          draft.isLogged = true;
          draft.isLoading = false;
          draft.error = undefined;
          draft.currentUser = action.payload;
          draft.email = action.payload.email;
          break;
        }
        case AuthTypes.SIGNOUT: {
          draft.isLogged = false;
          draft.isLoading = false;
          draft.error = undefined;
          draft.currentUser = false;
          draft.email = '';
          break;
        }
        case AuthTypes.SIGNUP: {
          draft.isLoading = false;
          draft.error = undefined;
          draft.signUpUid = action.payload;
          break;
        }
        case AuthTypes.RESET_SIGNUP_ID: {
          draft.signUpUid = undefined;
          break;
        }
        case AuthTypes.AUTH_ERROR: {
          draft.isLoading = false;
          draft.error = action.payload;
          break;
        }
        case AuthTypes.REQUEST_SIGNIN_EMAIL_PASSWORD: {
          draft.isLoading = true;
          draft.error = undefined;
          break;
        }
        case AuthTypes.REQUEST_SIGNUP_EMAIL_PASSWORD: {
          draft.isLoading = true;
          draft.error = undefined;
          break;
        }
        case AuthTypes.REQUEST_GET_CURRENT_USER: {
          draft.currentUser = undefined;
          draft.isLoading = true;
          draft.error = undefined;
          draft.successGetCurrUser = false;
          break;
        }
        case AuthTypes.SUCCESS_GET_CURRENT_USER: {
          draft.isLoading = false;
          draft.error = undefined;
          draft.successGetCurrUser = true;
          draft.currentUser = action.payload;
          draft.email = action.payload.email;
          break;
        }
        case AuthTypes.RESET_SUCCESS_GET_CURRENT_USER: {
          draft.successGetCurrUser = false;
          break;
        }
        default: {
          return draft;
        }
      }
    });
  };
  
  export {authReducer};