import {combineReducers} from 'redux';

import { authReducer } from './auth/reducers';
import { accountOverviewReducer } from './account_overview/reducers';
import { herdReducer } from './herd/reducers';
import { taskReducer } from './task/reducers';
import { userReducer } from './user/reducers';
import { notificationReducer } from './notification/reducers';

export const rootReducer = combineReducers({
  authReducer,
  accountOverviewReducer,
  herdReducer,
  taskReducer,
  userReducer,
  notificationReducer
});

export default rootReducer;