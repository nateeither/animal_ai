import { takeLatest, put, call, select } from 'redux-saga/effects';

import {
  createNewUserError,
  createNewFarmUserError,
  getUsersError,
  pushUsersData,
  successUpdateUserData,
  successCreateNewUser,
  pushFarmData,
  getFarmDataError,
  updateUserDataError,
  updateGeneralInfoError,
  successUpdateGeneraInfo,
  setNoUsersCollection
} from '../actions';

import {
  getUsersFirebase,
  createNewUserFirebase,
  createNewFarmUserFirebase,
  updateUserDataFirebase,
  updateFarmUserDataFirebase,
  updateGeneralInfoFirebase,
  getFarmDataFirebase
  } from '../repository';

import {
    UserTypes,
} from '../types';
  
export function* requestGetUsersSaga(
  props
) {
  const farmUid = props.payload;
  
    try {
      if (farmUid) {
        const response = yield call( 
          getUsersFirebase,
          farmUid,
        );

        console.log('get users sagas: ', response)
        if (response.size != 0) {
          if (response.docs.length > 0) {
            let users = []
  
            response.docs.map(item => users.push(item.data()))
  
            yield put(pushUsersData(users));
          }
          else {
            yield put(getUsersError(response))
          }
        }
        else {
          yield put(setNoUsersCollection(true))
        }
      }
     
    } catch (err) {
      console.log(err)
      yield put(getUsersError('try_again'));
    }
}


export function* requestCreateNewUserSaga(
  props
) {
  const uid = props.payload.uid;
  const user = props.payload.user

  
    try {

        const response = yield call( 
          createNewUserFirebase,
          uid,
          user
        );

        // console.log('create new user sagas: ', response)

     
    } catch (err) {
      console.log(err)
      yield put(createNewUserError('try_again'));
    }
}


export function* requestCreateNewFarmUserSaga(
  props
) {
  const uid = props.payload.uid;
  const farmUid = props.payload.farmUid;
  const user = props.payload.user
  
    try {

        const response = yield call( 
          createNewFarmUserFirebase,
          uid,
          farmUid,
          user
        );

        // console.log('create new farm user sagas: ', response)
        yield put(successCreateNewUser());

     
    } catch (err) {
      console.log(err)
      yield put(createNewFarmUserError('try_again'));
    }
}

export function* requestUpdateUserDataSaga(
  props
) {
  const uid = props.payload.uid;
  const user = props.payload.user

  
    try {

        const response = yield call( 
          updateUserDataFirebase,
          uid,
          user
        );

        console.log('update user sagas: ', response)
        
        // yield put(successUpdateUserData());
     
    } catch (err) {
      console.log(err)
      yield put(updateUserDataError('try_again'));
    }
}

export function* requestUpdateGeneralInfoSaga(
  props
) {
  const farmUid = props.payload.farmUid;
  const generalInfo = props.payload.generalInfo
  
    try {

        const response = yield call( 
          updateGeneralInfoFirebase,
          farmUid,
          generalInfo
        );

        console.log('update general info sagas: ', response)
        
        yield put(successUpdateGeneraInfo());
     
    } catch (err) {
      console.log(err)
      yield put(updateGeneralInfoError('try_again'));
    }
}

export function* requestUpdateFarmUserDataSaga(
  props
) {
  const uid = props.payload.uid;
  const farmUid = props.payload.farmUid;
  const user = props.payload.user
  
    try {

        const response = yield call( 
          updateFarmUserDataFirebase,
          uid,
          farmUid,
          user
        );

        // console.log('update farm user sagas: ', response)

        yield put(successUpdateUserData());
      
    } catch (err) {
      console.log(err)
      yield put(createNewFarmUserError('try_again'));
    }
}

export function* requestGetFarmDataSaga(
  props
) {
  const farmUid = props.payload
    try {
      if (farmUid) {
        const farmData = yield call(
          getFarmDataFirebase,
          farmUid,
        );

        console.log('get farm data sagas: ', farmData)

        yield put(pushFarmData(farmData));
      }
     
    } catch (err) {
      console.log(err)
      yield put(getFarmDataError('try_again'));
    }
}

export default [
  takeLatest(
    UserTypes.REQUEST_GET_USERS,
    requestGetUsersSaga,
  ),
  takeLatest(
    UserTypes.REQUEST_CREATE_NEW_USER,
    requestCreateNewUserSaga,
  ),
  takeLatest(
    UserTypes.REQUEST_CREATE_NEW_FARM_USER,
    requestCreateNewFarmUserSaga,
  ),
  takeLatest(
    UserTypes.REQUEST_UPDATE_USER_DATA,
    requestUpdateUserDataSaga,
  ),
  takeLatest(
    UserTypes.REQUEST_UPDATE_FARM_USER_DATA,
    requestUpdateFarmUserDataSaga,
  ),
  takeLatest(
    UserTypes.REQUEST_UPDATE_GENERAL_INFO,
    requestUpdateGeneralInfoSaga,
  ),
  takeLatest(
    UserTypes.REQUEST_GET_FARM_DATA,
    requestGetFarmDataSaga,
  )
];