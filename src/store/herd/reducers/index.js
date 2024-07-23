import produce from 'immer';
import { Reducer } from 'redux';

import { HerdTypes } from '../types';

const initialState = {
    getHerdsLoading: false,
    herds: [],
    getHerdsError: undefined,
    
    addNewHerdLoading: false,
    addNewHerdSuccess: false,
    addNewHerdError: undefined,
    
    editHerdLoading: false,
    editHerdSuccess: false,
    editHerdError: undefined,
    
    deleteHerdLoading: false,
    deleteHerdSuccess: false,
    deleteHerdError: undefined,
    
    noHerdsCollection: false,
};

const herdReducer = (state = initialState, action) => {
    return produce(state, draft => {
      switch (action.type) {
        case HerdTypes.SUCCESS_GET_HERDS: {
          draft.getHerdsLoading = false;
          draft.getHerdsError = undefined;
          draft.herds = action.payload;
          break;
        }
        case HerdTypes.REQUEST_GET_HERDS: {
          draft.getHerdsLoading = true;
          draft.getHerdsError = undefined;
          break;
        }
        case HerdTypes.GET_HERDS_ERROR: {
          draft.getHerdsLoading = false;
          draft.getHerdsError = action.payload;;
          break;
        }
        case HerdTypes.SUCCESS_ADD_NEW_HERD: {
          draft.addNewHerdLoading = false;
          draft.addNewHerdSuccess = true;
          draft.addNewHerdError = undefined;
          break;
        }
        case HerdTypes.REQUEST_ADD_NEW_HERD: {
          draft.addNewHerdLoading = true;
          draft.addNewHerdSuccess = false;
          draft.addNewHerdError = undefined;
          break;
        }
        case HerdTypes.ADD_NEW_HERD_ERROR: {
          draft.addNewHerdLoading = false;
          draft.addNewHerdSuccess = false;
          draft.addNewHerdError = action.payload;
          break;
        }
        case HerdTypes.RESET_SUCCESS_ADD_NEW_HERD: {
          draft.addNewHerdLoading = false;
          draft.addNewHerdSuccess = false;
          draft.addNewHerdError = undefined;
          break;
        }
        case HerdTypes.REQUEST_EDIT_HERD_DATA: {
          draft.editHerdLoading = true;
          draft.editHerdSuccess = false;
          draft.editHerdError =  undefined;
          break;
        }
        case HerdTypes.SUCCESS_EDIT_HERD_DATA: {
          draft.editHerdLoading = false;
          draft.editHerdSuccess = true;
          draft.editHerdError =  undefined;
          break;
        }
        case HerdTypes.EDIT_HERD_DATA_ERROR: {
          draft.editHerdLoading = false;
          draft.editHerdSuccess = false;
          draft.editHerdError =  action.payload;
          break;
        }
        case HerdTypes.RESET_SUCCESS_EDIT_HERD_DATA: {
          draft.editHerdLoading = false;
          draft.editHerdSuccess = false;
          draft.editHerdError =  undefined;
          break;
        }
        case HerdTypes.REQUEST_DELETE_HERD: {
          draft.deleteHerdLoading = true;
          draft.deleteHerdSuccess = false;
          draft.deleteHerdError =  undefined;
          break;
        }
        case HerdTypes.SUCCESS_DELETE_HERD: {
          draft.deleteHerdLoading = false;
          draft.deleteHerdSuccess = true;
          draft.deleteHerdError =  undefined;
          break;
        }
        case HerdTypes.DELETE_HERD_ERROR: {
          draft.deleteHerdLoading = false;
          draft.deleteHerdSuccess = false;
          draft.deleteHerdError =  action.payload;
          break;
        }
        case HerdTypes.RESET_SUCCESS_DELETE_HERD: {
          draft.deleteHerdLoading = false;
          draft.deleteHerdSuccess = false;
          draft.deleteHerdError =  undefined;
          break;
        }
        case HerdTypes.NO_HERDS_COLLECTION: {
          draft.getHerdsLoading = false;
          draft.getHerdsError = undefined;
          draft.herds = []
          draft.noHerdsCollection = action.payload;
          break;
        }
        default: {
          return draft;
        }
      }
    });
  };
  
  export {herdReducer};