import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Button, List, Grid, Icon, Divider } from 'semantic-ui-react';

export class RsvpSubmitted extends React.Component {
  render() {
    const { invite, invitees, eventHeader } = this.props;
    let comment = '';
    const attending = invitees.filter(i => i.eventInviteeIsConfirmed);
    const notAttending = invitees.filter(i => !i.eventInviteeIsConfirmed);
    if (!attending[0]) {
      comment = 'You will be missed.';
    } else if (!notAttending[0]) {
      comment = 'Excited to see you!';
    }
    return (
      <div>
        <div>Thank you for letting us know.</div>
        <div>{ comment }</div>
        <Divider />
        <div>The following is a summary of your response for the</div>
        { eventHeader }
        <Grid stackable padded verticalAlign="middle" textAlign="center" columns="equal">
          { attending[0] && (
            <Grid.Column>
              <div><strong>Attending:</strong></div>
              <List>
                { _.map(attending, i => (
                  <List.Item key={ i.eventInviteeUuid }>
                    <Icon name="check" color="green" />
                    { ' ' }{ i.firstName } { i.lastName } { i.eventInviteeGuestsConfirmed ? 'and guest' : '' }
                  </List.Item>
                )) }
              </List>
            </Grid.Column>
          ) }
          { notAttending[0] && (
            <Grid.Column>
              <div><strong>Not Attending:</strong></div>
              <List>
                { _.map(notAttending, i => (
                  <List.Item key={ i.eventInviteeUuid }>
                    <Icon name="close" />
                    { ' ' }{ i.firstName } { i.lastName }
                  </List.Item>
                )) }
              </List>
            </Grid.Column>
          ) }
          { !!invite.eventInviteFreeResponse && (
            <Grid.Column>
              <div><strong>Your Message:</strong></div>
              <List>
                <List.Item>
                  "{ invite.eventInviteFreeResponse }"
                </List.Item>
              </List>
            </Grid.Column>
          ) }
        </Grid>
        <Button
          content="Edit"
          onClick={ this.props.handleEditClick }
        />
      </div>
    );
  }
}

RsvpSubmitted.propTypes = {
  eventHeader: PropTypes.node.isRequired,
  invitees: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
  invite: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
};

export default RsvpSubmitted;
