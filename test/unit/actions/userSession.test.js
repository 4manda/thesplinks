import settings from 'settings';
import thunk from 'redux-thunk';
import nock from 'nock';
import { configureMockStore } from 'test/utils';
import { callAPIMiddleware } from 'kit/lib/callAPIMiddleware';
import * as utils from 'kit/lib/utils';
import {
  register,
  verifyEmail,
  signIn,
  renewSession,
  logout,
  tryRenewSession,
} from 'src/actions/userSession';
import actionTypes from 'src/actionTypes';

const {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAIL,
  RENEW_SESSION_REQUEST,
  RENEW_SESSION_SUCCESS,
  RENEW_SESSION_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} = actionTypes;
const middlewares = [thunk, callAPIMiddleware];
const mockStore = configureMockStore(middlewares);
const { publicApi } = settings.endpoints;

let getUUIDStub;

describe('userSession actions', function () {
  beforeEach(function () {
    getUUIDStub = sinon.stub(utils, 'getUUID');
    getUUIDStub.returns('a');
  });

  afterEach(function () {
    nock.cleanAll();
    getUUIDStub.restore();
  });

  it('register calls REQUEST, SUCCESS', function () {
    nock(publicApi)
      .post('/rpc/register')
      .reply(200, []);

    const expectedActions = [
      { type: REGISTER_REQUEST, requestId: 'a' },
      { type: REGISTER_SUCCESS, response: [], requestId: 'a', contentRange: null },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: { savedInvite: {} },
    });

    return store.dispatch(register())
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('register calls REQUEST, FAIL', function () {
    nock(publicApi)
      .post('/rpc/register')
      .reply(400);

    const expectedActions = [
      { type: REGISTER_REQUEST, requestId: 'a' },
      { type: REGISTER_FAIL, requestId: 'a' },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: { savedInvite: {} },
    });

    return store.dispatch(register())
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('verifyEmail calls REQUEST, SUCCESS, SIGN_IN', function () {
    nock(publicApi)
      .post('/rpc/verify')
      .reply(200, [{}]);

    const expectedActions = [
      { type: VERIFY_REQUEST, requestId: 'a' },
      { type: VERIFY_SUCCESS, response: [{}], requestId: 'a', contentRange: null },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: {},
    });

    return store.dispatch(verifyEmail())
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('verifyEmail calls REQUEST, FAIL', function () {
    nock(publicApi)
      .post('/rpc/verify')
      .reply(400);

    const expectedActions = [
      { type: VERIFY_REQUEST, requestId: 'a' },
      { type: VERIFY_FAIL, requestId: 'a' },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: {},
    });

    return store.dispatch(verifyEmail())
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('signIn calls REQUEST, SIGN_IN', function () {
    nock(publicApi)
      .post('/rpc/sign_in')
      .reply(200, [{}]);

    const expectedActions = [
      { type: SIGN_IN_REQUEST, requestId: 'a' },
      { type: SIGN_IN_SUCCESS, response: [{}], requestId: 'a', contentRange: null },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: { savedInvite: {} },
    });

    return store.dispatch(signIn('testUser', 'somePassword', true))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('signIn calls REQUEST, SIGN_IN_FAIL', function () {
    nock(publicApi)
      .post('/rpc/sign_in')
      .reply(400);

    const expectedActions = [
      { type: SIGN_IN_REQUEST, requestId: 'a' },
      { type: SIGN_IN_FAIL, requestId: 'a' },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: { savedInvite: {} },
    });

    return store.dispatch(signIn('testUser', 'somePassword', true))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('renewSession should call REQUEST, SUCCESS', function () {
    nock(publicApi)
      .post('/rpc/renew_session')
      .reply(200, [{}]);

    const expectedActions = [
      { type: RENEW_SESSION_REQUEST, requestId: 'a' },
      { type: RENEW_SESSION_SUCCESS, response: [{}], requestId: 'a', contentRange: null },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: { savedInvite: {} },
    });
    const session = { credentials: {} };

    return store.dispatch(renewSession(session))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('renewSession should call REQUEST, FAIL', function () {
    nock(publicApi)
      .post('/rpc/renew_session')
      .reply(400);

    const expectedActions = [
      { type: RENEW_SESSION_REQUEST, requestId: 'a' },
      { type: RENEW_SESSION_FAIL, requestId: 'a' },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: { savedInvite: {} },
    });
    const session = { credentials: {} };

    return store.dispatch(renewSession(session))
      .then(() => expect(store.getActions()).to.eql(expectedActions));
  });

  it('logout should call REQUEST, SUCCESS', sinonTest(function () {
    const expectedActions = [
      { type: LOGOUT_REQUEST },
      { type: LOGOUT_SUCCESS },
    ];
    const store = mockStore({
      userSession: {},
      ephemeral: {},
    });
    const removeItemStub = this.stub(utils.localStorage, 'removeItem');

    store.dispatch(logout());
    expect(store.getActions()).to.eql(expectedActions);
    expect(removeItemStub).to.have.been.callCount(4);
  }));
});
