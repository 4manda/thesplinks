import * as _ from 'lodash';
import { transformResponse } from 'kit/lib/utils';

export const initialState = {
  s: '',
  currentUserGroup: 'thesplinks.com',
  currentMember: '',
};

export default {
  ephemeral: {
    state: initialState,
    reducer(state = initialState, action) {
      switch (action.type) {
        case 'INSERT_MEMBER_SUCCESS': {
          const response = transformResponse(action.response[0]);
          if (response) {
            return {
              ...state,
              currentUserGroup: response.userGroupUuid,
              currentMember: response.memberUuid,
              s: action.secret ? action.secret : state.s,
            };
          }
          return state;
         };
        case 'SET_CURRENT_MEMBER':
          return {
            ...state,
            currentMember: action.memberUuid,
            currentUserGroup: action.userGroupUuid,
          };
        case 'UNSET_CURRENT_MEMBER':
          return {
            ...state,
            s: '',
            currentUserGroup: '',
            currentMember: '',
          };
        default:
          return state;
      }
    },
  },
};
