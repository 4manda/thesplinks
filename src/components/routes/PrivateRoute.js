import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  component: Component,
  isAuthed,
  extraProps,
  ...rest,
}) => (
  <Route
    { ...rest }
    render={ props => (
      isAuthed ? (
        <Component
          { ...props }
          { ...extraProps }
        />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    ) }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
  isAuthed: PropTypes.bool.isRequired,
  extraProps: PropTypes.object,
  location: PropTypes.object,
};

PrivateRoute.defaultProps = {
  extraProps: {},
  location: {},
};

export default PrivateRoute;
