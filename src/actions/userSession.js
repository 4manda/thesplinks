import * as _ from 'lodash';
import { localStorage } from 'kit/lib/utils';
import actionTypes from 'src/actionTypes';

const {
  REGISTER,
  VERIFY,
  SIGN_IN,
  RENEW_SESSION,
} = actionTypes;

export function register(username, name, email, pwd) {
  return {
    types: REGISTER,
    callAPI: {
      api: 'publicApi',
      url: '/rpc/register',
      method: 'POST',
      body: {
        username,
        full_name: name,
        email_address: email,
        password: pwd,
      },
    },
  };
}

export function verifyEmail(userEmailUuid, userEmailToken) {
  return {
    types: VERIFY,
    callAPI: {
      api: 'publicApi',
      url: '/rpc/verify',
      method: 'POST',
      body: {
        user_email_uuid: userEmailUuid,
        user_email_token: userEmailToken,
      },
    },
  };
}

export function signIn(username, password) {
  return {
    types: SIGN_IN,
    callAPI: {
      api: 'publicApi',
      url: '/rpc/sign_in',
      method: 'POST',
      body: {
        username,
        password,
      },
    },
  };
}

export function renewSession(session) {
  return {
    types: RENEW_SESSION,
    callAPI: {
      api: 'publicApi',
      url: '/rpc/renew_session',
      method: 'POST',
      body: {
        username: session.username,
        refresh_token: session.refreshToken,
      },
    },
  };
}

export function logout() {
  return { type: 'RESET_STATE' };
}

export function tryRenewSession() {
  return function (dispatch, getState) {
    const existingSession = getState().userSession;
    if (
      !_.isEmpty(existingSession) &&
      existingSession.refreshToken &&
      existingSession.userSessionExpiresAt
    ) {
      const timeNow = new Date().getTime();
      const sessionExp = existingSession.userSessionExpiresAt * 1000;
      if (timeNow >= sessionExp) {
        // If existing session expired, renew session
        return dispatch(renewSession(existingSession));
      }
      // Else ignore, since they have unexpired session in the store
      return Promise.resolve({ type: 'HAS_USER_SESSION', message: 'User has a recent session' });
    }
    return Promise.resolve({ type: 'NO_USER_SESSION', message: 'User does has no session' });
  };
}
