import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Segment, Header } from 'semantic-ui-react';

class Contact extends React.Component {
  render() {
    if (this.props.userGroup.userGroupEmail) {
      return (
        <Segment
          basic
          className={ `${this.props.className} page__events` }>
          <Header as="h3">Email</Header>
          <a href={ `mailto:${this.props.userGroup.userGroupEmail}` }>{ this.props.userGroup.userGroupEmail }</a>
        </Segment>
      );
    } else {
      return (
        <Segment
          basic
          className={ `${this.props.className} page__events` }>
          <div>To contact us on the day of the wedding, please reach out to our family members first.</div>
          <div>Any other time, feel free to contact us directly!</div>
        </Segment>
      );
    }
  }
}

Contact.propTypes = {
  userGroup: PropTypes.shape({
    userGroupEmail: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

Contact.defaultProps = {
  className: '',
};

export default Contact;
