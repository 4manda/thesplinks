import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import { Segment, Header, List, Table, Button, Grid, Checkbox, Input, Form } from 'semantic-ui-react';
import { PropertyTable } from 'src/components/lib';
import { snakeCaseObject } from 'kit/lib/utils';

export class EventInviteeSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      eventInvitee: props.eventInvitee,
    };
  }

  _handleChange = (e, { name, value, checked, type }) => {
    const copy = _.cloneDeep(this.state.eventInvitee);
    if (type === 'checkbox') {
      _.set(copy, name, checked); 
    } else {
      _.set(copy, name, value); 
    }
    this.setState({ eventInvitee: copy });
  }

  _handleClickEdit = () => {
    this.setState({ isEditing: true });
  }

  _handleClickCancel = () => {
    this.setState({
      isEditing: false,
      eventInvitee: this.props.eventInvitee,
    });
  }

  _handleClickSave = () => {
    const bodyArgs = snakeCaseObject(this.state.eventInvitee);
    this.props.updateEventInvitee({
      queryParams: ``,
      bodyArgs,
    });
    this.setState({ isEditing: false });
  }

  render() {
    const { event, eventInvite, eventInvitee } = this.props;
    const { prefix, firstName, middleName, lastName, suffix } = eventInvitee;

//    const inviteeLocation = loc ? (
//      `${loc.address1}, ${loc.address2}, ${loc.city}, ${loc.stateProvince} ${loc.zipPostal}`
//    ) : undefined;

    return (
      <Segment basic className="event-invitee-summary">
        <Header>{ prefix } { firstName } { middleName } { lastName } { suffix }</Header>
        <Segment vertical>
          <Header as="h4" textAlign="center">
            Event Invitee Summary
            { this.state.isEditing ? (
              <Button.Group floated="right">
                <Button primary onClick={ this._handleClickSave } content="Save" />
                <Button onClick={ this._handleClickCancel } content="X" title="Cancel"/>
              </Button.Group>
            ) : (
              <Button floated="right" onClick={ this._handleClickEdit } content="Edit" />
            ) }
          </Header>
          <PropertyTable
            isEditing={ this.state.isEditing }
            handleChange={ this._handleChange }
            propObj={ this.state.eventInvitee }
            tableData={ [
              ['Prefix', 'prefix'],
              ['First Name', 'firstName'],
              ['Alt. First Name', 'firstName1'],
              ['Middle Name', 'middleName'],
              ['Alt. Middle Name', 'middleName1'],
              ['Last Name', 'lastName'],
              ['Alt. Last Name', 'lastName1'],
              ['Suffix', 'suffix'],
              ['Email', 'eventInviteeEmail'],
              ['Mobile', 'eventInviteeMobile'],
              ['Address', 'eventInviteeLocation.address1'],
              ['Line 2', 'eventInviteeLocation.address2'],
              ['City', 'eventInviteeLocation.city'],
              ['State/Province', 'eventInviteeLocation.stateProvince'],
              ['Zip/Postal', 'eventInviteeLocation.zipPostal'],
              ['Country', 'eventInviteeLocation.country'],
              ['Is Primary', 'eventInviteeIsPrimary', 'checkbox'],
              ['Guests Allowed', 'eventInviteeGuestsAllowed', 'number'],
            ] }
          />
        </Segment>
        <Segment vertical>
          <Header as="h4" textAlign="center">User Defined</Header>
          <PropertyTable
            propObj={{
              ...eventInvite,
              ...eventInvitee,
            }}
            tableData={ [
              ['Status', 'eventInviteState'],
              ['Is Attending', 'eventInviteeIsConfirmed', 'checkbox'],
              ['Number of Guests', 'eventInviteeGuestsConfirmed', 'number'],
              ['Message', 'eventInviteFreeResponse'],
            ] }
          />
        </Segment>
      </Segment>
    );
  }
}

EventInviteeSummary.propTypes = {
  event: PropTypes.object.isRequired,
  eventInvite: PropTypes.object.isRequired,
  eventInvitee: PropTypes.object.isRequired,
};

export default EventInviteeSummary;
