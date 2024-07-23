import firestore from '@react-native-firebase/firestore';
import { farms_ref } from '../../../constants/Api';

export const getNotificationsFirebase = async (
  farmUid,
) => {
  return firestore()
        .collection(`${farms_ref}/${farmUid}/notifications`).get()
        .then(querySnapshot => querySnapshot.docs);
};