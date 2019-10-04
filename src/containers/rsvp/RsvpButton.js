import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export class RsvpButton extends React.Component {
  render() {
    const { currentUser, eventInvites } = this.props;
    const pendingInvites = eventInvites.filter(ei => ei.eventInviteState === 'no_reply');
    let content = 'Your Invitation';
    let color;
    if (currentUser) {
      content = 'Manage Invitations';
    } else if (!eventInvites[0]) {
      content = 'Your Invitation';
    } else if (pendingInvites[0]) {
      content = `(${pendingInvites.length}) Pending Invitation${pendingInvites.length > 1 ? 's' : ''}`;
      color = "red";
    } else if (eventInvites[0]) {
      content = `Your Invitation${eventInvites.length > 1 ? 's' : ''}`;
    }
    return (
      <Button
        primary={ !color }
        color={ color || null }
        as={ Link }
        to="/rsvp"
        content={ content }
        className={ `rsvp-button ${this.props.className}` }
        size={ this.props.size }
        onClick={ this.props.onClick }
      />
    );
  }
}

RsvpButton.propTypes = {
  currentUser: PropTypes.string,
  eventInvites: PropTypes.array.isRequired,
  className: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

RsvpButton.defaultProps = {
  currentUser: undefined,
  size: 'medium',
  onClick: () => {},
};

const mapStateToProps = state => ({
  currentUser: state.userSession.username,
  eventInvites: state.member.eventInvites,
});

export default connect(
  mapStateToProps,
)(RsvpButton);
