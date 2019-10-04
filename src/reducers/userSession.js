import { transformResponse } from 'kit/lib/utils';
import actionTypes from 'src/actionTypes';

const {
  SIGN_IN_SUCCESS,
  VERIFY_SUCCESS,
  RENEW_SESSION_SUCCESS,
} = actionTypes;

/*
 * State shape
 * {
 *   accessToken: '',
 *   refreshToken: '',
 *   username: '',
 *   sessionUuid: '',
 *   userSessionExpiresAt: '',
 *   bearerToken: '',
 * }
 */

export default {
  userSession: {
    state: {},
    reducer(state = {}, action = {}) {
      switch (action.type) {
        case VERIFY_SUCCESS:
        case RENEW_SESSION_SUCCESS:
        case SIGN_IN_SUCCESS: {
          const response = transformResponse(action.response[0]);
          return {
            ...response,
            username: response.sessionUuid,
            sessionUuid: response.username,
          };
        }
        default:
          return state;
      }
    },
  },
};
