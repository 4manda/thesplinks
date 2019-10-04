/* eslint-disable no-param-reassign */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { callAPIMiddleware } from 'kit/lib/callAPIMiddleware';
import { loadState } from 'kit/lib/utils';
import Immutable from 'seamless-immutable';
import ephemeral from 'src/reducers/ephemeral';
import userSession from 'src/reducers/userSession';
import apiReducers from 'src/reducers/api';
import globalState from 'src/reducers/globalState';
import version from 'src/reducers/version';

// All reducers, in one array
const reducers = [
  userSession,
  ephemeral,
  apiReducers,
  globalState,
  version,
];

// Helper function that 'unwinds' the { reducerKey {state, reducer} } format
// from each imported reducer, and either returns the 'reducer' function (if
// true) or the 'state', as an Immutable collection or the default state
function unwind(reducer = true) {
  // Get the combined reducers 'reducer' or 'state' object
  const r = Object.assign(
    {},
    ...[].concat(...reducers.map(arr => (
      Object.keys(arr).map(key => ({
        [key]: arr[key][reducer ? 'reducer' : 'state'],
      }))
    ))),
  );

  // If this is a reducer, return at this point
  if (reducer) return r;

  // We're looking for the state -- so let's map it
  return Object.assign({}, ...Object.keys(r).map(key => ({
    [key]: Immutable(r[key]),
  })));
}

const appReducer = combineReducers({
  ...unwind(),
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = {
      globalState: state.globalState,
    };
  }

  return appReducer(state, action);
};

export default function createNewStore() {
  let persistedState = loadState();

  const store = createStore(
    rootReducer,
    // initial state
    {
      ...unwind(false),
      ...persistedState,
    },
    compose(
      applyMiddleware(
        thunk,
        callAPIMiddleware,
      ),
      // Enable Redux Devtools on the browser, for easy state debugging
      // eslint-disable-next-line no-underscore-dangle
      (process.env.NODE_ENV !== 'production' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );

  return store;
}
/* eslint-enable no-param-reassign */
