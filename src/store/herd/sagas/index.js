import { takeLatest, put, call, select } from 'redux-saga/effects';

import {
  getHerdsError,
  pushHerdsData,
  successAddNewHerd,
  addNewHerdError,
  successEditHerdData,
  editHerdDataError,
  successDeleteHerd,
  deleteHerdError,
  setNoHerdsCollection
} from '../actions';

import {
  getHerdsFirebase,
  addNewHerdFirebase,
  editHerdDataFirebase,
  deleteHerdFirebase
  } from '../repository';

import {
    HerdTypes,
} from '../types';
  
export function* requestGetHerdsSaga(
  props
) {
  const farmUid = props.payload;
  
    try {
      if (farmUid) {
        const response = yield call( 
          getHerdsFirebase,
          farmUid,
        );

        console.log('get herds sagas: ', response)
        if (response.size != 0) {
          if (response.docs.length > 0) {
            let herds = []
  
            response.docs.map(item => {
              let herd = item.data()
              // herd = { ...herd, uid: item.id }
              
              herds.push(herd)
            })
  
            yield put(pushHerdsData(herds));
          }
          else {
            yield put(getHerdsError(response))
          }
        }
        else {
          yield put(setNoHerdsCollection(true))
        }
  
      }
     
    } catch (err) {
      console.log(err)
      yield put(getHerdsError('try_again'));
    }
}


export function* requestAddNewHerdSaga(
  props
) {
  const farmUid = props.payload.farmUid;
  const herd = props.payload.herd
  const uid = props.payload.uid
  
    try {

        const response = yield call( 
          addNewHerdFirebase,
          farmUid,
          herd,
          uid
        );

        // console.log('create new farm user sagas: ', response)
        yield put(successAddNewHerd());

     
    } catch (err) {
      console.log(err)
      yield put(addNewHerdError('try_again'));
    }
}

export function* requestEditHerdDataSaga(
  props
) {
  const uid = props.payload.uid;
  const farmUid = props.payload.farmUid;
  const herd = props.payload.herd
  
    try {

        const response = yield call( 
          editHerdDataFirebase,
          uid,
          farmUid,
          herd
        );

        // console.log('update farm user sagas: ', response)

        yield put(successEditHerdData());
      
    } catch (err) {
      console.log(err)
      yield put(editHerdDataError('try_again'));
    }
}


export function* requestDeleteHerdSaga(
  props
) {
  const uid = props.payload.uid;
  const farmUid = props.payload.farmUid;
  
    try {

        const response = yield call( 
          deleteHerdFirebase,
          uid,
          farmUid,
        );

        // console.log('update farm user sagas: ', response)

        yield put(successDeleteHerd());
      
    } catch (err) {
      console.log(err)
      yield put(deleteHerdError('try_again'));
    }
}
  
export default [
  takeLatest(
    HerdTypes.REQUEST_GET_HERDS,
    requestGetHerdsSaga,
  ),
  takeLatest(
    HerdTypes.REQUEST_ADD_NEW_HERD,
    requestAddNewHerdSaga,
  ),
  takeLatest(
    HerdTypes.REQUEST_EDIT_HERD_DATA,
    requestEditHerdDataSaga,
  ),
  takeLatest(
    HerdTypes.REQUEST_DELETE_HERD,
    requestDeleteHerdSaga,
  ),
];