import {
    TaskTypes,
  } from '../types';
  
  export function pushTasksData(
    tasks
  ) {
    return {
      type: TaskTypes.SUCCESS_GET_TASKS,
      payload: tasks,
    };
  }

  export function requestGetTasks(
    farmUid
  ) {
    return {
      type: TaskTypes.REQUEST_GET_TASKS,
      payload: farmUid
    };
  }

  export function getTasksError(error) {
    return {
      type: TaskTypes.GET_TASKS_ERROR,
      payload: error,
    };
  }

  export function successCreateNewTask(
  ) {
    return {
      type: TaskTypes.SUCCESS_CREATE_NEW_TASK,
    };
  }

  export function requestCreateNewTask(
    farmUid, task, uid
  ) {
    return {
      type: TaskTypes.REQUEST_CREATE_NEW_TASK,
      payload: {farmUid, task, uid}
    };
  }

  export function createNewTaskError(error) {
    return {
      type: TaskTypes.CREATE_NEW_TASK_ERROR,
      payload: error,
    };
  }

  export function resetSuccessCreateNewTask(
    ) {
      return {
        type: TaskTypes.RESET_SUCCESS_CREATE_NEW_TASK,
      };
  }

  export function successEditTaskData(
    ) {
      return {
        type: TaskTypes.SUCCESS_EDIT_TASK,
      };
  }

  export function requestEditTaskData(
    uid, farmUid, task
  ) {
    return {
      type: TaskTypes.REQUEST_EDIT_TASK,
      payload: {uid,farmUid,task}
    };
  }

  export function editTaskDataError(error) {
    return {
      type: TaskTypes.EDIT_TASK_ERROR,
      payload: error,
    };
  }

  export function resetSuccessEditTaskData(
    ) {
      return {
        type: TaskTypes.RESET_SUCCESS_EDIT_TASK,
      };
  }

  export function successDeleteTask(
    ) {
      return {
        type: TaskTypes.SUCCESS_DELETE_TASK,
      };
  }

  export function requestDeleteTask(
    uid, farmUid
  ) {
    return {
      type: TaskTypes.REQUEST_DELETE_TASK,
      payload: {uid,farmUid}
    };
  }

  export function deleteTaskError(error) {
    return {
      type: TaskTypes.EDIT_TASK_ERROR,
      payload: error,
    };
  }

  export function resetSuccessDeleteTask(
    ) {
      return {
        type: TaskTypes.RESET_SUCCESS_DELETE_TASK,
      };
  }