import { takeLatest, put, call, select } from 'redux-saga/effects';

import { getNotificationsError, pushNotificationsData } from '../actions';

import {
  getNotificationsFirebase,
  } from '../repository';

import {
    NotificationTypes,
} from '../types';
  
export function* requestGetNotificationsSaga(
  props
) {
  const farmUid = props.payload;
  
    try {
      if (farmUid) {
        const response = yield call( 
          getNotificationsFirebase,
          farmUid,
        );

        console.log('get notif sagas: ', response)

        if (response.length > 0) {
          let notifications = []

          response.map(item => {
            let notification = item.data()
            
            notifications.push(notification)
          })

          yield put(pushNotificationsData(notifications));
        }
        else {
          yield put(getNotificationsError(response))
        }
  
      }
     
    } catch (err) {
      console.log(err)
      yield put(getNotificationsError('try_again'));
    }
}
  
export default [
  takeLatest(
    NotificationTypes.REQUEST_GET_NOTIFICATIONS,
    requestGetNotificationsSaga,
  )
];