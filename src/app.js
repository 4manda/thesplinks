import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';
import 'src/styles/styles.global.css';
import 'src/styles/styles.global.scss';
import { Icon, Loader, Button, Message, Menu } from 'semantic-ui-react';
import * as _ from 'lodash';
import {
  tryRenewSession,
  enumerateUserGroups,
  getUserGroupAndEvents,
  setCurrentMember,
  updateOnlineState,
} from 'src/actions';
import { getCurrentUserGroup, getCurrentMember } from 'src/selectors';
import { GroupSidebar, UserSidebar } from 'src/components/menus';
import PageRoutes from 'src/components/routes/PageRoutes';

const errorMessages = {
  offline: (
    <div>
      <div>You are currently offline.</div>
      <div>
        Please connect to the internet for the best experience and most up-to-data information.
      </div>
    </div>
  ),
  error: <div><div>Technical issues.</div><div>Some data may not have loaded correctly.</div></div>,
  unauthorized: 'You are unauthorized to access the data requested.',
};

export class App extends React.Component {
  constructor(props) {
    super(props);
    const pathname = props.location.pathname.split('/');
    this.state = {
      sidebarVisible: pathname[1] === 'user' ? true : false,
      sidebarAnimated: false,
      errorMessageVisible: false,
    };
    this._toggleSidebarVisibility = this._toggleSidebarVisibility.bind(this);
    this._hideSidebar = this._hideSidebar.bind(this);
    this._toggleErrorMessage = this._toggleErrorMessage.bind(this);
  }

