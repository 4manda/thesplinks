import apiActions from 'src/actions/api';
import { resetState } from 'src/actions/globalState';

export function trySelectInvitations() {
  return function (dispatch, getState) {
    const {
      selectMemberEventInvitee,
      selectEventInvite,
      selectEventInvitee,
    } = apiActions[getState().userSession.username ? 'memberActions' : 'publicActions'];

    return dispatch(selectMemberEventInvitee()).then(action => {
      if (action.type === 'SELECT_MEMBER_EVENT_INVITEE_SUCCESS') {
        action.response.forEach(mei => {
          dispatch(selectEventInvite({
            queryParams: `event_invite_uuid=eq.${mei.eventInviteUuid}`,
          }));
          dispatch(selectEventInvitee({
            queryParams: `event_invite_uuid=eq.${mei.eventInviteUuid}`,
          }));
        });
      } else if (action.error === 'unauthorized') {
        dispatch(resetState());
      }
      return action;
    });
  };
}

export function validateEmail(code, memberUuid, meiu) {
  return ({
    types: 'VALIDATE_EMAIL',
    callAPI: {
      api: 'citizenApi',
      url: 'rpc/validate_email',
      method: 'POST',
      body: {
        member_uuid: memberUuid,
        token: code,
        member_event_invitee_uuid: meiu,
      },
    },
  });
}
