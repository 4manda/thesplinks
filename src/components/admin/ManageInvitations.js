import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import { Segment, Header, List, Table, Button, Grid } from 'semantic-ui-react';

export class ManageInvitations extends React.Component {
  state = { showAll: false };

  _toggleFilter = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const {
      event: {
        userGroupUuid,
        eventUuid,
        eventTitle,
        eventParentUuid,
        eventBannerImgSrc,
        eventDtstart,
        eventDuration,
        venueUuid,
        eventDescription,
        eventMessage,
        eventAttire,
      },
      eventInvites,
      eventInvitees,
      memberEventInvitees,
    } = this.props;
    const responded = eventInvites.filter(ei => ei.eventInviteState !== 'no_reply');
    const notResponded = eventInvites.filter(ei => ei.eventInviteState === 'no_reply');
    const filteredInvites = this.state.showAll ? eventInvites : responded;

    let filteredInvitees = 0;
    let totalConfirmed = 0;
    let totalDeclined = 0;
    let guestsAllowed = 0;
    let guestsConfirmed = 0;

    return (
      <Segment basic className="event-invite-summary">
        <Header textAlign="center">Manage Invitations</Header>
        <Button
          primary
          content={ this.state.showAll ? 'Filter Responded' : 'Show All' }
          onClick= { this._toggleFilter }
        />
        <Table celled unstackable structured striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={ 3 } content="Invites" />
              <Table.HeaderCell width={ 3 } content="Invitees" />
              <Table.HeaderCell width={ 1 } content="Yes" />
              <Table.HeaderCell width={ 1 } content="No" />
              <Table.HeaderCell width={ 1 } content="Guests Allowed" />
              <Table.HeaderCell width={ 1 } content="Guests Confirmed" />
              <Table.HeaderCell width={ 1 } content="No of Matches" />
              <Table.HeaderCell width={ 5 } content="Message" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { filteredInvites.map(ei => {
              const invitees = eventInvitees.filter(eie => eie.eventInviteUuid === ei.eventInviteUuid);
              const matches = memberEventInvitees.filter(mei => mei.eventInviteUuid === ei.eventInviteUuid);
              if (invitees[0]) {
                const inviteeRows = invitees.map(i => {
                  if (ei.eventInviteState !== 'no_reply') {
                    if (!i.eventInviteeIsConfirmed) {
                      totalDeclined++;
                    } else {
                      totalConfirmed++;
                    }
                    guestsConfirmed = guestsConfirmed + i.eventInviteeGuestsConfirmed;
                  }
                  filteredInvitees++;
                  guestsAllowed = guestsAllowed + i.eventInviteeGuestsAllowed;
                  const fullName = `${i.firstName} ${i.lastName}`;
                  return [[
                    <Table.Cell
                      key="fullName"
                      selectable
                      content={ (
                        <Link to={ `/user/${userGroupUuid}/${eventTitle}/${ei.eventInviteTitle}/${fullName}` }>
                          { fullName }
                        </Link>
                      ) }
                    />,
                    <Table.Cell key="isConfirmed" content={ ei.eventInviteState === 'no_reply' ? '-' : i.eventInviteeIsConfirmed ? 1 : '' } />,
                    <Table.Cell key="!isConfirmed" content={ ei.eventInviteState === 'no_reply' ? '-' : i.eventInviteeIsConfirmed ? '' : 1 } />,
                    <Table.Cell key="guestsAllowed" content={ i.eventInviteeGuestsAllowed || '' } />,
                    <Table.Cell key="guestsConfirmed" content={ i.eventInviteeGuestsConfirmed || '' } />,
                    <Table.Cell key="matches" content={ matches.filter(mei => mei.eventInviteeUuid === i.eventInviteeUuid).length || '' } />,
                  ]];
                });
                const firstRow = [
                  <Table.Row key={ ei.eventInviteUuid }>
                    <Table.Cell rowSpan={ invitees.length } selectable>
                      <Link to={ `/user/${userGroupUuid}/${eventTitle}/${ei.eventInviteTitle}` }>
                        { ei.eventInviteTitle }
                      </Link>
                    </Table.Cell>
                    { inviteeRows[0] }
                    <Table.Cell rowSpan={ invitees.length } content={ ei.eventInviteFreeResponse } />
                  </Table.Row>
                ];
                const nextRows = inviteeRows.slice(1).map((row, idx) => {
                  return (
                    <Table.Row key={ `${invitees[idx].firstName}${invitees[idx].lastName}` }>
                      { row }
                    </Table.Row>
                  );
                });
                return firstRow.concat(nextRows);
              }
              return null;
            }) }
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell content={ filteredInvites.length } />
              <Table.HeaderCell content={ filteredInvitees } />
              <Table.HeaderCell content={ totalConfirmed } />
              <Table.HeaderCell content={ totalDeclined } />
              <Table.HeaderCell content={ guestsAllowed } />
              <Table.HeaderCell content={ guestsConfirmed } />
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    );
  }
}

ManageInvitations.propTypes = {
  event: PropTypes.object.isRequired,
  eventInvites: PropTypes.array.isRequired,
  eventInvitees: PropTypes.array.isRequired,
  memberEventInvitees: PropTypes.array.isRequired,
};

export default ManageInvitations;
