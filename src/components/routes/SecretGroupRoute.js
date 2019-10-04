import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const SecretGroupRoute = ({
  component: Component,
  hasCurrentGroup,
  extraProps,
  ...rest
}) => (
  <Route
    { ...rest }
    render={ props => (
      hasCurrentGroup ? (
        <Component
          { ...props }
          { ...extraProps }
        />
      ) : (
        <Redirect
          to={{
            pathname: '/secret',
            state: { from: props.location },
          }}
        />
      )
    ) }
  />
);

SecretGroupRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
  hasCurrentGroup: PropTypes.bool.isRequired,
  extraProps: PropTypes.object,
  location: PropTypes.object,
};

SecretGroupRoute.defaultProps = {
  extraProps: {},
  location: {},
};

export default SecretGroupRoute;
