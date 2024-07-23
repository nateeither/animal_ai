import { takeLatest, put, call, select } from 'redux-saga/effects';

import {
  getTasksError,
  pushTasksData,
  createNewTaskError,
  successCreateNewTask,
  editTaskDataError,
  successEditTaskData,
  deleteTaskError,
  successDeleteTask
} from '../actions';

import {
  getTasksFirebase,
  createNewTaskFirebase,
  editTaskDataFirebase,
  deleteTaskFirebase
  } from '../repository';

import {
    TaskTypes,
} from '../types';
  
export function* requestGetTasksSaga(
  props
) {
  const farmUid = props.payload;
  
    try {
      if (farmUid) {
        const response = yield call( 
          getTasksFirebase,
          farmUid,
        );

        // console.log('get tasks sagas: ', response)

        if (response.length > 0) {

          let tasks = []

          response.map(item => {
            let task = item.data()
            task = { ...task, uid: item.id }
            
            tasks.push(task)
          })

          yield put(pushTasksData(tasks));
        }
        else {
          yield put(getTasksError(response))
        }
  
      }
     
    } catch (err) {
      console.log(err)
      yield put(getTasksError('try_again'));
    }
}

export function* requestCreateNewTaskSaga(
  props
) {
  const farmUid = props.payload.farmUid;
  const task = props.payload.task
  const uid = props.payload.uid
  
    try {

        const response = yield call( 
          createNewTaskFirebase,
          farmUid,
          task,
          uid
        );

        // console.log('create new farm user sagas: ', response)
        yield put(successCreateNewTask());

     
    } catch (err) {
      console.log(err)
      yield put(createNewTaskError('try_again'));
    }
}


export function* requestEditTaskDataSaga(
  props
) {
  const uid = props.payload.uid;
  const farmUid = props.payload.farmUid;
  const task = props.payload.task
  
    try {

        const response = yield call( 
          editTaskDataFirebase,
          uid,
          farmUid,
          task
        );

        // console.log('update farm user sagas: ', response)

        yield put(successEditTaskData());
      
    } catch (err) {
      console.log(err)
      yield put(editTaskDataError('try_again'));
    }
}

export function* requestDeleteTaskSaga(
  props
) {
  const uid = props.payload.uid;
  const farmUid = props.payload.farmUid;
  
    try {

        const response = yield call( 
          deleteTaskFirebase,
          uid,
          farmUid,
        );

        // console.log('update farm user sagas: ', response)

        yield put(successDeleteTask());
      
    } catch (err) {
      console.log(err)
      yield put(deleteTaskError('try_again'));
    }
}
  
export default [
  takeLatest(
    TaskTypes.REQUEST_GET_TASKS,
    requestGetTasksSaga,
  ),
  takeLatest(
    TaskTypes.REQUEST_CREATE_NEW_TASK,
    requestCreateNewTaskSaga,
  ),
  takeLatest(
    TaskTypes.REQUEST_EDIT_TASK,
    requestEditTaskDataSaga,
  ),
  takeLatest(
    TaskTypes.REQUEST_DELETE_TASK,
    requestDeleteTaskSaga,
  ),
];