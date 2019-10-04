import 'regenerator-runtime/runtime'; // Enable async/await and generators, cross-browser
import 'babel-polyfill';
import 'kit/lib/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import createNewStore from 'kit/lib/redux';
import createHistory from 'history/createHashHistory';
import { saveState } from 'kit/lib/utils';
import App from 'src/app';

const store = createNewStore(); // Create a new Redux store

// Subscribe to changes in the store to update localStorage for persisting state
store.subscribe(throttle(() => {
  saveState({
    version: store.getState().version,
    userSession: store.getState().userSession,
    ephemeral: store.getState().ephemeral,
    citizen: store.getState().citizen,
    member: store.getState().member,
  });
}, 1000));

// Disable react_devtools for production
if (process.env.NODE_ENV === 'production' && typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
	for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
		window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value === "function" ? () => {} : null;
	}
}

// Create the 'root' entry point into the app.
function doRender() {
  ReactDOM.render(
    <Root />,
    document.getElementById('main'),
  );
}

// The <Root> component.  We'll run this as a self-contained function since
// we're using a bunch of temporary vars that we can safely discard.
//
// If we have hot reloading enabled (i.e. if we're in development), then
// we'll wrap the whole thing in <AppContainer> so that our views can respond
// to code changes as needed. Otherwise, we'll jump straight to the browser router
const Root = (() => {
  // Wrap the component hierarchy in <BrowserRouter>, so that our children
  // can respond to route changes
  let Chain;
  if (!window.cordova) {
    Chain = () => (
      <Provider store={ store }>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  } else {
    const history = createHistory();
    Chain = () => (
      <Provider store={ store }>
        <Router history={ history }>
          <App />
        </Router>
      </Provider>
    );
  }

  // React hot reloading -- only enabled in development.
  if (module.hot) {
    // <AppContainer> will respond to our Hot Module Reload (HMR) changes
    // back from WebPack, and handle re-rendering the chain as needed
    const { AppContainer } = require('react-hot-loader');

    // Start our 'listener' at the root component, so that any changes that
    // occur in the hierarchy can be captured
    module.hot.accept('src/app', () => {
      // Refresh the entry point of our app, to get the changes.

      // eslint-disable-next-line
      require('src/app').default;

      // Re-render the hierarchy
      doRender();
    });

    return () => (
      <AppContainer>
        <Chain />
      </AppContainer>
    );
  }
  return Chain;
})();

if (!window.cordova) {
  doRender();
} else {
  document.addEventListener('deviceready', doRender, false);
}
