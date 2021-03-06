import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import * as _ from 'lodash';

const NoSecretRoute = ({
  component: Component,
  hasCurrentGroup,
  extraProps,
  ...rest
}) => {
  // If the user has been Redirected to the Public Component, store the pathname
  // of the route they originally were connecting to in 'from', otherwise
  // redirect them to the home page '/'.
  const from = _.get(rest.location, 'state.from.state.from.pathname') ||
    _.get(rest.location, 'state.from.pathname');
  return (
    <Route
      { ...rest }
      render={ props => (
        !hasCurrentGroup ? (
          <Component
            { ...props }
            { ...extraProps }
          />
        ) : (
          <Redirect
            to={ from ? { pathname: from } : { pathname: '/home' } }
          />
        )
      ) }
    />
  );
};

NoSecretRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
  hasCurrentGroup: PropTypes.bool.isRequired,
  extraProps: PropTypes.object,
  location: PropTypes.object,
};

NoSecretRoute.defaultProps = {
  extraProps: {},
  location: {},
};

export default NoSecretRoute;
