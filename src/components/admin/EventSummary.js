import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Segment, Header, Table } from 'semantic-ui-react';
import ManageInvitations from 'src/components/admin/ManageInvitations';

export class EventSummary extends React.Component {
  render() {
    const {
      event: {
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
      venue,
      userGroup: {
        userGroupUuid,
        userGroupTimezone,
      },
      eventInvites,
      eventInvitees,
      memberEventInvitees,
    } = this.props;
    const dtstart = moment.unix(eventDtstart).tz(userGroupTimezone);
    const day = dtstart.format('dddd, MMMM Do, YYYY');
    const time = dtstart.format('h:mma (z)');
    const dtend = moment.unix(eventDtstart + eventDuration).tz(userGroupTimezone);
    const endTime = dtend.format('h:mma');
    return (
      <Segment basic className="event-summary">
        <Header as="h2" textAlign="center">{ eventTitle }</Header>
        <Segment vertical>
          <Header as="h4" textAlign="center">Event Info</Header>
          <Table
            definition
            collapsing
            className="component__centered"
            renderBodyRow={ (row, idx) => ({
              key: row[0],
              cells: [
                { key: row[0], content: row[0], textAlign: 'right' },
                { key: row[1], content: row[1] },
              ],
            }) }
            tableData={ [
              ['Title:', eventTitle],
              ['Parent:', eventParentUuid],
              ['Date:', day],
              ['Time:', time],
              ['End:', endTime],
              ['Venue:', venue ? venue.venueName : ''],
              ['Message:', eventMessage],
              ['Description:', eventDescription],
              ['Attire:', eventAttire],
            ] }
          />
        </Segment>
        <Segment vertical>
          <Header as="h4" textAlign="center">Manage Invitations</Header>
          <ManageInvitations
            event={ this.props.event }
            userGroup={ this.props.userGroup }
            eventInvites={ eventInvites }
            eventInvitees={ eventInvitees }
            memberEventInvitees={ memberEventInvitees }
          />
        </Segment>
      </Segment>
    );
  }
}

EventSummary.propTypes = {
  event: PropTypes.object.isRequired,
  venue: PropTypes.object,
  userGroup: PropTypes.object.isRequired,
  eventInvites: PropTypes.array.isRequired,
  eventInvitees: PropTypes.array.isRequired,
  memberEventInvitees: PropTypes.array.isRequired,
};

export default EventSummary;
