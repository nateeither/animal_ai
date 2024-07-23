import firestore from '@react-native-firebase/firestore';
import {farms_ref} from '../../../constants/Api'

export const getHerdsFirebase = async (
  farmUid,
) => {
  return firestore()
        .collection(`${farms_ref}/${farmUid}/cows`).get()
        .then(querySnapshot => querySnapshot);
};

export const addNewHerdFirebase = async (
  farmUid, herd
) => {
  const maxBulkOperationCnt = 500
  const batch = firestore().batch();
  const ref = firestore().collection(`${farms_ref}/${farmUid}/cows`)
  
  for (let i = 0; i < herd.length; i++){
    batch.set(ref.doc(herd[i].uid),herd[i])
    if ((i + 1) % maxBulkOperationCnt === 0 || i === herd.length - 1) {
      await batch.commit()
    }
  }
};

export const editHerdDataFirebase = async (
  uid, farmUid, herd
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/cows`)
            .doc(uid)
            .update(herd)
            .then(res => res)
            .catch(err => err)
};

export const deleteHerdFirebase = async (
  uid, farmUid
) => {
    return firestore()
            .collection(`${farms_ref}/${farmUid}/cows`)
            .doc(uid)
            .delete()
            .then(res => res)
            .catch(err => err)
};