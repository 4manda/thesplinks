import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import {
  Segment,
  Header,
  Breadcrumb,
  List,
  Table,
  Grid,
  Button,
} from 'semantic-ui-react';
import { ObjectSummary } from 'src/components/lib';
import {
  ListOfEvents,
  ManageInvitations,
  EventInviteSummary,
  SomeStats,
} from 'src/components/admin';
import { getCurrentUserAccount } from 'src/selectors';
import {
  setCurrentMember,
  unsetCurrentMember,
  apiActions,
} from 'src/actions';

const {
  selectMember,
} = apiActions.citizenActions;

export class UserContainer extends React.Component {
  componentDidMount() {
    const userGroupUuid = 'thesplinks.com';
    this.props.selectEventInvite();
    this.props.selectEventInvitee();
    this.props.selectMemberEventInvitee();
    this.props.selectMember({ queryParams: `user_group_uuid=eq.${userGroupUuid}` });
  }

  render() {
    const {
      currentUser,
      userGroups,
      allMembers,
      memberRoles,
      events,
      venues,
      allEventInvites,
      allEventInvitees,
      allMemberEventInvitees,
    } = this.props;
    const {
      userGroupUuid,
      eventTitle,
      eventInviteTitle,
      firstName,
      lastName,
    } = this.props.match.params || {};

    let page;
    const sections = [];
    const userGroup = userGroups.filter(ug => ug.userGroupUuid === userGroupUuid)[0];
    if (userGroup) {
      sections.push({
        key: 'user',
        content: 'User Home',
        as: Link,
        to: '/user',
        onClick: this.props.unsetCurrentMember,
        link: true,
      }, {
        key: 'userGroup',
        content: userGroup.userGroupUuid,
        active: true,
      });
      const event = events.filter(evt => evt.eventTitle === eventTitle)[0];
      if (event) {
        sections.pop();
        sections.push({
          key: 'userGroup',
          content: userGroup.userGroupUuid,
          as: Link,
          to: `/user/${userGroup.userGroupUuid}/`,
          link: true,
        }, {
          key: 'event',
          content: event.eventTitle,
          active: true,
        });
        const eventVenue = venues.filter(v => v.venueUuid === event.venueUuid)[0];
        const eventInvites = allEventInvites.filter(ei => ei.eventUuid === event.eventUuid);
        const eventInvitees = allEventInvitees.filter(eie => eie.eventUuid === event.eventUuid);
        const memberEventInvitees = allMemberEventInvitees.filter(mei => mei.eventUuid === event.eventUuid);
        const eventInvite = eventInvites.filter(ei => ei.eventInviteTitle === eventInviteTitle)[0];
        if (eventInvite) {
          sections.pop();
          sections.push({
            key: 'event',
            content: event.eventTitle,
            as: Link,
            to: `/user/${userGroup.userGroupUuid}/${event.eventTitle}`,
            link: true,
          }, {
            key: 'eventInvite',
            content: eventInvite.eventInviteTitle,
            active: true,
          });
          const invitees = eventInvitees.filter(eie => eie.eventInviteUuid === eventInvite.eventInviteUuid);
          const eventInvitee = invitees.filter(i => i.firstName === firstName && i.lastName === lastName)[0];
          if (eventInvitee) {
            sections.pop();
            sections.push({
              key: 'eventInvite',
              content: eventInvite.eventInviteTitle,
              as: Link,
              to: `/user/${userGroup.userGroupUuid}/${event.eventTitle}/${eventInvite.eventInviteTitle}`,
              link: true,
            }, {
              key: 'eventInvitee',
              content: `${eventInvitee.firstName} ${eventInvitee.lastName}`,
              active: true,
            });
            page = (
              <ObjectSummary
                primaryObj={ eventInvitee }
                primaryObjName="eventInvitee"
                pkey="eventInviteeUuid"
                updateObj={ this.props.updateEventInvitee }
                headerText={ eie => `${eie.prefix} ${eie.firstName} ${eie.middleName} ${eie.lastName} ${eie.suffix}` }
                editableData={ [
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
                  ['Address Line 2', 'eventInviteeLocation.address2'],
                  ['City', 'eventInviteeLocation.city'],
                  ['State/Province', 'eventInviteeLocation.stateProvince'],
                  ['Zip/Postal', 'eventInviteeLocation.zipPostal'],
                  ['Country', 'eventInviteeLocation.country'],
                  ['Is Primary', 'eventInviteeIsPrimary', 'checkbox'],
                  ['Guests Allowed', 'eventInviteeGuestsAllowed', 'number'],
                ] }
                otherObjs={{ eventInvite }}
                otherData={ [
                  ['Username', 'eventInvitee.username'],
                  ['Status', 'eventInvite.eventInviteState'],
                  ['Is Attending', 'eventInvitee.eventInviteeIsConfirmed', 'checkbox'],
                  ['Number of Guests', 'eventInvitee.eventInviteeGuestsConfirmed', 'number'],
                  ['Message', 'eventInvite.eventInviteFreeResponse'],
                ] }
              />
            );
          } else if (firstName || lastName) {
            page = <Segment basic>No match on url param { firstName } { lastName }</Segment>;
          } else {
            page = (
              <EventInviteSummary
                userGroup={ userGroup }
                event={ event }
                eventInvite={ eventInvite }
                eventInvitees={ invitees }
              />
            );
          }
        } else if (eventInviteTitle === 'eventInvites') {
          page = (
            <ManageInvitations
              event={ event }
              userGroup={ userGroup }
              eventInvites={ eventInvites }
              eventInvitees={ eventInvitees }
              memberEventInvitees={ memberEventInvitees }
            />
          );
        } else if (eventInviteTitle) {
          page = <Segment basic>No match on url param { eventInviteTitle }</Segment>;
        } else {
          page = (
            <ObjectSummary
              primaryObj={ event }
              primaryObjName="event"
              pkey="eventUuid"
              updateObj={ this.props.updateEvent }
              headerText={ e => e.eventTitle }
              editableData={ [
                ['Title:', 'eventTitle'],
                ['Parent:', 'eventParentUuid'],
                ['Date:', 'eventDtstart'],
                ['Duration:', 'eventDuration'],
                ['Venue:', 'venueUuid'],
                ['Message:', 'eventMessage'],
                ['Description:', 'eventDescription'],
                ['Attire:', 'eventAttire'],
              ] }
            />
          );
        }
      } else if (eventTitle === 'events') {
        page = (
          <ListOfEvents
            userGroup={ userGroup }
            events={ events }
          />
        );
      } else if (eventTitle === 'stats') {
        page = (
          <SomeStats
            userGroup={ userGroup }
            events={ events }
            members={ allMembers }
            eventInvites={ allEventInvites }
            eventInvitees={ allEventInvitees }
            memberEventInvitees={ allMemberEventInvitees }
          />
        );
      } else if (eventTitle) {
        page = <Segment basic>No match on url param { eventTitle }</Segment>;
      } else {
        page = (
          <ObjectSummary
            primaryObj={ userGroup }
            primaryObjName="userGroup"
            pkey="userGroupUuid"
            updateObj={ this.props.updateUserGroup }
            headerText={ ug => ug.userGroupTitle }
            editableData={ [
              ['Title:', 'userGroupTitle'],
              ['Identifier:', 'userGroupUuid'],
              ['Picture:', 'userGroupPicture'],
              ['Email:', 'userGroupEmail'],
              ['Welcome Message:', 'userGroupWelcome'],
              ['Timezone:', 'userGroupTimezone'],
            ] }
          />
        );
      }
    } else if (userGroupUuid) {
      page = <Segment basic>No match on url param { userGroupUuid }</Segment>;
    } else {
      const usersMembers = allMembers.filter(m => currentUser && m.username === currentUser.username);
      const usersRoles = memberRoles.filter(mr => (
        usersMembers.map(m => m.memberUuid).includes(mr.memberUuid)
      ));
      page = (
        <ObjectSummary
          primaryObj={ currentUser }
          primaryObjName="userAccount"
          pkey="username"
          updateObj={ this.props.updateUserAccount }
          headerText={ ua => `${ua.firstName} ${ua.lastName}` }
          editableData={ [
            ['Username', 'username'],
            ['Prefix', 'prefix'],
            ['First Name', 'firstName'],
            ['Middle Name', 'middleName'],
            ['Last Name', 'lastName'],
            ['Suffix', 'suffix'],
            ['Address', 'location.address1'],
            ['Address Line 2', 'location.address2'],
            ['City', 'location.city'],
            ['State/Province', 'location.stateProvince'],
            ['Zip/Postal', 'location.zipPostal'],
            ['Country', 'location.country'],
            ['Is Staff', 'isStaff', 'checkbox'],
            ['Picture', 'userAccountPicture'],
          ] }
        />
      );
    }
    return (
      <Segment basic textAlign="center" className="admin-pages">
        <Breadcrumb sections={ sections } />
        { page }
      </Segment>
    );
  }
}

