import apiActions from 'src/actions/api';
import constants from 'src/actionTypes';
import { trySelectInvitations } from 'src/actions/rsvp';
import { resetState } from 'src/actions/globalState';

const {
  ENTER_USER_GROUP,
  SELECT_MEMBER_SUCCESS,
  UNSELECT_USER_GROUP,
} = constants;

export function setCurrentMember(memberUuid, userGroupUuid) {
  return { type: 'SET_CURRENT_MEMBER', memberUuid, userGroupUuid};
}

export function unsetCurrentMember() {
  return { type: 'UNSET_CURRENT_MEMBER' };
}

export function unselectUserGroup() {
  return function (dispatch) {
    dispatch({ type: UNSELECT_USER_GROUP });
  };
}

export function enterUserGroup(userGroupUuid) {
  return function (dispatch, getState) {
    if (getState().ephemeral.currentUserGroup !== userGroupUuid) {
      dispatch(unselectUserGroup());
      dispatch({ type: ENTER_USER_GROUP, userGroupUuid });
    }
  };
}

export function getUserGroupAndEvents() {
  return function (dispatch, getState) {
    const {
      selectUserGroup,
      selectMember,
    } = apiActions[getState().userSession.username ? 'citizenActions' : 'publicActions'];
    const {
      selectEvent,
      selectVenue,
    } = apiActions[getState().userSession.username ? 'memberActions' : 'publicActions'];
    return dispatch(selectMember()).then(action => {
      if (action.type === 'SELECT_MEMBER_SUCCESS') {
        dispatch(selectUserGroup());
        dispatch(selectEvent());
        dispatch(selectVenue());
        dispatch(trySelectInvitations());
      } else if (action.error === 'unauthorized') {
        dispatch(resetState());
      }
      return action;
    });
  };
}

export function enumerateUserGroups() {
  return function (dispatch, getState) {
    const {
      selectMember,
      selectMemberRole,
      selectUserGroup,
      selectUserAccount,
    } = apiActions.citizenActions;
    const {
      selectEvent,
      selectVenue,
    } = apiActions.memberActions;

    return dispatch(selectUserAccount({
      queryParams: `username=eq.${getState().userSession.username}`,
    })).then(action => {
      if (action.type === 'SELECT_USER_ACCOUNT_SUCCESS') {
        // If they have a valid user_session then enumerate
        dispatch(selectMember({
          queryParams: `username=eq.${getState().userSession.username}`,
        })).then(act=> {
          if (act.type === SELECT_MEMBER_SUCCESS) {
            act.response.forEach(member => {
              const headers = {
                'X-Group': member.userGroupUuid,
                'X-Member': member.memberUuid,
              };
              if (member.userGroupUuid === getState().ephemeral.currentUserGroup) {
                dispatch(setCurrentMember(member.memberUuid, member.userGroupUuid));
              }
              dispatch(selectMemberRole({ headers }));
              dispatch(selectUserGroup({ headers }));
              dispatch(selectEvent({ headers }));
            });
          }
        });
      } else if (action.error === 'unauthorized') {
        dispatch(resetState());
      }
      return action;
    });
  };
}
