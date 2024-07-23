import {all,fork} from '@redux-saga/core/effects';

import authSagas from './auth/sagas';
import herdSagas from './herd/sagas';
import taskSagas from './task/sagas';
import userSagas from './user/sagas';
import notificationSagas from './notification/sagas';

export function* rootSagas() {
  yield all([
    ...authSagas,
    ...herdSagas,
    ...taskSagas,
    ...userSagas,
    ...notificationSagas
  ]);
}