  componentDidMount() {
    document.addEventListener('offline', this._onOffline);
    document.addEventListener('online', this._onOnline);
    window.addEventListener('offline', this._onOffline);
    window.addEventListener('online', this._onOnline);
    const sidebar = document.getElementById('app__sidebar');
    if (sidebar) {
      sidebar.addEventListener("transitionend", this._handleTransitionEnd);
    }
    this.props.tryRenewSession();
    if (this.props.isAuthed) {
      this.props.enumerateUserGroups();
    } else if (!this.props.hasGroupAndMember && this.props.hasSecret) {
      this.props.getUserGroupAndEvents();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAuthed && !prevProps.isAuthed) {
      this.props.enumerateUserGroups();
    } else if (!this.props.hasGroupAndMember && this.props.hasSecret && !prevProps.hasSecret) {
      this.props.getUserGroupAndEvents();
    }
    if (
      !_.isEqual(this.props.error, prevProps.error) ||
      (!this.props.isAppOnline && prevProps.isAppOnline)
    ) {
      this.setState({ errorMessageVisible: false });
    }
    const pathname = this.props.location.pathname.split('/');
    const prevPathname = prevProps.location.pathname.split('/');
    if (!_.isEqual(pathname[1], prevPathname[1])) {
      this.setState({
        sidebarVisible: pathname[1] === 'user' ? true : false,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('offline', this._onOffline);
    document.removeEventListener('online', this._onOnline);
    window.removeEventListener('offline', this._onOffline);
    window.removeEventListener('online', this._onOnline);
    const sidebar = document.getElementById('app__sidebar');
    if (sidebar) {
      sidebar.removeEventListener("transitionend", this._handleTransitionEnd);
    }
  }
  _handleTransitionEnd = () => {
    this.setState({ sidebarAnimated: false });
  }
  _onOffline = () => {
    this.props.updateOnlineState(false);
  }
  _onOnline = () => {
    this.props.updateOnlineState(true);
  }
  _toggleSidebarVisibility() {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
      sidebarAnimated: true,
    });
  }

  _hideSidebar() {
    this.setState({ sidebarVisible: false });
  }

  _toggleErrorMessage() {
    this.setState({ errorMessageVisible: !this.state.errorMessageVisible });
  }
  render() {
    const pathname = this.props.location.pathname.split('/');
    const pageRoutes = (
      <PageRoutes
        isAuthed={ this.props.isAuthed }
        hasSecret={ this.props.hasGroupAndMember }
        currentUserGroup={ this.props.currentUserGroup }
        currentUser={ this.props.currentUser }
        location={ this.props.location }
        history={ this.props.history }
      />
    );

    const error = !this.props.isAppOnline ? 'offline' : this.props.error;
    const appNotification = !!error && (
      <div className="app-notification">
        <Button
          className="app-notification-icon"
          icon={ this.state.errorMessageVisible ? 'close' : 'exclamation' }
          color="red"
          circular
          onClick={ this._toggleErrorMessage }
        />
        { this.state.errorMessageVisible && (
          <Message
            content={ errorMessages[error] }
            error
            className="app-error-message"
          />
        ) }
      </div>
    );

    const showGroupSidebar = this.props.hasGroupAndMember && pathname[1] !== 'user';
    const groupSidebar = !!showGroupSidebar && (
      <GroupSidebar
        currentUser={ this.props.currentUser }
        sidebarVisible={ this.state.sidebarVisible }
        sidebarAnimated={ this.state.sidebarAnimated }
        toggleVisibility={ this._toggleSidebarVisibility }
      />
    );
    const sidebarTrigger = !!showGroupSidebar && (
      <Menu
        secondary
        className={ `group-sidebar__icon group-sidebar__trigger ${this.state.sidebarVisible ? 'active' : ''}` }>
        <Menu.Item>
          <Button
            compact
            size="big"
            icon="content"
            title="Navigation Menu"
            tabIndex={ 0 }
            onClick={ e => {
              e.stopPropagation();
              e.preventDefault();
              this._toggleSidebarVisibility();
            } }
            onKeyPress={ e => {
              if (e.charCode === 13) {
                this._toggleSidebarVisibility();
              }
            } }
          />
        </Menu.Item>
      </Menu>
    );

    const showUserSidebar = this.props.isAuthed && pathname[1] === 'user';
    const userSidebar = !!showUserSidebar && (
      <UserSidebar
        sidebarVisible={ this.state.sidebarVisible }
        sidebarAnimated={ this.state.sidebarAnimated }
        toggleVisibility={ this._toggleSidebarVisibility }
        userGroups={ this.props.userGroups }
        members={ this.props.members }
        adminMembers={ this.props.memberRoles.filter(mr => (
          this.props.members.map(m => m.memberUuid).includes(mr.memberUuid) &&
          ['owner', 'manager'].includes(mr.memberRole)
        )).map(mr => mr.memberUuid) }
        events={ this.props.events }
        setCurrentMember={ this.props.setCurrentMember }
      />
    );

    const userSidebarTrigger = !!showUserSidebar && (
      <Menu
        secondary
        className={ `user-sidebar__icon user-sidebar__trigger ${this.state.sidebarVisible ? 'hidden' : ''}` }
        vertical>
        <Menu.Item>
          <Button
            basic
            compact
            icon="content"
            title="Expand Sidebar"
            tabIndex={ 0 }
            onClick={ e => {
              e.stopPropagation();
              e.preventDefault();
              this._toggleSidebarVisibility();
            } }
            onKeyPress={ e => {
              if (e.charCode === 13) {
                this._toggleSidebarVisibility();
              }
            } }
          />
        </Menu.Item>
      </Menu>
    );

    const classNames = [
      'height-100',
      this.state.sidebarVisible ? 'sidebar-visible' : '',
      this.props.isAppOnline ? 'app-wrapper__online' : 'app-wrapper__offline',
    ];

    return (
      <div className={ classNames.join(' ') }>
        <Helmet
          title="theSplinks.com"
          meta={ [{
            name: 'description',
            content: 'The Splinks Wedding Website',
          }] }
        />
        <Loader
          active={ this.props.isLoading }
          className="loader_full-page"
          size="large"
          content="Loading"
        />
        { groupSidebar || userSidebar }
        { pageRoutes }
        { appNotification }
        { sidebarTrigger || userSidebarTrigger }
      </div>
    );
  }
}

App.propTypes = {
  isAppOnline: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isAuthed: PropTypes.bool.isRequired,
  hasSecret: PropTypes.bool.isRequired,
  hasGroupAndMember: PropTypes.bool.isRequired,
  currentUserGroup: PropTypes.string,
  currentUser: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  userGroups: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  memberRoles: PropTypes.array.isRequired,
  tryRenewSession: PropTypes.func.isRequired,
  enumerateUserGroups: PropTypes.func.isRequired,
  updateOnlineState: PropTypes.func.isRequired,
  getUserGroupAndEvents: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
};

App.defaultProps = {
  currentUserGroup: undefined,
  currentUser: undefined,
  location: {},
};

const mapStateToProps = state => ({
  isAppOnline: state.globalState.isOnline,
  error: state.globalState.error,
  isAuthed: !!state.userSession.bearerToken,
  hasSecret: !!state.ephemeral.s && !!state.ephemeral.currentMember && !!state.ephemeral.currentUserGroup,
  hasGroupAndMember: !_.isEmpty(getCurrentUserGroup(state)) && !_.isEmpty(getCurrentMember(state)),
  currentUserGroup: state.ephemeral.currentUserGroup,
  currentUser: state.userSession.username,
  isLoading: state.globalState.isLoading,
  userGroups: state.citizen.userGroups,
  members: state.citizen.members.filter(m => m.username === state.userSession.username),
  memberRoles: state.citizen.memberRoles,
  events: state.member.events,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    tryRenewSession,
    enumerateUserGroups,
    updateOnlineState,
    getUserGroupAndEvents,
    setCurrentMember,
  }, dispatch)
);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
