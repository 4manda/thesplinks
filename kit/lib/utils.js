/* eslint-disable */
import * as _ from 'lodash';
import moment from 'moment';
import * as CryptoJS from 'crypto-js'

const _validationMethods = {
  'updateState': (oldState, newState, pkey) => {
     if (!oldState || !newState) {
      throw new Error(`Missing one: ${JSON.stringify(oldState)}, ${JSON.stringify(newState)}, ${pkey}`);
     }

    if (_.isArray(newState) && !pkey) {
      throw new Error(`newState is of type array but no pkey was defined ${JSON.stringify(newState)}`);
    }

    if (!_.isArray(oldState) && _.isArray(newState)) {
      throw new Error(`Type mismatch for newState ${JSON.stringify(newState)} and oldState ${JSON.stringify(oldState)}`);
    }

    if (!_.isArray(newState)) {
      const keyedState = _.keys(_.keyBy([newState], pkey));
      if (keyedState[0].search(/undefined/) >= 0) {
        throw new Error(`newState ${JSON.stringify(newState)} does not have key ${pkey}`);
      }
    }

    return true;
  },
};

export function scrollToBottom(element) {
  const ul = document.getElementById(element);
  if (ul) {
    ul.scrollTop = ul.scrollHeight;
  }
}

/**
 * Helper function until feature switches are supported.
 */
export function featureIsActive(featureName) {
  return {
    'forgotUserPass': false,
  }[featureName];
}

export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g, (c) => {
      let r = Math.random()*16|0;
      let v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }
  );
}

