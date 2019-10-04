/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Segment, Header, Icon } from 'semantic-ui-react';

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
  render() {
    return (
      <Status code={ 404 }>
        <Segment basic textAlign="center">
          <Header as="h1" icon>
            <Icon name="broken chain" />
            Unknown route - <Link to="/">Go Home</Link>
          </Header>
        </Segment>
      </Status>
    );
  }
}

export default NotFound;
/* eslint-enable no-param-reassign */
