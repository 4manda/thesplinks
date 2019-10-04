import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Header, Icon, Button, Grid } from 'semantic-ui-react';
import * as _ from 'lodash';

let navHistoryId = 0;

class UserSidebar extends React.Component {
  state = { expanded: '' };
  render() {
    navHistoryId++;
    const classNames = [
      'user__sidebar',
      this.props.sidebarVisible ? 'sidebar__visible' : '',
      this.props.sidebarAnimated ? 'sidebar__animatable' : '',
    ];
    return (
      <div
        id="user__sidebar"
        className={ classNames.join(' ') }>
        <Menu className="sidebar__menu" vertical>
          <Menu.Item className="sidebar__title">
            <Grid columns="equal">
              <Grid.Column textAlign="left">
                <Button
                  basic
                  compact
                  icon="caret left"
                  title="Collapse Sidebar"
                  onClick={ this.props.toggleVisibility }
                />
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Button
                  as={ NavLink }
                  to="/user"
                  title="User Account"
                  className="sidebar__menu-item"
                  id={ `sidebar-item__user-account` }
                  basic
                  compact
                  icon="user"
                />
              </Grid.Column>
            </Grid>
          </Menu.Item>
          { this.props.members.map(m => {
            const ug = this.props.userGroups.filter(ug => ug.userGroupUuid === m.userGroupUuid)[0];
            if (ug) {
              if (this.props.adminMembers.includes(m.memberUuid)) {
                return (
                  <Menu.Item
                    key={ ug.userGroupUuid }
                    title={ ug.userGroupUuid }
                    className="sidebar__menu-item">
                    <Header
                      title={ `Manage ${ug.userGroupUuid}` }
                      content={ ug.userGroupUuid }
                      as={ NavLink }
                      to={ `/user/${ug.userGroupUuid}/` }
                      onClick={ () => {
                        this.props.setCurrentMember(m.memberUuid, ug.userGroupUuid);
                        this.setState({ expanded: ug.userGroupUuid });
                      } }
                    />
                    { this.state.expanded === ug.userGroupUuid && (
                      <Menu.Menu>
                        <Menu.Item
                          as={ NavLink }
                          to="/home"
                          title="View Home Page"
                          className="sidebar__menu-item">
                          <Header>View</Header>
                        </Menu.Item>
                        <Menu.Item
                          as={ NavLink }
                          to={ `/user/${ug.userGroupUuid}/` }
                          title="Details"
                          exact
                          className="sidebar__menu-item">
                          <Header>Details</Header>
                        </Menu.Item>
                        <Menu.Item
                          as={ NavLink }
                          to={ `/user/${ug.userGroupUuid}/stats` }
                          title="Some Stats"
                          className="sidebar__menu-item">
                          <Header>Some Stats</Header>
                        </Menu.Item>
                        <Menu.Item className="sidebar__menu-item">
                          <Header
                            as={ NavLink }
                            to={ `/user/${ug.userGroupUuid}/events` }>
                            Events
                          </Header>
                          <Menu.Menu>
                            { this.props.events.map(e => {
                              return (
                                <Menu.Item key={ e.eventTitle }>
                                  <Header as="h5">{ e.eventTitle }</Header>
                                  <Menu.Menu>
                                    <Menu.Item
                                      content="Details"
                                      as={ NavLink }
                                      exact
                                      to={ `/user/${ug.userGroupUuid}/${e.eventTitle}` }
                                    />
                                    <Menu.Item
                                      content="Invitations"
                                      as={ NavLink }
                                      exact
                                      to={ `/user/${ug.userGroupUuid}/${e.eventTitle}/eventInvites` }
                                    />
                                  </Menu.Menu>
                                </Menu.Item>
                              );
                            }) }
                          </Menu.Menu>
                        </Menu.Item>
                      </Menu.Menu>
                    ) }
                  </Menu.Item>
                );
              }
              return (
                <Menu.Item
                  key={ ug.userGroupUuid }
                  as={ NavLink }
                  to="/home"
                  title={ `View ${ug.userGroupUuid}` }
                  onClick={ () => {
                    this.props.setCurrentMember(m.memberUuid, ug.userGroupUuid);
                  } }
                  className="sidebar__menu-item">
                  <Header content={ ug.userGroupUuid } />
                </Menu.Item>
              );
            }
            return null;
          }) }
          <Menu.Item
            as={ NavLink }
            to="/logout"
            title="Logout"
            id={ `sidebar-item__logout` }
            className="sidebar__menu-item sidebar__menu-item_bottom"
            onClick={ () => {} }>
            <Header>Logout</Header>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

UserSidebar.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  sidebarAnimated: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  userGroups: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  adminMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentMember: PropTypes.func.isRequired,
};

export default UserSidebar;
