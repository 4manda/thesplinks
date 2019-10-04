import * as _ from 'lodash';
import { combineReducers } from 'redux';
import { transformResponse, updateState, deleteItemFromState } from 'kit/lib/utils';
import citizenAPI from 'config/api/citizen';
import memberAPI from 'config/api/member';
import publicAPI from 'config/api/public';

const apiConfigs = {
  citizen: citizenAPI,
  member: memberAPI,
  public: publicAPI,
};

/* eslint-disable no-param-reassign */
const extraMiddlewares = {
  member: (state, action) => {
    if (action.type === 'UNSELECT_USER_GROUP') {
      state = undefined;
    }
    return [state, action];
  },
};

export default _.reduce(apiConfigs, (root, apiConfig, apiName) => {
  root[apiName] = {
    state: {},
    reducer: (state, action) => {
      let args = [state, action];
      if (_.has(extraMiddlewares, apiName)) {
        args = _.invoke(extraMiddlewares, apiName, state, action);
      }
      return combineReducers(_.reduce(apiConfig, (m, v, k) => {
        const { pkey, initialState, listenFor, pagination } = v;
        const isArray = _.isArray(initialState);
        // Create the reducers for the given api
        m[`${k}${isArray ? 's' : ''}`] = (
          localState = initialState, localAction = { response: [] },
        ) => {
          // If no api response
          if (!localAction.response) return localState;
          let output = _.cloneDeep(localState);
          // 1. Grab the list of actions which will write to state
          const validActions = _.map(['SELECT', 'UPDATE', 'INSERT'], writeAction => (
            `${writeAction}_${_.snakeCase(k)}_SUCCESS`.toUpperCase()
          ));
          // 2. Iterate over actions that write to the state
          localAction.response = transformResponse(localAction.response);
          if (validActions.indexOf(localAction.type) >= 0) {
            if (localAction.type.includes('SELECT') && pagination) {
              output = localAction.response;
            } else {
              output = updateState(_.cloneDeep(localState), localAction.response, pkey);
            }
          } else if (localAction.type === `DELETE_${_.snakeCase(k)}_SUCCESS`.toUpperCase()) {
            // 1. Also process successful deletions
            output = deleteItemFromState(_.cloneDeep(localState), localAction.response, pkey);
          }
          // 3. Create external event actions config
          const validListenForActions = _.reduce(listenFor,
            (listenForMemo, eventConfig, eventKey) => {
              // 2. Create a writeAction keyed object w/ configs
              _.each(['SELECT'], writeAction => {
                listenForMemo[`${writeAction}_${_.snakeCase(eventKey)}_SUCCESS`.toUpperCase()] = {
                  eventConfig, eventKey, writeAction,
                };
              }, {});
              return listenForMemo;
            }, {});
          // 4. Update the state via external action responses if necessary
          const externalEventConfig = _.get(validListenForActions, localAction.type);
          if (externalEventConfig) {
            const { eventConfig } = externalEventConfig;
            localAction.response = transformResponse(localAction.response);
            output = updateState(
              _.cloneDeep(localState),
              _.cloneDeep(localAction.response),
              pkey,
              eventConfig,
            );
          }
          // Special actions
          if (
            (k === 'eventInvite' || k === 'eventInvitee' || k === 'memberEventInvitee') &&
            localAction.type === 'INSERT_MEMBER_SUCCESS'
          ) {
            output = initialState;
          }
          return output;
        };
        return m;
      }, {})).apply(this, args);
    },
  };
  return root;
}, {});
/* eslint-enable no-param-reassign */