function localStorageAvailable() {
  try {
    const storage = window['localStorage'];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

export const localStorage = {
  setItem: function (item, value) {
    if (!localStorageAvailable()) {
      return false;
    }
    window.localStorage.setItem(item, JSON.stringify(value))
  },
  getItem: function (item) {
    if (!localStorageAvailable() || !window.localStorage[item]) {
      return false;
    }
    return JSON.parse(window.localStorage.getItem(item));
  },
  removeItem: function (item) {
    if (!localStorageAvailable()) {
      return false;
    }
    window.localStorage.removeItem(item);
  },
}

export function loadState() {
  try {
    const base64 = localStorage.getItem('wState');
    if (!base64) {
      return undefined;
    }
    const parsedWordArray = CryptoJS.enc.Base64.parse(base64);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    const loadedState = JSON.parse(parsedStr);
    if (loadedState && process.env.VERSION !== loadedState.version) {
      // Persist currentGroup data and make backwards compatible with old state shape;
      const ephemeral = loadedState.ephemeral ? _.cloneDeep(loadedState.ephemeral) : {
        currentUserGroup: 'thesplinks.com',
      };
      if (
        !ephemeral.currentMember &&
        loadedState.citizen &&
        loadedState.citizen.members &&
        loadedState.citizen.members[0]
      ) {
        ephemeral.currentMember = loadedState.citizen.members[0].memberUuid;
      }
      if (!ephemeral.s && loadedState.s) {
        ephemeral.s = loadedState.s;
      }
      return {
        userSession: loadedState.userSession || {},
        ephemeral,
        version: process.env.VERSION,
      };
    }
    return loadedState;
  } catch (err) {
    localStorage.removeItem('wState');
    return undefined;
  }
}

export function saveState(state) {
  try {
    const rawStr = JSON.stringify(state);
    const wordArray = CryptoJS.enc.Utf8.parse(rawStr);
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    localStorage.setItem('wState', base64);
  } catch (err) {
    // Ignore write errors
  }
}

export function transformResponse(resp) {
  if (resp instanceof Array) {
    for (var a = 0; a < resp.length; a++) {
      resp[a] = transformResponse(resp[a]);
    }
  } else if (resp instanceof Object) {
    return _.reduce(resp, (m, v, k) => {
      let cameled = _.camelCase(k);
      if (v instanceof Object || v instanceof Array) {
        m[cameled] = transformResponse(v);
      } else {
        m[cameled] = v;
      }
      return m;
    }, {});
  }
  return resp;
}

export function convertLocationToComposite(location) {
  const parts = ['address1', 'address2', 'city', 'state_province', 'zip_postal', 'country', 'uri', 'link1', 'link2', 'lat_long'];
  const compLocation = `(${parts.map(p => location[p] || '').join(',')})`;
  return compLocation;
}

export function snakeCaseObject(obj) {
  if (_.isArray(obj)) {
    return obj.map(i => snakeCaseObj(i));
  } else if (_.isObject(obj)) {
    return _.reduce(obj, (m, v, k) => {
      let snaked = _.snakeCase(k);
      snaked = snaked.replace(/(_)([0-9])/, '$2');
      if (_.isArray(v) || _.isObject(v)) {
        m[snaked] = snakeCaseObject(v);
      } else {
        m[snaked] = v;
      }
      return m;
    }, {});
  }
  return obj;
}

export function getSignature(accessToken) {
  let timestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSS");
  return {
    timestamp,
    signature: btoa(CryptoJS.HmacSHA256(timestamp, accessToken).toString()),
  }
}

function getSubstateAndUpdate(newTopState, mapping) {
  const newSubState = _.reduce(newTopState, (result, item) => {
    if (typeof mapping === 'string') {
      const newStateVal = _.get(item, mapping);
      if (_.isArray(newStateVal)) {
        return [...result, ...newStateVal];
      } else if (newStateVal) {
        return [...result, newStateVal];
      }
    } else if (_.isObject(mapping)) {
      _.forEach(mapping, (mapToKey, mapFromKey) => {
        const subStateVal = _.get(item, mapFromKey);
        if (_.isArray(subStateVal)) {
          result = [...result, ...getSubstateAndUpdate(subStateVal, mapToKey)];
        } else if (subStateVal) {
          result = [...result, ...getSubstateAndUpdate([subStateVal], mapToKey)];
        }
      });
    }
    return result;
  }, [])
  return newSubState;
}
/**
 * Update a standard API state, whether it's an object or an array.
 * @prop {Object[]} oldState - The current state. Collection or object.
 * @prop {Object[]} newState - The new state. Collection or object.
 * @prop {String} pkey - Primary key for the objects.
 */
export function updateState(oldState, newState, pkey, mapping) {
  // 1. Check assumptions
  _validationMethods['updateState'].apply(this, arguments);
  // 2. Handle if expected state is an array
  if (_.isArray(oldState)) {
    newState = _.isArray(newState) ? newState : [newState];
    if (mapping) {
      newState = getSubstateAndUpdate(newState, mapping);
    }
    // 1. Represent items via pkey & extend
    return _.values(
      _.extend({}, _.keyBy(oldState, pkey), _.keyBy(newState, pkey))
    );
  }
  // 3. Handle if expected state is object, but new state is array
  if (_.isArray(newState) && newState.length === 1) {
    return _.extend({}, oldState, newState[0]);
  }
  // 4. If both are objects, simply extend.
  return _.extend({}, oldState, newState);
};

export function deleteItemFromState(oldState, itemToDelete, pkey) {
  const newState = _.cloneDeep(oldState);
  if (_.isArray(itemToDelete)) [itemToDelete] = itemToDelete;
  _.remove(newState, item => {
    if (typeof (pkey) === 'function') {
      return pkey(item) === pkey(itemToDelete);
    }
    return item[pkey] === itemToDelete[pkey];
  });
  return newState;
};

export function getPictureForEmail(email) {
  return `http://www.gravatar.com/avatar/${CryptoJS.MD5(email)}`;
};

export function getClassNames() {
  const classNames = [];
  _.forEach(arguments, arg => {
    arg && typeof arg === 'string' && classNames.push(arg);
  });
  return classNames.join(' ');
};
export function frontEndTwilioPhoneNumberValidator(phoneNumber) {
  return true;
}
/* eslint-enable */
