/* eslint-disable */
import fetch from 'isomorphic-fetch';
import settings from 'settings';
import * as _ from 'lodash';
import { getUUID, localStorage } from 'kit/lib/utils';
import { MD5 } from 'crypto-js'
import { tryRenewSession } from 'src/actions/userSession';
import { resetState } from 'src/actions/globalState';

const apis = {
  publicApi: settings.endpoints.publicApi,
  citizenApi: settings.endpoints.citizenApi,
  memberApi: settings.endpoints.memberApi,
};
const methods = ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'];
const userSessionTypes = ['SIGN_IN', 'REGISTER', 'RENEW_SESSION', 'VERIFY_EMAIL'];

export function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    let { callAPI } = action;
    const {
      types = '',
      shouldCallAPI = () => true,
      forceCallAPI = false,
      success = () => {},
      payload = {},
    } = action;

    if (!callAPI) {
      return next(action)
    }

    if (typeof types !== 'string') {
      throw new Error('Expected callAPI types to be a string.');
    }

    if (typeof callAPI === 'function') {
      callAPI = callAPI(getState());
    }

    if (
      typeof callAPI !== 'object' ||
      !_.includes(Object.keys(apis), callAPI.api) ||
      !callAPI.url ||
      !_.includes(methods, callAPI.method)
    ) {
      throw new Error('Expected callAPI to be an object with valid api, url, and method keys');
    }

    if (!shouldCallAPI(getState())) {
      return Promise.resolve({ type: `${types}_ABORT` });
    }

    const requestType = `${types}_REQUEST`;
    const successType = `${types}_SUCCESS`;
    const failureType = `${types}_FAIL`;
    const fullUrl = `${apis[callAPI.api]}${callAPI.url}`;
    const requestId = getUUID();

    const apiRequest = () => {
      return fetch(fullUrl, {
        method: callAPI.method,
        headers: {
          'Content-Type': 'application/json',
          'Request-ID': requestId,
          ...callAPI.api !== 'publicApi' && !!getState().userSession.bearerToken && {
            Authorization: `Bearer ${getState().userSession.bearerToken}`,
          },
          ...!!getState().ephemeral.currentUserGroup && !userSessionTypes.includes(types) && {
            'X-Group': getState().ephemeral.currentUserGroup,
          },
          ...!!getState().ephemeral.currentMember && {
            'X-Member': getState().ephemeral.currentMember,
          },
          ...!!getState().ephemeral.s && { 'X-Secret': getState().ephemeral.s },
          ...['PATCH', 'POST', 'DELETE'].includes(callAPI.method) && {
            'Prefer': 'return=representation',
          },
          ...callAPI.headers,
        },
        ...callAPI.method !== 'GET' && { body: JSON.stringify({
          ...callAPI.body,
        }) },
      });
    };
    const parseResponse = response => {
      const contentRange = response.headers.get('Content-Range');
      const statusCode = response.status;
      const statusText = response.statusText;
      const success = response.ok;
      if (!response.text) {
        throw { response, statusCode, statusText };
      }
      return response.text().then(text => {
        return {
          response: text ? JSON.parse(text) : null,
          contentRange,
          statusCode,
          statusText,
          success,
        };
      });
    };
    const handleResponse = ({ response, contentRange, statusCode, statusText, success }) => {
      if (!success) {
        throw { response, statusCode, statusText };
      }
      return { response, contentRange };
    };
    const dispatchSuccess = ({ response, contentRange }) => {
      if (response !== null) {
        return dispatch(Object.assign({}, payload, { response, type: successType, requestId, contentRange }));
      }
      return Object.assign({}, payload, { response, type: successType, requestId, contentRange });
    };
    const handleAdditionalDispatches = action => {
      success(action.response, dispatch);
      return action;
    };
    const handleExceptions = ({ response, statusCode, statusText }) => {
      let error = 'error';
      if (statusCode >= 400 && statusCode < 500) error = 'unauthorized';
      return dispatch(Object.assign({}, {
        response,
        statusCode,
        statusText,
        error,
        type: failureType,
        requestId,
      }));
    };

    dispatch(Object.assign({}, payload, { type: requestType, requestId }));

    const handleRenewSession = action => {
      if (action.type === 'RENEW_SESSION_SUCCESS' || action.type === 'HAS_USER_SESSION') {
        return apiRequest();
      } else if (action.error === 'unauthorized') {
        dispatch(resetState());
      }
      throw new Error('Could not renew the sesssion.');
    };

    // Renew session if not a renew_session_request and user has a session
    if (!_.isEmpty(getState().userSession) && requestType !== 'RENEW_SESSION_REQUEST') {
      return dispatch(tryRenewSession())
        .then(handleRenewSession)
        .then(parseResponse)
        .then(handleResponse)
        .then(dispatchSuccess)
        .then(handleAdditionalDispatches)
        .catch(handleExceptions);
    }

    return apiRequest()
      .then(parseResponse)
      .then(handleResponse)
      .then(dispatchSuccess)
      .then(handleAdditionalDispatches)
      .catch(handleExceptions);
  };
}
/* eslint-enable */
