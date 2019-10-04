import * as _ from 'lodash';

const initialState = {
  error: '',
  isLoading: false,
  loadingRequestIDs: [],
  isOnline: true,
};

export default {
  globalState: {
    state: initialState,
    reducer(state = initialState, action = {}) {
      if (_.includes(action.type, 'REQUEST')) {
        return {
          ...state,
          isLoading: true,
          loadingRequestIDs: state.loadingRequestIDs.concat(action.requestId),
        };
      } else if (_.includes(action.type, 'SUCCESS')) {
        const updatedList = state.loadingRequestIDs.filter(id => id !== action.requestId);
        return {
          ...state,
          error: '',
          isLoading: updatedList.length !== 0,
          loadingRequestIDs: updatedList,
        };
      } else if (_.includes(action.type, 'FAIL')) {
        const updatedList = state.loadingRequestIDs.filter(id => id !== action.requestId);
        return {
          ...state,
          error: action.error,
          isLoading: updatedList.length !== 0,
          loadingRequestIDs: updatedList,
        };
      } else if (action.type === 'SET_ONLINE_STATE') {
        return {
          ...state,
          isOnline: action.isOnline,
          error: action.isOnline ? '' : 'offline',
        };
      }
      return state;
    },
  },
};
