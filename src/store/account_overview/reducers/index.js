import produce from 'immer';
import { Reducer } from 'redux';

import { AccountOverviewTypes } from '../types';

const initialState = {
    progressBarIndex: 1,
    setupProgressDone: false,
};

const accountOverviewReducer = (state = initialState, action) => {
    return produce(state, draft => {
      switch (action.type) {
        case AccountOverviewTypes.CHANGE_PROGRESS_BAR_INDEX: {
          draft.progressBarIndex = action.payload;
          break;
        }
        case AccountOverviewTypes.SETUP_PROGRESS_DONE: {
          draft.setupProgressDone = action.payload;
          break;
        }
        default: {
          return draft;
        }
      }
    });
  };
  
  export {accountOverviewReducer};