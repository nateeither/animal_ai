import produce from 'immer';
import { Reducer } from 'redux';

import { TaskTypes } from '../types';

const initialState = {
    getTasksLoading: false,
    tasks: [],
    getTasksError: undefined,
    
    createNewTaskLoading: false,
    createNewTaskSuccess: false,
    createNewTaskError: undefined,
      
    editTaskLoading: false,
    editTaskSuccess: false,
    editTaskError: undefined,
    
    deleteTaskLoading: false,
    deleteTaskSuccess: false,
    deleteTaskError: undefined
};

const taskReducer = (state = initialState, action) => {
    return produce(state, draft => {
      switch (action.type) {
        case TaskTypes.SUCCESS_GET_TASKS: {
          draft.getTasksLoading = false;
          draft.getTasksError = undefined;
          draft.tasks = action.payload;
          break;
        }
        case TaskTypes.REQUEST_GET_TASKS: {
          draft.getTasksLoading = true;
          draft.getTasksError = undefined;
          break;
        }
        case TaskTypes.GET_TASKS_ERROR: {
          draft.getTasksLoading = false;
          draft.getTasksError =  action.payload;
          break;
        }
        case TaskTypes.REQUEST_CREATE_NEW_TASK: {
          draft.createNewTaskLoading = true;
          draft.createNewTaskSuccess = false;
          draft.createNewTaskError =  undefined;
          break;
        }
        case TaskTypes.SUCCESS_CREATE_NEW_TASK: {
          draft.createNewTaskLoading = false;
          draft.createNewTaskSuccess = true;
          draft.createNewTaskError =  undefined;
          break;
        }
        case TaskTypes.CREATE_NEW_TASK_ERROR: {
          draft.createNewTaskLoading = false;
          draft.createNewTaskSuccess = false;
          draft.createNewTaskError =  action.payload;
          break;
        }
        case TaskTypes.RESET_SUCCESS_CREATE_NEW_TASK: {
          draft.createNewTaskLoading = false;
          draft.createNewTaskSuccess = false;
          draft.createNewTaskError =  undefined;
          break;
        }
        case TaskTypes.REQUEST_EDIT_TASK: {
          draft.editTaskLoading = true;
          draft.editTaskSuccess = false;
          draft.editTaskError =  undefined;
          break;
        }
        case TaskTypes.SUCCESS_EDIT_TASK: {
          draft.editTaskLoading = false;
          draft.editTaskSuccess = true;
          draft.editTaskError =  undefined;
          break;
        }
        case TaskTypes.EDIT_TASK_ERROR: {
          draft.editTaskLoading = false;
          draft.editTaskSuccess = false;
          draft.editTaskError =  action.payload;
          break;
        }
        case TaskTypes.RESET_SUCCESS_EDIT_TASK: {
          draft.editTaskLoading = false;
          draft.editTaskSuccess = false;
          draft.editTaskError =  undefined;
          break;
        }
        case TaskTypes.REQUEST_DELETE_TASK: {
          draft.deleteTaskLoading = true;
          draft.deleteTaskSuccess = false;
          draft.deleteTaskError =  undefined;
          break;
        }
        case TaskTypes.SUCCESS_DELETE_TASK: {
          draft.deleteTaskLoading = false;
          draft.deleteTaskSuccess = true;
          draft.deleteTaskError =  undefined;
          break;
        }
        case TaskTypes.DELETE_TASK_ERROR: {
          draft.deleteTaskLoading = false;
          draft.deleteTaskSuccess = false;
          draft.deleteTaskError =  action.payload;
          break;
        }
        case TaskTypes.RESET_SUCCESS_DELETE_TASK: {
          draft.deleteTaskLoading = false;
          draft.deleteTaskSuccess = false;
          draft.deleteTaskError =  undefined;
          break;
        }
        default: {
          return draft;
        }
      }
    });
  };
  
  export {taskReducer};