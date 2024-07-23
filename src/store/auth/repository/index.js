import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {users_ref} from '../../../constants/Api'

export const signInWithEmailPasswordFirebase = async (
    email,
    password,
) => {

    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => user.user)
      .catch(err =>  err.code);
    
};

export const signUpWithEmailPasswordFirebase = async (
  email,
  password,
) => {

  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(res => res)
    .catch(err =>  err.code);
  
};
  
export const getCurrentUserFirebase = async (
  uid,
) => {
  return firestore()
        .collection(users_ref)
        .doc(uid)
        .get()
        .then(querySnapshot => querySnapshot.data());
};