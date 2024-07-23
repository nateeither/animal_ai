import {
    HerdTypes,
  } from '../types';
  
  export function pushHerdsData(
    herds
  ) {
    return {
      type: HerdTypes.SUCCESS_GET_HERDS,
      payload: herds,
    };
  }

  export function requestGetHerds(
    farmUid
  ) {
    return {
      type: HerdTypes.REQUEST_GET_HERDS,
      payload: farmUid
    };
  }

  export function getHerdsError(error) {
    return {
      type: HerdTypes.GET_HERDS_ERROR,
      payload: error,
    };
  }

  export function successAddNewHerd(
  ) {
    return {
      type: HerdTypes.SUCCESS_ADD_NEW_HERD,
    };
  }

  export function requestAddNewHerd(
    farmUid, herd
  ) {
    return {
      type: HerdTypes.REQUEST_ADD_NEW_HERD,
      payload: {farmUid, herd}
    };
  }

  export function addNewHerdError(error) {
    return {
      type: HerdTypes.ADD_NEW_HERD_ERROR,
      payload: error,
    };
  }

  export function resetSuccessAddNewHerd(
    ) {
      return {
        type: HerdTypes.RESET_SUCCESS_ADD_NEW_HERD,
      };
  }

  export function successEditHerdData(
    ) {
      return {
        type: HerdTypes.SUCCESS_EDIT_HERD_DATA,
      };
  }

  export function requestEditHerdData(
    uid, farmUid, herd
  ) {
    return {
      type: HerdTypes.REQUEST_EDIT_HERD_DATA,
      payload: {uid,farmUid,herd}
    };
  }

  export function editHerdDataError(error) {
    return {
      type: HerdTypes.EDIT_HERD_DATA_ERROR,
      payload: error,
    };
  }

  export function resetSuccessEditHerdData(
    ) {
      return {
        type: HerdTypes.RESET_SUCCESS_EDIT_HERD_DATA
      };
  }

  export function successDeleteHerd(
    ) {
      return {
        type: HerdTypes.SUCCESS_DELETE_HERD,
      };
  }

  export function requestDeleteHerd(
    uid, farmUid
  ) {
    return {
      type: HerdTypes.REQUEST_DELETE_HERD,
      payload: {uid,farmUid}
    };
  }

  export function deleteHerdError(error) {
    return {
      type: HerdTypes.DELETE_HERD_ERROR,
      payload: error,
    };
  }

  export function resetSuccessDeleteHerd(
    ) {
      return {
        type: HerdTypes.RESET_SUCCESS_DELETE_HERD,
      };
  }

  export function setNoHerdsCollection(
    status
  ) {
    return {
      type: HerdTypes.NO_HERDS_COLLECTION,
      payload: status
    };
  }
