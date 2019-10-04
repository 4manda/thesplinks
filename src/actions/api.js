import citizenAPI from 'config/api/citizen';
import memberAPI from 'config/api/member';
import publicAPI from 'config/api/public';
import * as _ from 'lodash';

const apiConfigs = {
  citizenActions: citizenAPI,
  memberActions: memberAPI,
  publicActions: publicAPI,
};

/* eslint-disable no-param-reassign */
export default _.extend({}, _.reduce(apiConfigs, (root, apiConfig, apiName) => {
  root[apiName] = _.reduce(apiConfig, (handlers, config, namespace) => {
    const Actions = _.cloneDeep(config.writeActions);
    if (config.canDelete) Actions.delete = {};
    _.forIn(Actions, (actionConfig, action) => {
      const { uri } = config;
      const actionSnakeCaps = (`${action}_${_.snakeCase(namespace)}`).toUpperCase();
      handlers[`${action}${_.upperFirst(namespace)}`] = (
        { queryParams, bodyArgs, headers, payload } = {},
      ) => ({
        types: actionSnakeCaps,
        forceCallAPI: config.pagination,
        payload,
        callAPI: state => {
          let fullUri = `${uri}`;
          if (queryParams) fullUri = `${uri}?${queryParams}`;
          return {
            api: `${config.root}Api`,
            url: fullUri,
            method: {
              update: 'PATCH', select: 'GET', insert: 'POST', delete: 'DELETE',
            }[action],
            headers,
            body: ['insert', 'update'].indexOf(action) >= 0 ? (
              _.extend(
                _.reduce(bodyArgs, (body, bodyArg, bodyArgKey) => {
                  body[_.snakeCase(bodyArgKey)] = bodyArg;
                  return body;
                }, {}),
                _.mapValues(actionConfig.bodyFromState, address => (
                  _.get(state, address)
                )),
              )
            ) : {},
          };
        },
      });
    });
    return handlers;
  }, {});
  return root;
}, {}));
/* eslint-enable no-param-reassign */
