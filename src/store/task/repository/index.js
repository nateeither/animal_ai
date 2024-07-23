import firestore from '@react-native-firebase/firestore';
import { farms_ref } from '../../../constants/Api';

export const getTasksFirebase = async (
  farmUid,
) => {
  return firestore()
        .collection(`${farms_ref}/${farmUid}/tasks`).get()
        .then(querySnapshot => querySnapshot.docs);
};

export const createNewTaskFirebase = async (
  farmUid, task, uid
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/tasks`)
            .doc(uid)
            .set(task)
            .then(res => res)
            .catch(err => err)
};

export const editTaskDataFirebase = async (
  uid, farmUid, task
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/tasks`)
            .doc(uid)
            .update(task)
            .then(res => res)
            .catch(err => err)
};

export const deleteTaskFirebase = async (
  uid, farmUid
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/tasks`)
            .doc(uid)
            .delete()
            .then(res => res)
            .catch(err => err)
};