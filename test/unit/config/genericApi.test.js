import * as _ from 'lodash';
import citizenApiConfig from 'config/api/citizen';

// const EXPECTED_KEYS = [
//   'writeActions',
//   'writeActions.insert',
//   'writeActions.update',
//   'writeActions.select',
//   'canDelete',
// ];

const REQUIRED_KEYS = [
  'initialState',
  'uri',
  'root',
  'pkey',
  'writeActions',
];

// const allKeys = [].concat(
//   EXPECTED_KEYS, REQUIRED_KEYS
// );

// const checkApiDeeply = function (api) {
//   _.forEach(api, (val, prop) => {
//     if (allKeys.indexOf(prop) === -1) {
//       if (_.isObject(val)) {

//       }
//     }
//   });
// };

describe('Citizen API configuration', function () {
  _.forEach(citizenApiConfig, (api, key) => {
    describe(`${key} API`, function () {
      it('should contain all required keys', function () {
        REQUIRED_KEYS.forEach(requiredKey => {
          expect(_.has(api, requiredKey))
            .to.not.be.false;
        });
      });
    });
  });
});
