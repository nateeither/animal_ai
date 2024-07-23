import {
    NotificationTypes,
  } from '../types';
  
  export function pushNotificationsData(
    notifications
  ) {
    return {
      type: NotificationTypes.SUCCESS_GET_NOTIFICATIONS,
      payload: notifications,
    };
  }

  export function requestGetNotifications(
    farmUid
  ) {
    return {
      type: NotificationTypes.REQUEST_GET_NOTIFICATIONS,
      payload: farmUid
    };
  }

  export function getNotificationsError(error) {
    return {
      type: NotificationTypes.GET_NOTIFICATIONS_ERROR,
      payload: error,
    };
  }