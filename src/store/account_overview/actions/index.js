import {
    AccountOverviewTypes,
} from '../types';
  
export function changeProgressIndex(
  index
) {
  return {
    type: AccountOverviewTypes.CHANGE_PROGRESS_BAR_INDEX,
    payload: index,
  };
}
  
export function setupProgressDone(
  status
) {
  return {
    type: AccountOverviewTypes.SETUP_PROGRESS_DONE,
    payload: status,
  };
}