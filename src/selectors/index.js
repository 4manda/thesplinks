export function getCurrentMember(state) {
  return state.citizen.members.filter(m => (
    m.memberUuid === state.ephemeral.currentMember
  ))[0];
}

export function getCurrentUserGroup(state) {
  return state.citizen.userGroups.filter(ug => (
    ug.userGroupUuid === state.ephemeral.currentUserGroup
  ))[0];
}

export function getCurrentEvents(state) {
  return state.member.events.filter(e => (
    e.userGroupUuid === state.ephemeral.currentUserGroup
  ));
}

export function getCurrentUserAccount(state) {
  return state.citizen.userAccounts.filter(ua => (
    ua.username === state.userSession.username
  ))[0];
}

export function getCurrentUserGroupState(state) {
  return {
    userGroup: getCurrentUserGroup(state),
    member: getCurrentMember(state),
    events: getCurrentEvents(state),
    venues: state.member.venues,
  };
}
