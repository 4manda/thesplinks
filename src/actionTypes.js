/* eslint-disable no-param-reassign */
/* Exports all possible action constants as a single object */
import * as _ from 'lodash';
import citizenApi from 'config/api/citizen';

const basicConsts = [
  'CLICK_CHAT_THREAD',
  'UNSELECT_USER_GROUP',
  'ENTER_USER_GROUP',
  'VIEW_INVITE',
  'SAVE_INVITE',
  'ACCEPT_INVITE',
  'SET_TASK_VISIBILITY_FILTER',
];
const rpcConsts = [
  'SIGN_IN',
  'REGISTER',
  'VERIFY',
  'RENEW_SESSION',
  'LOGOUT',
  'CREATE_HOME',
];
const typeConsts = ['', '_REQUEST', '_SUCCESS', '_FAIL'];
const methods = ['SELECT_', 'INSERT_', 'UPDATE_', 'DELETE_'];

const basicActions = _.reduce(basicConsts, (result, action) => {
  result[action] = action;
  return result;
}, {});
const rpcActions = _.reduce(rpcConsts, (result, action) => {
  _.forEach(typeConsts, type => {
    result[`${action}${type}`] = `${action}${type}`;
  });
  return result;
}, {});
const citizenActions = _.reduce(citizenApi, (result, value, key) => {
  _.forEach(methods, method => {
    _.forEach(typeConsts, type => {
      const actionType = `${method}${_.snakeCase(key)}${type}`.toUpperCase();
      result[`${actionType}`] = `${actionType}`;
    });
  });
  return result;
}, {});

export default Object.assign(
  {},
  basicActions,
  rpcActions,
  citizenActions,
);
/* eslint-enable no-param-reassign */
