export const sampleTest = {
  citizen: {
    members: [{ memberUuid: 'DELETE-ME' }],
  },
  member: {
    events: [{
      eventUuid: 'a',
      userGroupUuid: 'thesplinks.com',
      eventTitle: 'Ceremony and Reception',
      eventDtstart: '',
      venueUuid: '',
      eventDuration: '',
      eventDescription: 'So excited!',
    }, {
      eventUuid: 'b',
      userGroupUuid: 'thesplinks.com',
      eventTitle: 'Friday Dinner',
      eventDtstart: '',
      venueUuid: '',
      eventDuration: '',
      eventDescription: 'BBQ and Games',
    }],
    eventInvites: [{
      eventInviteUuid: 'a',
      eventInviteState: 'responded',
      eventInviteFreeResponse: '',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'a',
    }, {
      eventInviteUuid: 'b',
      eventInviteState: 'no_reply',
      eventInviteFreeResponse: '',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'b',
    }],
    eventInvitees: [{
      eventInviteeUuid: 'a',
      eventInviteUuid: 'a',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'a',
      isAttending: false,
      firstName: 'John',
      lastName: 'Splink',
      email: 'jlsphar@thesplinks.com',
      guestsAllowed: 0,
      guestsAttending: 0,
    }, {
      eventInviteeUuid: 'aa',
      eventInviteUuid: 'a',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'a',
      isAttending: false,
      firstName: 'Amanda',
      lastName: 'Splink',
      email: 'amanda@thesplinks.com',
      guestsAllowed: 0,
      guestsAttending: 0,
    }, {
      eventInviteeUuid: 'b',
      eventInviteUuid: 'b',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'b',
      isAttending: false,
      firstName: 'John',
      lastName: 'Splink',
      email: 'jlsphar@thesplinks.com',
      guestsAllowed: 0,
      guestsAttending: 0,
    }, {
      eventInviteeUuid: 'bb',
      eventInviteUuid: 'b',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'b',
      isAttending: false,
      firstName: 'Amanda',
      lastName: 'Splink',
      email: 'amanda@thesplinks.com',
      guestsAllowed: 0,
      guestsAttending: 0,
    }, {
      eventInviteeUuid: 'c',
      eventInviteUuid: 'c',
      userGroupUuid: 'thesplinks.com',
      eventUuid: 'a',
      isAttending: false,
      firstName: 'Katherine',
      lastName: 'Flink',
      email: 'k@example.com',
      guestsAllowed: 1,
      guestsAttending: 0,
    }],
    userGroups: [{
      userGroupUuid: 'thesplinks.com',
      userGroupTitle: 'The Marriage of Amanda and John',
    }],
  },
};
