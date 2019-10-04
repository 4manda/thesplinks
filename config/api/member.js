export default {
  venue: {
    initialState: [],
    uri: '/venue',
    root: 'member',
    pkey: 'venueUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  event: {
    initialState: [],
    uri: '/event',
    root: 'member',
    pkey: 'eventUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  eventInvite: {
    initialState: [],
    uri: '/event_invite',
    root: 'member',
    pkey: 'eventInviteUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  eventInvitee: {
    initialState: [],
    uri: '/event_invitee',
    root: 'member',
    pkey: 'eventInviteeUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  memberEventInvitee: {
    initialState: [],
    uri: '/member_event_invitee',
    root: 'member',
    pkey: 'memberEventInviteeUuid',
    canDelete: true,
    writeActions: {
      update: {},
      select: {},
    },
  },
};
