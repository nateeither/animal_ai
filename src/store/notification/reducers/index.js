import produce from 'immer';
import { Reducer } from 'redux';

import { NotificationTypes } from '../types';

const initialState = {
    getNotificationsLoading: false,
    notifications: [],
    getNotificationsError: undefined,
};

const notificationReducer = (state = initialState, action) => {
    return produce(state, draft => {
      switch (action.type) {
        case NotificationTypes.SUCCESS_GET_NOTIFICATIONS: {
          draft.getNotificationsLoading = false;
          draft.getNotificationsError = undefined;
          draft.notifications = action.payload;
          break;
        }
        case NotificationTypes.REQUEST_GET_NOTIFICATIONS: {
          draft.getNotificationsLoading = true;
          draft.getNotificationsError = undefined;
          break;
        }
        case NotificationTypes.GET_NOTIFICATIONS_ERROR: {
          draft.getNotificationsLoading = false;
          draft.getNotificationsError = action.payload;;
          break;
        }
        default: {
          return draft;
        }
      }
    });
  };
  
  export {notificationReducer};