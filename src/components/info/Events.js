import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Segment, Header, List } from 'semantic-ui-react';

class Events extends React.Component {
  render() {
    const { venues, userGroup } = this.props;
    const events = this.props.events.filter(e => !e.eventIsPrivate).map(e => {
      const venue = venues.filter(v => v.venueUuid === e.venueUuid)[0];
      const dtstart = moment.unix(e.eventDtstart).tz(userGroup.userGroupTimezone);
      const day = dtstart.format('dddd, MMMM Do, YYYY');
      const time = dtstart.format('h:mma');
      const timezone = dtstart.format('z');
      const dtend = moment.unix(e.eventDtstart + e.eventDuration).tz(userGroup.userGroupTimezone);
      const endTime = dtend.format('h:mma');
      return (
        <Segment basic key={ e.eventUuid }>
          <Header as="h3">
            { e.eventTitle }
            <Header.Subheader>{ e.eventMessage }</Header.Subheader>
          </Header>
          <List>
            { !!venue && (
              <List.Item>
                <Header sub>Location</Header>
                <a href={ venue.venueMapUri }>{ venue.venueName }</a>
                { !!venue.venueUrl && (
                  <span> (please see our notes <Link to={ `/home${venue.venueUrl}` }>on getting there</Link>)</span>
                ) }
              </List.Item>
            ) }
            <List.Item>
              <Header sub>Date</Header>
              { day }
            </List.Item>
            <List.Item>
              <Header sub>Time</Header>
              { time } - { endTime } ({ timezone })
            </List.Item>
            <List.Item>
              <Header sub>Attire</Header>
              { e.eventAttire }
              { e.eventParentUuid === null && (
                <span>{ ' ' }See the matching <a href="http://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie/">attire descriptions</a> (towards the bottom of the page) if you are still unsure what to wear.</span>
              ) }
            </List.Item>
            <List.Item>
              <Header sub>What to expect</Header>
              { e.eventDescription }
            </List.Item>
          </List>
        </Segment>
      );
    });
    return (
      <Segment
        basic
        className={ `${this.props.className} page__events` }>
        { events[0] ? events : (
          <div>
            There are currently no events scheduled.
          </div>
        ) }
      </Segment>
    );
  }
}

Events.propTypes = {
  userGroup: PropTypes.shape({
    userGroupTimezone: PropTypes.string.isRequired,
  }).isRequired,
  events: PropTypes.array,
  venues: PropTypes.array,
  className: PropTypes.string,
};

Events.defaultProps = {
  events: [],
  className: '',
};

export default Events;
