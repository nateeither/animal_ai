import produce from 'immer';
import { Reducer } from 'redux';

import { UserTypes } from '../types';


const initialState = {
    getUsersLoading: false,
    users: [],
    getUsersError: undefined,
    successGetUsers: false,
    
    createUserLoading: false,
    createUserError : undefined,
    
    updateUserLoading: false,
    updateUserError : undefined,
    updateUserSuccess: false,
    
    updateGeneralInfoLoading: false,
    updateGeneralInfoError : undefined,
    updateGeneralInfoSuccess: false,
    
    createNewUserSuccess: false,
    
    getFarmDataLoading: false,
    farmData: undefined,
    getFarmDataError: undefined,
    
    noUsersCollection: false,
};

const userReducer = (state = initialState, action) => {
    return produce(state, draft => {
      switch (action.type) {
        case UserTypes.SUCCESS_GET_USERS: {
          draft.getUsersLoading = false;
          draft.getUsersError = undefined;
          draft.users = action.payload;
          draft.successGetUsers = true;
          break;
        }
        case UserTypes.REQUEST_GET_USERS: {
          draft.getUsersLoading = true;
          draft.getUsersError = undefined;
          break;
        }
        case UserTypes.GET_USERS_ERROR: {
          draft.getUsersLoading = false;
          draft.getUsersError = action.undefined;
          break;
        }
        case UserTypes.RESET_SUCCESS_GET_USERS: {
          draft.successGetUsers = false;
          break;
        }
        case UserTypes.SUCCESS_CREATE_NEW_USER: {
          draft.createUserLoading = false;
          draft.createUserError = undefined;
          draft.createNewUserSuccess = true;
          break;
        }
        case UserTypes.RESET_SUCCESS_CREATE_NEW_USER: {
          draft.createNewUserSuccess = false;
          break;
        }
        case UserTypes.REQUEST_CREATE_NEW_USER: {
          draft.createUserLoading = true;
          draft.createUserError = undefined;
          break;
        }
        case UserTypes.CREATE_NEW_USER_ERROR: {
          draft.createUserLoading = false;
          draft.createUserError = action.undefined;
          break;
        }
        case UserTypes.REQUEST_CREATE_NEW_FARM_USER: {
          draft.createUserLoading = true;
          draft.createUserError = undefined;
          break;
        }
        case UserTypes.CREATE_NEW_FARM_USER_ERROR: {
          draft.createUserLoading = false;
          draft.createUserError = action.undefined;
          break;
        }
        case UserTypes.REQUEST_UPDATE_USER_DATA: {
          draft.updateUserLoading = true;
          draft.updateUserSuccess = false;
          draft.updateUserError = undefined;
          break;
        }
        case UserTypes.SUCCESS_UPDATE_USER_DATA: {
          draft.updateUserLoading = false;
          draft.updateUserError = undefined;
          draft.updateUserSuccess = true;
          break;
        }
        case UserTypes.RESET_SUCCESS_UPDATE_USER_DATA: {
          draft.updateUserSuccess = false;
          break;
        }
        case UserTypes.UPDATE_USER_DATA_ERROR: {
          draft.updateUserLoading = false;
          draft.updateUserSuccess = false;
          draft.updateUserError = action.undefined;
          break;
        }
        case UserTypes.REQUEST_UPDATE_FARM_USER_DATA: {
          draft.updateUserLoading = true;
          draft.updateUserSuccess = false;
          draft.updateUserError = undefined;
          break;
        }
        case UserTypes.UPDATE_FARM_USER_DATA_ERROR: {
          draft.updateUserLoading = false;
          draft.updateUserSuccess = false;
          draft.updateUserError = action.undefined;
          break;
        }
        case UserTypes.SUCCESS_GET_FARM_DATA: {
          draft.getFarmDataLoading = false;
          draft.getFarmDataError = undefined;
          draft.farmData = action.payload;
          break;
        }
        case UserTypes.REQUEST_GET_FARM_DATA: {
          draft.getFarmDataLoading = true;
          draft.getFarmDataError = undefined;
          break;
        }
        case UserTypes.GET_FARM_DATA_ERROR: {
          draft.getFarmDataLoading = false;
          draft.getFarmDataError = action.undefined;
          break;
        }
        case UserTypes.REQUEST_UPDATE_GENERAL_INFO: {
          draft.updateGeneralInfoLoading = true;
          draft.updateGeneralInfoSuccess = false;
          draft.updateGeneralInfoError = undefined;
          break;
        }
        case UserTypes.SUCCESS_UPDATE_GENERAL_INFO: {
          draft.updateGeneralInfoLoading = false;
          draft.updateGeneralInfoError = undefined;
          draft.updateGeneralInfoSuccess = true;
          break;
        }
        case UserTypes.RESET_SUCCESS_UPDATE_GENERAL_INFO: {
          draft.updateGeneralInfoSuccess = false;
          break;
        }
        case UserTypes.UPDATE_GENERAL_INFO_ERROR: {
          draft.updateGeneralInfoLoading = false;
          draft.updateGeneralInfoSuccess = false;
          draft.updateGeneralInfoError = action.undefined;
          break;
        }
        case UserTypes.NO_USERS_COLLECTION: {
          draft.getUsersLoading = false;
          draft.getUsersError = undefined;
          draft.users = [];
          draft.noUsersCollection = action.payload;
          break;
        }
        default: {
          return draft;
        }
      }
    });
  };
  
  export {userReducer};