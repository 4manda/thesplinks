/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

// <Status code="xxx"> component.  Updates the context router's context, which
// can be used by the server handler to respond to the status on the server.
class Status extends React.PureComponent {
  static propTypes = {
    code: PropTypes.number.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const { code, children } = this.props;
    return (
      <Route render={ ({ staticContext }) => {
        if (staticContext) {
          staticContext.status = code;
        }
        return children;
      } }
      />
    );
  }
}

// <NotFound> component.  If this renders on the server in development mode,
// it will attempt to proxyify the request to the upstream `webpack-dev-server`.
// In production, it will issue a hard 404 and render.  In the browser, it will
// simply render.
class NotFound extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const { children } = this.props;
    return (
      <Status code={ 404 }>
        { children }
      </Status>
    );
  }
}

export default NotFound;
/* eslint-enable no-param-reassign */
