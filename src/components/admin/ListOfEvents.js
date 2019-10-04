import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import { Segment, Header, Table, Button, List } from 'semantic-ui-react';

export class ListOfEvents extends React.Component {
  render() {
    const {
      userGroup: {
        userGroupUuid,
      },
      events,
    } = this.props;
    return (
      <Segment basic className="events-summary">
        <Header textAlign="center">Events</Header>
        <List>
          { events.map(evt => (
            <List.Item key={ evt.eventUuid}>
              <Link to={ `/user/${userGroupUuid}/${evt.eventTitle}` }>{ evt.eventTitle }</Link>
            </List.Item>
          )) }
        </List>
        <Button
          disabled
          title="Feature Not Supported"
          primary
          onClick={ () => {} }
          content="Create New Event"
        />
      </Segment>
    );
  }
}

ListOfEvents.propTypes = {
  userGroup: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
};

export default ListOfEvents;
