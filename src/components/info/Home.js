import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Segment, Header, Button } from 'semantic-ui-react';

class Home extends React.Component {
  render() {
    const { events, userGroup } = this.props;
    const mainEvent = events.filter(e => e.eventParentUuid === null)[0];
    const title = 'Amanda and John are tying the knot!';
    const day = !!mainEvent ? moment.unix(mainEvent.eventDtstart).tz(userGroup.userGroupTimezone).format('MMMM D, YYYY') : 'Coming Soon';
    const place = 'San Francisco';
    const message = 'We are very excited to celebrate our love with you!';
    return (
      <Segment
        basic
        textAlign="center"
        className={ `${this.props.className} page__home` }>
        <Header>
          { title }
          <Header.Subheader>
            <div>{ day }</div>
            <div>{ place }</div>
          </Header.Subheader>
        </Header>
        <div>{ message }</div>
      </Segment>
    );
  }
}

Home.propTypes = {
  userGroup: PropTypes.shape({
    userGroupTimezone: PropTypes.string.isRequired,
  }).isRequired,
  events: PropTypes.array,
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
};

Home.defaultProps = {
  events: [],
  className: '',
};

export default Home;
