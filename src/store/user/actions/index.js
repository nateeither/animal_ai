import {
  UserTypes,
} from '../types';

export function pushUsersData(
  users
) {
  return {
    type: UserTypes.SUCCESS_GET_USERS,
    payload: users,
  };
}

export function requestGetUsers(
  farmUid
) {
  return {
    type: UserTypes.REQUEST_GET_USERS,
    payload: farmUid
  };
}

export function getUsersError(error) {
  return {
    type: UserTypes.GET_USERS_ERROR,
    payload: error,
  };
}

export function resetSuccessGetUsers(
  ) {
    return {
      type: UserTypes.RESET_SUCCESS_GET_USERS,
    };
}

export function successCreateNewUser(
  ) {
    return {
      type: UserTypes.SUCCESS_CREATE_NEW_USER,
    };
}

export function resetSuccessCreateNewUser(
  ) {
    return {
      type: UserTypes.RESET_SUCCESS_CREATE_NEW_USER,
    };
}

export function requestCreateNewUser(
  uid, user
) {
  return {
    type: UserTypes.REQUEST_CREATE_NEW_USER,
    payload: {uid,user}
  };
}

export function createNewUserError(error) {
  return {
    type: UserTypes.CREATE_NEW_USER_ERROR,
    payload: error,
  };
}

export function requestCreateNewFarmUser(
  uid, farmUid, user
) {
  return {
    type: UserTypes.REQUEST_CREATE_NEW_FARM_USER,
    payload: {uid,farmUid,user}
  };
}

export function createNewFarmUserError(error) {
  return {
    type: UserTypes.CREATE_NEW_FARM_USER_ERROR,
    payload: error,
  };
}

export function successUpdateUserData(
) {
  return {
    type: UserTypes.SUCCESS_UPDATE_USER_DATA,
    // payload: users,
  };
}

export function resetSuccessUpdateUserData(
  ) {
    return {
      type: UserTypes.RESET_SUCCESS_UPDATE_USER_DATA,
    };
}

export function requestUpdateUserData(
  uid, user
) {
  return {
    type: UserTypes.REQUEST_UPDATE_USER_DATA,
    payload: {uid,user}
  };
}

export function updateUserDataError(error) {
  return {
    type: UserTypes.UPDATE_USER_DATA_ERROR,
    payload: error,
  };
}

export function requestUpdateFarmUserData(
  uid, farmUid, user
) {
  return {
    type: UserTypes.REQUEST_UPDATE_FARM_USER_DATA,
    payload: {uid,farmUid,user}
  };
}

export function updateFarmUserDataError(error) {
  return {
    type: UserTypes.UPDATE_FARM_USER_DATA_ERROR,
    payload: error,
  };
}

export function pushFarmData(
  farm
) {
  return {
    type: UserTypes.SUCCESS_GET_FARM_DATA,
    payload: farm,
  };
}

export function requestGetFarmData(
  farmUid
) {
  return {
    type: UserTypes.REQUEST_GET_FARM_DATA,
    payload: farmUid
  };
}

export function getFarmDataError(error) {
  return {
    type: UserTypes.GET_FARM_DATA_ERROR,
    payload: error,
  };
}

export function successUpdateGeneraInfo(
  ) {
    return {
      type: UserTypes.SUCCESS_UPDATE_GENERAL_INFO,
      // payload: users,
    };
  }
  
  export function resetSuccessUpdateGeneralInfo(
    ) {
      return {
        type: UserTypes.RESET_SUCCESS_UPDATE_GENERAL_INFO,
      };
  }
  
  export function requestUpdateGeneralInfo(
    farmUid, generalInfo
  ) {
    return {
      type: UserTypes.REQUEST_UPDATE_GENERAL_INFO,
      payload: {farmUid,generalInfo}
    };
  }
  
  export function updateGeneralInfoError(error) {
    return {
      type: UserTypes.UPDATE_GENERAL_INFO_ERROR,
      payload: error,
    };
  }

  export function setNoUsersCollection(
    status
  ) {
    return {
      type: UserTypes.NO_USERS_COLLECTION,
      payload: status
    };
  }