import userSession from 'src/reducers/userSession';
import actionTypes from 'src/actionTypes';

const {
  SIGN_IN_SUCCESS,
  VERIFY_SUCCESS,
  RENEW_SESSION_SUCCESS,
} = actionTypes;

describe('userSession Reducer', function () {
  const { reducer } = userSession.userSession;
  const jsCredentials = {
    accessToken: '',
    bearerToken: '',
    refreshToken: '',
    username: 'testUser',
    sessionUuid: '',
    userSessionExpiresAt: '',
  };
  const sqlCredentials = {
    access_token: '',
    bearer_token: '',
    refresh_token: '',
    username: 'testUser',
    session_uuid: '',
    user_session_expires_at: '',
  };

  it('should return the initialState', function () {
    expect(reducer(undefined, {})).to.eql({});
  });

  describe('should handle', function () {
    it('SUBMIT_SECRET', function () {
      expect(reducer(undefined, {
        type: 'SUBMIT_SECRET',
        secret: 'superSecret',
      })).to.eql({ secret: 'superSecret' });
    });

    it('SIGN_IN_SUCCESS', function () {
      expect(reducer(undefined, {
        type: SIGN_IN_SUCCESS,
        response: [sqlCredentials],
      })).to.eql(jsCredentials);
    });

    it('VERIFY_SUCCESS', function () {
      expect(reducer(undefined, {
        type: VERIFY_SUCCESS,
        response: [sqlCredentials],
      })).to.eql(jsCredentials);
    });

    it('RENEW_SESSION_SUCCESS', function () {
      expect(reducer(undefined, {
        type: RENEW_SESSION_SUCCESS,
        response: [sqlCredentials],
      })).to.eql(jsCredentials);
    });
  });
});
