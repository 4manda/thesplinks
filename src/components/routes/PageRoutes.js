import React from 'react';
import PropTypes from 'prop-types';

// Info pages
import content from 'src/content/group';
import SinglePage from 'src/components/SinglePage';
import Content from 'src/components/info/Content';
import ConnectedContent from 'src/containers/ConnectedContent';
import RSVP from 'src/containers/rsvp/RsvpContainer';

// Auth pages
import Secret from 'src/containers/userSession/SecretContainer';
import Login from 'src/containers/userSession/LoginContainer';
import Register from 'src/containers/userSession/Register';
import UserSettings from 'src/containers/userSession/UserSettings';
import Logout from 'src/containers/userSession/LogoutContainer';

// Admin pages
import UserContainer from 'src/containers/admin';

// Route Components
import { Switch, Route } from 'react-router-dom';
import NotFound from './NotFound'; // NotFount 404 handler for unknown routes
import PrivateRoute from './PrivateRoute';
import SecretGroupRoute from './SecretGroupRoute';
import PublicRoute from './PublicRoute';
import NoSecretRoute from './NoSecretRoute';


class PageRoutes extends React.Component {
  componentWillUpdate(nextProps) {
    const { location } = this.props;

    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }

  previousLocation = this.props.location;

  render() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );
    const globalProps = {
      currentUserGroup: this.props.currentUserGroup,
      currentUser: this.props.currentUser,
    };

    // Pages that require userSession
    const privatePages = [
      { path: 'user/:userGroupUuid/:eventTitle/:eventInviteTitle/:firstName/:lastName', component: UserContainer },
      { path: 'user/:userGroupUuid/:eventTitle/:eventInviteTitle', component: UserContainer },
      { path: 'user/:userGroupUuid/:eventTitle', component: UserContainer },
      { path: 'user/:userGroupUuid', component: UserContainer },
      { path: 'user', component: UserContainer },
      { path: 'logout', component: Logout },
    ];

    // Pages that require currentMember and currentUserGroup objects
    const groupPages = [
      { path: 'logout', component: Logout },
      { path: 'home/:page', component: SinglePage },
      { path: 'home', component: SinglePage },
      { path: 'rsvp/:page', component: RSVP, modal: true },
      { path: 'rsvp', component: RSVP, modal: true },
      ...content.filter(page => page.isSeparatePage).map(page => ({
        path: page.name,
        component: page.component ? ConnectedContent : Content,
        props: page,
      })),
    ];

    // Pages that require you to not have a secret
    const noSecretPages = [
      { path: 'secret', component: Secret },
    ];

    // Pages that require you to not have a userSession
    const publicPages = [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ];

    return (
      <div className="height-100">
        <Switch location={ isModal ? this.previousLocation : location }>
          <NoSecretRoute
            exact
            path="/"
            component={ Secret }
            hasCurrentGroup={ this.props.hasSecret }
            extraProps={{
              ...globalProps,
              ...page.props,
            }}
          />
          { groupPages.map(page => (
            <SecretGroupRoute
              key={ page.path }
              path={ `/${page.path}` }
              component={ page.component }
              hasCurrentGroup={ this.props.hasSecret }
              extraProps={{
                ...globalProps,
                ...page.props,
              }}
            />
          )) }
          { privatePages.map(page => (
            <PrivateRoute
              key={ page.path }
              path={ `/${page.path}` }
              component={ page.component }
              isAuthed={ this.props.isAuthed }
              extraProps={{
                ...globalProps,
                ...page.props,
              }}
            />
          )) }
          { noSecretPages.map(page => (
            <NoSecretRoute
              key={ page.path }
              path={ `/${page.path}` }
              component={ page.component }
              hasCurrentGroup={ this.props.hasSecret }
              extraProps={{
                ...globalProps,
                ...page.props,
              }}
            />
          )) }
          { publicPages.map(page => (
            <PublicRoute
              key={ page.path }
              path={ `/${page.path}` }
              component={ page.component }
              isAuthed={ this.props.isAuthed }
              extraProps={{
                ...globalProps,
                ...page.props,
              }}
            />
          )) }
          <Route component={ NotFound } />
        </Switch>
        { isModal ? (
          <Switch>
            { groupPages.filter(page => page.modal).map(page => (
              <SecretGroupRoute
                key={ page.path }
                path={ `/${page.path}` }
                component={ page.component }
                hasCurrentGroup={ this.props.hasSecret }
                extraProps={{
                  ...globalProps,
                  ...page.props,
                }}
              />
            )) }
            { privatePages.map(page => (
              <PrivateRoute
                key={ page.path }
                path={ `/${page.path}` }
                component={ page.component }
                isAuthed={ this.props.isAuthed }
                extraProps={{
                  ...globalProps,
                  ...page.props,
                }}
              />
            )) }
            { noSecretPages.filter(page => page.modal).map(page => (
              <NoSecretRoute
                key={ page.path }
                path={ `/${page.path}` }
                component={ page.component }
                hasCurrentGroup={ this.props.hasSecret }
                extraProps={{
                  ...globalProps,
                  ...page.props,
                }}
              />
            )) }
            { publicPages.filter(page => page.modal).map(page => (
              <PublicRoute
                key={ page.path }
                path={ `/${page.path}` }
                component={ page.component }
                isAuthed={ this.props.isAuthed }
                extraProps={{
                  ...globalProps,
                  ...page.props,
                }}
              />
            )) }
          </Switch>
        ) : null }
      </div>
    );
  }
}

PageRoutes.propTypes = {
  hasSecret: PropTypes.bool,
  isAuthed: PropTypes.bool,
  currentUser: PropTypes.string,
  currentUserGroup: PropTypes.string,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

PageRoutes.defaultProps = {
  hasSecret: false,
  isAuthed: false,
  currentUser: undefined,
  currentUserGroup: undefined,
};

export default PageRoutes;