UserContainer.propTypes = {
  userGroups: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  memberRoles: PropTypes.array.isRequired,
  allMembers: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  venues: PropTypes.array.isRequired,
  allEventInvites: PropTypes.array.isRequired,
  allEventInvitees: PropTypes.array.isRequired,
  allMemberEventInvitees: PropTypes.array.isRequired,
  selectMember: PropTypes.func.isRequired,
  selectEventInvite: PropTypes.func.isRequired,
  selectEventInvitee: PropTypes.func.isRequired,
  selectMemberEventInvitee: PropTypes.func.isRequired,
  setCurrentMember: PropTypes.func.isRequired,
  unsetCurrentMember: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userGroups: state.citizen.userGroups,
  currentUser: getCurrentUserAccount(state),
  memberRoles: state.citizen.memberRoles,
  allMembers: state.citizen.members,
  events: state.member.events,
  venues: state.member.venues,
  allEventInvites: state.member.eventInvites,
  allEventInvitees: state.member.eventInvitees,
  allMemberEventInvitees: state.member.memberEventInvitees,
});

const mapDispatchToProps = dispatch => {
  const {
    selectMember,
    updateUserGroup,
    updateUserAccount,
  } = apiActions.citizenActions;

  const {
    updateEvent,
    selectEventInvite,
    selectEventInvitee,
    updateEventInvitee,
    selectMemberEventInvitee,
  } = apiActions.memberActions;

  return bindActionCreators({
    selectMember,
    updateUserGroup,
    updateUserAccount,
    updateEvent,
    selectEventInvite,
    selectEventInvitee,
    updateEventInvitee,
    selectMemberEventInvitee,
    setCurrentMember,
    unsetCurrentMember,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserContainer);
