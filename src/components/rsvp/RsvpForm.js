import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Header, Segment, Form, Divider, Button, List, TextArea, Message } from 'semantic-ui-react';
import RsvpSubmitted from 'src/components/rsvp/RsvpSubmitted';
import { MAX_MESSAGE_LENGTH } from 'src/constants';

export class RsvpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitees: _.keyBy(props.invitees, 'eventInviteeUuid'),
      message: props.invite.eventInviteFreeResponse || '',
      inviteState: props.invite.eventInviteState,
      error: '',
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleChangeInvitee = this._handleChangeInvitee.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(this.props.invite.eventInviteUuid, prevProps.invite.eventInviteUuid) ||
      !_.isEqual(this.props.invite.eventInviteState, prevProps.invite.eventInviteState) ||
      !_.isEqual(this.props.invitees, prevProps.invitees)
    ) {
      this.setState({
        invitees: _.keyBy(this.props.invitees, 'eventInviteeUuid'),
        message: this.props.invite.eventInviteFreeResponse || '',
        inviteState: this.props.invite.eventInviteState,
        error: '',
      });
    }
  }

  _handleChange(e, { name, value }) {
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return this.setState({
        error: `Sorry, messages cannot be longer than ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }
    return this.setState({
      [name]: value,
      error: '',
    });
  }

  _handleChangeInvitee(e, { name, value, index, checked }) {
    const inviteeClone = _.cloneDeep(this.state.invitees);
    switch (name) {
      case 'eventInviteeIsConfirmed': {
        inviteeClone[value][name] = checked;
        break;
      }
      case 'eventInviteeGuestsConfirmed': {
        if (typeof value === 'number') {
          if (value > inviteeClone[index].eventInviteeGuestsAllowed || value < 0) {
            return;
          }
          inviteeClone[index][name] = value;
        } else {
          inviteeClone[value][name] = checked ? 1 : 0;
        }
        break;
      }
      default:
        break;
    }
    this.setState({ invitees: inviteeClone });
  }

  _handleSubmit() {
    const guestCountValid = _.every(this.state.invitees, i => {
      if (Number(i.eventInviteeGuestsAllowed) < Number(i.eventInviteeGuestsConfirmed)) {
        this.setState({
          error: `${i.firstName} ${i.lastName} is only allotted ${i.eventInviteeGuestsAllowed} guests.`,
        });
        return false;
      } else if (!i.eventInviteeIsConfirmed && i.eventInviteeGuestsConfirmed) {
        this.setState({
          error: `You may bring a guest, put please don't send someone without you!`,
        });
        return false;
      }
      return true;
    });
    if (!guestCountValid) return;

    _.forEach(this.state.invitees, i => {
      this.props.updateEventInvitee({
        queryParams: `event_invitee_uuid=eq.${i.eventInviteeUuid}`,
        bodyArgs: {
          event_invitee_is_confirmed: i.eventInviteeIsConfirmed,
          event_invitee_guests_confirmed: i.eventInviteeGuestsConfirmed,
        },
      });
    });
    this.props.updateEventInvite({
      queryParams: `event_invite_uuid=eq.${this.props.invite.eventInviteUuid}`,
      bodyArgs: {
        event_invite_state: 'responded',
        event_invite_free_response: this.state.message || null,
      },
    }).then(action => {
      if (action.type === 'UPDATE_EVENT_INVITE_SUCCESS') {
        this.setState({ inviteState: 'responded' });
      }
    });
  }

  _handleEditClick() {
    this.setState({ inviteState: 'editing' });
  }

  render() {
    const { event, invite, invitees, userGroup } = this.props;
    const date = moment.unix(event.eventDtstart).tz(userGroup.userGroupTimezone);
    const day = date.format('dddd, MMMM Do, YYYY');
    const time = date.format('h:mma (z)');
    const eventHeader = (
      <Header as="h5">
        <div><Link to="/home/events">{ event.eventTitle }</Link></div>
        <Header.Subheader>
          <div>{ day }</div>
          <div>at { time }</div>
        </Header.Subheader>
      </Header>
    );
    if (this.state.inviteState === 'responded') {
      return (
        <RsvpSubmitted
          eventHeader={ eventHeader }
          invite={ invite }
          invitees={ invitees }
          handleEditClick={ this._handleEditClick }
        />
      );
    }
    return (
      <Form onSubmit={ this._handleSubmit }>
        <div>Together with their families,</div>
        <div>Amanda and John invite you to the</div>
        { eventHeader }
        <Divider />
        <div>Please select all who will be attending:</div>
        <List>
          { _.map(this.state.invitees, (i, key) => (
            <List.Item key={ key }>
              <Form.Checkbox
                checked={ i.eventInviteeIsConfirmed }
                value={ key }
                name="eventInviteeIsConfirmed"
                onChange={ this._handleChangeInvitee }
                label={ `${i.firstName} ${i.lastName}` }
              />
              { i.eventInviteeGuestsAllowed === 1 && (
                <Form.Checkbox
                  value={ key }
                  checked={ i.eventInviteeGuestsConfirmed === 1 }
                  name="eventInviteeGuestsConfirmed"
                  onChange={ this._handleChangeInvitee }
                  label={ `Guest of ${i.firstName}` }
                />
              ) }
              { i.eventInviteeGuestsAllowed > 1 && (
                <Form.Input
                  index={ key }
                  value={ Number(i.eventInviteeGuestsConfirmed) }
                  name="eventInviteeGuestsConfirmed"
                  onChange={ this._handleChangeInvitee }
                  label={ `How many guests are you bringing? (Out of ${i.eventInviteeGuestsAllowed})` }
                  min={ 0 }
                  max={ Number(i.eventInviteeGuestsAllowed) }
                  type="number"
                />
              ) }
            </List.Item>
          )) }
        </List>
        <TextArea
          value={ this.state.message }
          onChange={ this._handleChange }
          name="message"
          autoHeight
          rows={ 5 }
          placeholder="Leave us a message! Feel free to include any dietary restrictions, dance song preferences, questions, or just say hello."
          className="width--600px"
        />
        <div className="deemphasize-text">(if plans change you can update your response later)</div>
        <Segment basic className="component__centered">
          { _.some(this.state.invitees, ['eventInviteeIsConfirmed', true]) ? (
            <Button
              primary
              content="Submit RSVP"
              onClick={ this._handleSubmit }
            />
          ) : (
            <Button
              color="brown"
              content="Submit Regrets"
              onClick={ this._handleSubmit }
            />
          ) }
        </Segment>
        <Message
          compact
          error
          content={ this.state.error }
          visible={ !!this.state.error }
        />
      </Form>
    );
  }
}

RsvpForm.propTypes = {
  userGroup: PropTypes.shape({
    userGroupTimezone: PropTypes.string.isRequired,
  }).isRequired,
  invite: PropTypes.object.isRequired,
  invitees: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
  event: PropTypes.object.isRequired,
  updateEventInvite: PropTypes.func.isRequired,
  updateEventInvitee: PropTypes.func.isRequired,
};

export default RsvpForm;
