export default {
  userGroup: {
    initialState: [],
    uri: '/user_group',
    root: 'citizen',
    pkey: 'userGroupUuid',
    writeActions: {
      select: {},
      update: {},
    },
  },
  member: {
    initialState: [],
    uri: '/member',
    root: 'citizen',
    pkey: 'memberUuid',
    writeActions: {
      insert: {},
      select: {},
      update: {},
    },
  },
  memberRole: {
    initialState: [],
    uri: '/member_role',
    root: 'citizen',
    pkey: 'memberRoleUuid',
    canDelete: true,
    writeActions: {
      insert: {},
      select: {},
    },
  },
  userAccount: {
    initialState: [],
    uri: '/user_account',
    root: 'citizen',
    pkey: 'userAccountUuid',
    writeActions: {
      update: {},
      select: {},
    },
  },
  userEmail: {
    initialState: [],
    uri: '/user_email',
    root: 'citizen',
    pkey: 'userEmailUuid',
    canDelete: true,
    writeActions: {
      insert: {},
      update: {},
      select: {},
    },
  },
};
