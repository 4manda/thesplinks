import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import { Segment, Header, List, Table, Button, Grid } from 'semantic-ui-react';

export class SomeStats extends React.Component {
  render() {
    const {
      userGroup,
      members,
      events,
      eventInvites,
      eventInvitees,
      memberEventInvitees,
    } = this.props;

    let numUnmatchedMembers = 0;
    return (
      <Segment basic className="event-invite-summary">
        <Header textAlign="center">Members</Header>
        <Table celled unstackable structured striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={ 3 } content="Uuid" />
              <Table.HeaderCell width={ 2 } content="First" />
              <Table.HeaderCell width={ 2 } content="Last" />
              <Table.HeaderCell width={ 2 } content="Email" />
              <Table.HeaderCell width={ 2 } content="Phone" />
              <Table.HeaderCell width={ 2 } content="Location" />
              <Table.HeaderCell width={ 2 } content="No of Matches" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { members.filter(m => (
              m.userGroupUuid === userGroup.userGroupUuid &&
              !['amanda', 'Amanda'].includes(m.firstName)
            )).map(m => {
              const triedMatching = !!m.firstName || !!m.lastName || !!m.memberMobile || !!m.memberEmail || !!m.memberLocation;
              const foundMatch = memberEventInvitees.filter(mei => mei.memberUuid === m.memberUuid);
              if (triedMatching) {
                return (
                  <Table.Row key={ m.memberUuid }>
                    <Table.Cell>{ m.memberUuid }</Table.Cell>
                    <Table.Cell content={ m.firstName } />
                    <Table.Cell content={ m.lastName } />
                    <Table.Cell content={ m.memberEmail } />
                    <Table.Cell content={ m.memberMobile } />
                    <Table.Cell content={ m.memberLocation ? m.memberLocation.address1 : '' } />
                    <Table.Cell content={ foundMatch[0] ? foundMatch.length : '' } />
                  </Table.Row>
                );
              }
              numUnmatchedMembers++;
              return null;
            }) }
          </Table.Body>
        </Table>
        <Segment>
          Number of members not matched: { numUnmatchedMembers }
        </Segment>
        <Header textAlign="center">Invitees</Header>
        <Table celled unstackable structured striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={ 3 } content="Name" />
              <Table.HeaderCell width={ 1 } content="Event" />
              <Table.HeaderCell width={ 1 } content="Invite State" />
              <Table.HeaderCell width={ 1 } content="isConfirmed" />
              <Table.HeaderCell width={ 1 } content="No of matches" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { eventInvitees.map(eie => {
              const foundMatch = memberEventInvitees.filter(mei => mei.eventInviteeUuid === eie.eventInviteeUuid);
              const evt = events.filter(e => e.eventUuid === eie.eventUuid)[0].eventTitle;
              const inviteStatus = eventInvites.filter(ei => ei.eventInviteUuid === eie.eventInviteUuid)[0].eventInviteState;
              if (inviteStatus === 'responded' || foundMatch[0]) {
                return (
                  <Table.Row key={ eie.eventInviteeUuid }>
                    <Table.Cell content={ `${eie.firstName} ${eie.lastName}` } />
                    <Table.Cell content={ evt } />
                    <Table.Cell content={ inviteStatus === 'responded' ? 'responded' : '' } />
                    <Table.Cell content={ eie.eventInviteeIsConfirmed ? 'yes' : '' } />
                    <Table.Cell content={ foundMatch[0] ? foundMatch.length : '' } />
                  </Table.Row>
                );
              }
              return null;
            }) }
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

SomeStats.propTypes = {
  userGroup: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  eventInvites: PropTypes.array.isRequired,
  eventInvitees: PropTypes.array.isRequired,
  memberEventInvitees: PropTypes.array.isRequired,
};

export default SomeStats;
