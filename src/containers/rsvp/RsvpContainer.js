import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Container, Segment, Header, Grid } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import GetRsvpForm from 'src/components/rsvp/GetRsvpForm';
import RsvpMenu from 'src/components/rsvp/RsvpMenu';
import FixedBack from 'src/components/lib/FixedBack';
import { getCurrentMember, getCurrentUserGroup } from 'src/selectors';
import { trySelectInvitations, validateEmail } from 'src/actions/rsvp';
import apiActions from 'src/actions/api';

export class RsvpContainer extends React.Component {
  componentDidMount() {
    if (!this.props.currentUser) {
      this.props.trySelectInvitations();
    }
  }

  render() {
    const { modal } = this.props.location.state || {};
    const { isAppOnline, currentUser, currentUserGroup, currentMember, eventInvites, eventInvitees, events } = this.props;
    let header;
    let body;
    if (currentUser) {
      return <Redirect to={ `/user/${currentUserGroup.userGroupUuid}/` } />;
    } else if (eventInvites[0] && eventInvitees[0]) {
      header = `Your Invitation${eventInvites.length > 1 ? 's' : ''}`;
      body = (
        <RsvpMenu
          userGroup={ currentUserGroup }
          invites={ eventInvites }
          invitees={ eventInvitees }
          events={ events }
          memberEventInvitees={ this.props.memberEventInvitees }
          updateEventInvite={ this.props.updateEventInvite }
          updateEventInvitee={ this.props.updateEventInvitee }
          insertMember={ this.props.insertMember }
        />
      );
    } else if (!isAppOnline) {
      header = 'Offline';
      body = 'Please connect to the internet to view find your invitation';
    } else {
      header = 'Find Your Invitation';
      body = (
        <GetRsvpForm
          member={ currentMember }
          memberEventInvitees={ this.props.memberEventInvitees }
          updateMember={ this.props.updateMember }
          trySelectInvitations={ this.props.trySelectInvitations }
          validateEmail={ this.props.validateEmail }
          history={ this.props.history }
          match={ this.props.match }
          location={ this.props.location }
        />
      );
    }
    if (modal) {
      return (
        <Modal
          open
          onClose={ e => {
            e.stopPropagation();
            this.props.history.goBack();
          } }
          closeIcon="close">
          <Modal.Header>
            <Container textAlign="center">
              { header }
            </Container>
          </Modal.Header>
          <Modal.Content>
            <Container textAlign="center">
              { body }
            </Container>
          </Modal.Content>
        </Modal>
      );
    }
    return (
      <FixedBack
        segment
        header={ header }
        innerWidth="600px"
        className="page__rsvp">
        { body }
      </FixedBack>
    );
  }
}

RsvpContainer.propTypes = {
  currentMember: PropTypes.shape({
    memberMobile: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    memberEmail: PropTypes.string,
    memberLocation: PropTypes.object,
  }).isRequired,
  currentUserGroup: PropTypes.shape({
    userGroupUuid: PropTypes.string.isRequired,
    userGroupTimezone: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.string,
  memberEventInvitees: PropTypes.array.isRequired,
  eventInvitees: PropTypes.array.isRequired,
  eventInvites: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  trySelectInvitations: PropTypes.func.isRequired,
  validateEmail: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  updateEventInvite: PropTypes.func.isRequired,
  updateEventInvitee: PropTypes.func.isRequired,
  insertMember: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
};

RsvpContainer.defaultProps = {
  currentUser: undefined,
};

const mapStateToProps = state => ({
  currentMember: getCurrentMember(state),
  currentUserGroup: getCurrentUserGroup(state),
  memberEventInvitees: state.member.memberEventInvitees,
  eventInvitees: state.member.eventInvitees,
  eventInvites: state.member.eventInvites,
  events: state.member.events,
  isAppOnline: state.globalState.isOnline,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    updateMember,
    insertMember,
  } = apiActions[ownProps.currentUser ? 'citizenActions': 'publicActions'];
  const {
    updateEventInvite,
    updateEventInvitee,
  } = apiActions[ownProps.currentUser ? 'memberActions': 'publicActions'];

  return bindActionCreators({
    trySelectInvitations,
    validateEmail,
    updateMember,
    insertMember,
    updateEventInvite,
    updateEventInvitee,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RsvpContainer);
