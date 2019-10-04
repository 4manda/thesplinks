import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Menu, Header, Grid } from 'semantic-ui-react';
import RsvpButton from 'src/containers/rsvp/RsvpButton';
import * as _ from 'lodash';
import content from 'src/content/group';

let navHistoryId = 0;

class GroupSidebar extends React.Component {
  render() {
    navHistoryId++;
    const { currentUser } = this.props;
    const classNames = [
      'group__sidebar',
      this.props.sidebarVisible ? 'sidebar__visible' : '',
      this.props.sidebarAnimated ? 'sidebar__animatable' : '',
    ];
    return (
      <div
        onClick={ this.props.toggleVisibility }
        id="group__sidebar"
        className={ classNames.join(' ') }>
        <Menu className="sidebar__menu" vertical>
          <Menu.Item className="sidebar__title">
            <Grid>
              <Grid.Column width={ 16 } textAlign="right">
                <RsvpButton
                  className="rsvp-button__nav"
                  onClick={ this.props.toggleVisibility }
                />
              </Grid.Column>
            </Grid>
          </Menu.Item>
          { content.map(p => {
            if (p.hidden) return null;
            return (
              <Menu.Item
                key={ p.name }
                as={ NavLink }
                to={ p.isSeparatePage ? `/${_.kebabCase(p.name)}` : {
                  pathname: `/home/${_.kebabCase(p.name)}`,
                  state: { navHistoryId },
                } }
                title={ _.startCase(p.title || p.name) }
                id={ `sidebar-item--${_.kebabCase(p.name)}` }
                className="sidebar__menu-item"
                onClick={ this.props.toggleVisibility }>
                <Header>
                  { _.startCase(p.title || p.name) }
                </Header>
              </Menu.Item>
            );
          }) }
          <Menu.Item
            as={ NavLink }
            to="/logout"
            title="Logout of Session"
            className="sidebar__menu-item sidebar__menu-item_bottom">
            <Header>Logout</Header>
          </Menu.Item>
          <Menu.Item
            style={ !currentUser ? { display: 'none' } : undefined }
            as={ NavLink }
            to={ currentUser ? '/user' : '/login' }
            title={ currentUser || 'Login' }
            className="sidebar__menu-item">
            <Header>{ currentUser || 'Login' }</Header>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

GroupSidebar.propTypes = {
  currentUser: PropTypes.string,
  sidebarVisible: PropTypes.bool.isRequired,
  sidebarAnimated: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
};

export default GroupSidebar;
