import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import { Segment, Header, List, Table, Button, Grid } from 'semantic-ui-react';

export class EventInviteSummary extends React.Component {
  render() {
    const {
      event: {
        eventUuid,
        eventTitle,
        eventParentUuid,
      },
      eventInvite: {
        userGroupUuid,
        eventInviteTitle,
        eventInvitePrimaryEmail,
        eventInviteState,
        eventInviteFreeResponse,
      },
      eventInvitees,
    } = this.props;

    return (
      <Segment basic className="event-invite-summary">
        <Header>{ eventInviteTitle }</Header>
        <Segment vertical>
          <Header as="h4" textAlign="center">Event Invite Summary</Header>
          <Table
            definition
            collapsing
            padded="very"
            className="component__centered"
            renderBodyRow={ (row, idx) => ({
              key: row[0],
              cells: [
                { key: row[0], content: row[0], textAlign: 'right' },
                { key: row[1], content: row[1] },
              ],
            }) }
            tableData={ [
              ['Title:', eventInviteTitle],
              ['Primary Email:', eventInvitePrimaryEmail],
              ['Status:', eventInviteState],
              ['Message', eventInviteFreeResponse],
            ] }
          />
        </Segment>
        <Segment vertical>
          <Header as="h4" textAlign="center">Invitees</Header>
          <List>
            { eventInvitees.map(eie => (
              <List.Item key={ eie.eventInviteeUuid }>
                <Link to={ `/user/${userGroupUuid}/${eventTitle}/${eventInviteTitle}/${eie.firstName}/${eie.lastName}` }>
                  { eie.firstName } { eie.lastName }
                </Link>
              </List.Item>
            )) }
            <List.Item content="+ Invitee" />
          </List>
        </Segment>
      </Segment>
    );
  }
}

EventInviteSummary.propTypes = {
  event: PropTypes.object.isRequired,
  eventInvite: PropTypes.object.isRequired,
  eventInvitees: PropTypes.array.isRequired,
};

export default EventInviteSummary;
