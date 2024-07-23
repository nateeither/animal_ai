import firestore from '@react-native-firebase/firestore';
import { farms_ref , users_ref} from '../../../constants/Api';
  
export const getUsersFirebase = async (
  farmUid,
) => {
  return firestore()
          .collection(`${farms_ref}/${farmUid}/users`).get()
          .then(querySnapshot => querySnapshot);
};

export const getFarmDataFirebase = async (
  farmUid,
) => {
  return firestore()
          .collection(farms_ref)
          .doc(farmUid)
          .get()
          .then(querySnapshot => querySnapshot.data());
};

export const createNewUserFirebase = async (
  uid, user
) => {
    return firestore()
            .collection(users_ref)
            .doc(uid)
            .set(user)
            .then(res => res)
            .catch(err => err)
};

export const createNewFarmUserFirebase = async (
  uid, farmUid, user
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/users`)
            .doc(uid)
            .set(user)
            .then(res => res)
            .catch(err => err)
};

export const updateUserDataFirebase = async (
  uid, user
) => {
    return firestore()
            .collection(users_ref)
            .doc(uid)
            .update(user)
            .then(res => res)
            .catch(err => err)
};

export const updateFarmUserDataFirebase = async (
  uid, farmUid, user
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/users`)
            .doc(uid)
            .update(user)
            .then(res => res)
            .catch(err => err)
};

export const updateGeneralInfoFirebase = async (
  farmUid, generalInfo
) => {
    return firestore()
            .collection(`${farms_ref}`)
            .doc(farmUid)
            .update(generalInfo)
            .then(res => res)
            .catch(err => err)
};