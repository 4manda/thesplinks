export default {
  userGroup: {
    initialState: [],
    uri: '/user_group',
    root: 'public',
    pkey: 'userGroupUuid',
    writeActions: {
      select: {},
    },
  },
  member: {
    initialState: [],
    uri: '/member',
    root: 'public',
    pkey: 'memberUuid',
    writeActions: {
      insert: {},
      select: {},
      update: {},
    },
  },
  userMobile: {
    initialState: [],
    uri: '/user_mobile',
    root: 'public',
    pkey: 'userMobileUuid',
    writeActions: {
      insert: {},
      select: {},
      update: {},
    },
  },
  userEmail: {
    initialState: [],
    uri: '/user_email',
    root: 'public',
    pkey: 'userEmailUuid',
    writeActions: {
      insert: {},
      select: {},
      update: {},
    },
  },
  venue: {
    initialState: [],
    uri: '/venue',
    root: 'public',
    pkey: 'venueUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  event: {
    initialState: [],
    uri: '/event',
    root: 'public',
    pkey: 'eventUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  eventInvite: {
    initialState: [],
    uri: '/event_invite',
    root: 'public',
    pkey: 'eventInviteUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  eventInvitee: {
    initialState: [],
    uri: '/event_invitee',
    root: 'public',
    pkey: 'eventInviteeUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  memberEventInvitee: {
    initialState: [],
    uri: '/member_event_invitee',
    root: 'public',
    pkey: 'memberEventInviteeUuid',
    canDelete: true,
    writeActions: {
      update: {},
      select: {},
    },
  },
};
