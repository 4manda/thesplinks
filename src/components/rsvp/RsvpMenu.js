import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Menu, Segment, Icon, Button } from 'semantic-ui-react';
import RsvpForm from 'src/components/rsvp/RsvpForm';

export class RsvpMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  _handleTabClick = (e, { index }) => {
    this.setState({ activeTab: index });
  }

  render() {
    const { userGroup, invites, invitees, events } = this.props;
    const currentInvite = invites[this.state.activeTab];
    const invitationTabs = invites.map((tab, index) => {
      const matchingEvent = _.find(events, ['eventUuid', tab.eventUuid]);
      if (matchingEvent) {
        const title = matchingEvent.eventTitle;
        return (
          <Menu.Item
            key={ tab.eventInviteUuid }
            name={ tab.eventUuid }
            index={ index }
            active={ this.state.activeTab === index }
            onClick={ this._handleTabClick }>
            { tab.eventInviteState === 'no_reply' && (
              <Icon name="asterisk" color="red" />
            ) }
            { title }
          </Menu.Item>
        );
      }
      return null;
    });
    if (invitationTabs[0] && currentInvite) {
      return (
        <div>
          <Menu
            className="rsvp__menu"
            attached="top"
            tabular
            widths={ invitationTabs.length }>
            { invitationTabs }
          </Menu>
          <Segment className="rsvp__content" attached="bottom" textAlign="center">
            <RsvpForm
              userGroup={ userGroup }
              invite={ currentInvite }
              invitees={ invitees.filter(ei => ei.eventInviteUuid === currentInvite.eventInviteUuid) }
              event={ events.filter(e => e.eventUuid === currentInvite.eventUuid)[0] }
              updateEventInvite={ this.props.updateEventInvite }
              updateEventInvitee={ this.props.updateEventInvitee }
            />
          </Segment>
          <Button
            className="button__link"
            onClick={ () => {
              this.props.insertMember();
            } }>
            Not your invitations?
          </Button>
        </div>
      );
    }
    return <div>No Invites Found</div>;
  }
}

RsvpMenu.propTypes = {
  userGroup: PropTypes.object.isRequired,
  invitees: PropTypes.array.isRequired,
  invites: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  memberEventInvitees: PropTypes.array.isRequired,
  updateEventInvite: PropTypes.func.isRequired,
  updateEventInvitee: PropTypes.func.isRequired,
  insertMember: PropTypes.func.isRequired,
};

export default RsvpMenu;
