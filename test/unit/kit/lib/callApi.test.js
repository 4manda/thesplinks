import { callAPIMiddleware, clearApiCallCache } from 'kit/lib/callAPIMiddleware';
import nock from 'nock';
import * as utils from 'kit/lib/utils';
import * as authActions from 'src/actions/userSession';
import settings from 'settings';

const { publicApi, citizenApi } = settings.endpoints;
let getUUIDStub;

describe('callAPIMiddleware', function () {
  beforeEach(function () {
    getUUIDStub = sinon.stub(utils, 'getUUID').returns('a');
  });

  afterEach(function () {
    clearApiCallCache();
    nock.cleanAll();
    getUUIDStub.restore();
  });

  const create = (state = { userSession: {}, ephemeral: {} }) => {
    const store = {
      getState: sinon.stub().returns(state),
      dispatch: sinon.stub().callsFake(action => action),
    };
    const next = sinon.stub();
    const invoke = action => callAPIMiddleware(store)(next)(action);
    return { store, next, invoke };
  };
  const testBody = { username: 'Amanda', email: '@example.com' };

  it('returns a function to handle next', function () {
    const { store } = create();
    expect(callAPIMiddleware(store)).to.be.a('function');
  });

  it('which returns a function to handle action', function () {
    const { store } = create();
    expect(callAPIMiddleware(store)()).to.be.a('function');
  });

  describe('handles action where action is a(n)', function () {
    it('object with no "callAPI" key => passes it on to next middleware', function () {
      const { next, invoke } = create();
      const action = { type: 'TEST' };
      invoke(action);
      expect(next).to.have.been.calledWith(action);
    });

    it('function => passes it on to next middleware', sinonTest(function () {
      const { next, invoke } = create();
      const fn = this.stub();
      invoke(fn);
      expect(next).to.have.been.calledWith(fn);
    }));

    it('object with valid callAPI object { api, url, and method }', function () {
      nock(publicApi)
        .get('/test')
        .reply(201, function () {
          expect(this.req.headers['content-type']).to.eql(['application/json']);
          expect(this.req.headers['request-id']).to.eql(['a']);
        });

      const { invoke } = create();
      const action = { callAPI: { api: 'publicApi', url: '/test', method: 'GET' } };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
        expect(act.requestId).to.equal('a');
      });
    });

    it('object with callAPI function that passes in state and returns valid object', function () {
      nock(publicApi)
        .get('/test')
        .reply(201, function () {
          expect(this.req.headers['content-type']).to.eql(['application/json']);
          expect(this.req.headers['request-id']).to.eql(['a']);
        });

      const { invoke, store } = create();
      const action = {
        callAPI: state => {
          expect(state).to.equal(store.getState());
          return { api: 'publicApi', url: '/test', method: 'GET' };
        },
      };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
        expect(act.requestId).to.equal('a');
      });
    });
  });

  describe('handles the callAPI headers parameter', function () {
    it('when none provided and not authenticated', function () {
      nock(publicApi)
        .get('/test')
        .reply(201, function () {
          expect(this.req.headers['content-type']).to.eql(['application/json']);
          expect(this.req.headers['request-id']).to.eql(['a']);
          expect(this.req.headers.authorization).to.eql(undefined);
        });

      const { invoke } = create();
      const action = { callAPI: { api: 'publicApi', url: '/test', method: 'GET' } };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
      });
    });

    it('when none provided and authenticated', function () {
      nock(citizenApi)
        .get('/test')
        .reply(201, function () {
          expect(this.req.headers['content-type']).to.eql(['application/json']);
          expect(this.req.headers['request-id']).to.eql(['a']);
          expect(this.req.headers.authorization).to.eql(['Bearer b']);
        });

      const { invoke } = create({
        userSession: { bearerToken: 'b' },
        ephemeral: {},
      });
      const action = { callAPI: { api: 'citizenApi', url: '/test', method: 'GET' } };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
      });
    });

    it('when additional headers provided', function () {
      nock(publicApi)
        .get('/test')
        .reply(201, function () {
          expect(this.req.headers['content-type']).to.eql(['application/json']);
          expect(this.req.headers['request-id']).to.eql(['a']);
          expect(this.req.headers['x-group']).to.eql(['userGroupUuid']);
          expect(this.req.headers.additional).to.eql(['test']);
        });

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'GET',
          headers: { 'X-Group': 'userGroupUuid', Additional: 'test' },
        },
      };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
      });
    });
  });

  describe('handles callAPI body parameter', function () {
    it('when none provided', function () {
      nock(publicApi)
        .post('/test')
        .reply(201, function (uri, requestBody) {
          expect(requestBody).to.eql({});
        });

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
      });
    });

    it('when method is GET - no body sent', function () {
      nock(publicApi)
        .get('/test')
        .reply(201, function (uri, requestBody) {
          expect(requestBody).to.eql('');
        });

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'GET',
          body: testBody,
        },
      };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
      });
    });

    it('when body is provided', function () {
      nock(publicApi)
        .post('/test')
        .reply(201, function (uri, requestBody) {
          expect(requestBody).to.eql(testBody);
        });

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
          body: testBody,
        },
      };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_SUCCESS');
      });
    });
  });

  describe('handles api responses', function () {
    it('200, with response []', function () {
      nock(publicApi)
        .post('/test')
        .reply(200, []);

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_SUCCESS',
          requestId: 'a',
          response: [],
          contentRange: null,
        });
      });
    });

    it('200, with no content', function () {
      nock(publicApi)
        .post('/test')
        .reply(200);

      const { store, invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_SUCCESS',
          requestId: 'a',
          response: null,
          contentRange: null,
        });
        expect(store.dispatch.calledWith({
          type: '_SUCCESS',
          requestId: 'a',
          response: null,
          contentRange: null,
        })).to.equal(false);
      });
    });

    it('400', function () {
      nock(publicApi)
        .post('/test')
        .reply(400);

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_FAIL',
          requestId: 'a',
        });
      });
    });
  });

  describe('handles additonal parameters besides callAPI', function () {
    it('shouldCallAPI function that passes in state and returns false', function () {
      nock(publicApi)
        .get('/test')
        .reply(201);

      const { invoke, store } = create();
      const action = {
        callAPI: { api: 'publicApi', url: '/test', method: 'GET' },
        shouldCallAPI: state => {
          expect(state).to.equal(store.getState());
          return false;
        },
      };
      return invoke(action).then(act => {
        expect(act.type).to.equal('_ABORT');
      });
    });

    it('types string is provided', function () {
      nock(publicApi)
        .post('/test')
        .reply(200, []);

      const { store, invoke } = create();
      const action = {
        types: 'TEST',
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(() => {
        expect(store.dispatch.calledWith({
          type: 'TEST_REQUEST',
          requestId: 'a',
        })).to.equal(true);
        expect(store.dispatch.calledWith({
          type: 'TEST_SUCCESS',
          requestId: 'a',
          response: [],
          contentRange: null,
        })).to.equal(true);
      });
    });

    it('payload object provided', function () {
      nock(publicApi)
        .post('/test')
        .reply(201);

      const { invoke } = create();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
        payload: testBody,
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_SUCCESS',
          requestId: 'a',
          response: null,
          contentRange: null,
          ...testBody,
        });
      });
    });

    it('success function is called with the api response and dispatch', sinonTest(function () {
      nock(publicApi)
        .post('/test')
        .reply(200, []);

      const { store, invoke } = create();
      const successSpy = this.spy();
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
        success: (response, dispatch) => {
          expect(dispatch).to.equal(store.dispatch);
          expect(response).to.eql([]);
          successSpy();
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_SUCCESS',
          requestId: 'a',
          contentRange: null,
          response: [],
        });
        expect(successSpy).to.have.been.calledOnce;
      });
    }));
  });

  describe('handles renewSession', function () {
    it('when timeNow < timeExp', function () {
      nock(publicApi)
        .post('/test')
        .reply(200, []);

      const timeExp = (new Date().getTime + (30 * 60000)) / 1000;
      const { store, invoke } = create({
        userSession: { userSessionExpiresAt: timeExp },
        ephemeral: {},
      });
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_SUCCESS',
          requestId: 'a',
          contentRange: null,
          response: [],
        });
        expect(store.dispatch).to.have.been.calledTwice;
      });
    });

    it('when timeNow > timeExp and renewSession is success', sinonTest(function () {
      nock(publicApi)
        .post('/test')
        .reply(200, []);

      const timeExp = (new Date().getTime() - (30 * 60000)) / 1000;
      const { store, invoke } = create({
        userSession: { userSessionExpiresAt: timeExp },
        ephemeral: {},
      });
      const renewSessionStub = this.stub(authActions, 'renewSession');
      renewSessionStub.returns(Promise.resolve({ type: 'RENEW_SESSION_SUCCESS' }));
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_SUCCESS',
          requestId: 'a',
          contentRange: null,
          response: [],
        });
        expect(store.dispatch).to.have.been.calledThrice;
        expect(renewSessionStub, 'renewSession').to.have.been.called;
      });
    }));

    it('when timeNow > timeExp and renewSession is fail', sinonTest(function () {
      const timeExp = (new Date().getTime() - (30 * 60000)) / 1000;
      const { invoke } = create({
        userSession: { userSessionExpiresAt: timeExp },
        ephemeral: {},
      });
      const renewSessionStub = this.stub(authActions, 'renewSession');
      renewSessionStub.returns(Promise.resolve({ type: 'RENEW_SESSION_FAIL' }));
      const logoutStub = this.stub(authActions, 'logout');
      const action = {
        callAPI: {
          api: 'publicApi',
          url: '/test',
          method: 'POST',
        },
      };
      return invoke(action).then(act => {
        expect(act).to.eql({
          type: '_FAIL',
          requestId: 'a',
        });
        expect(renewSessionStub, 'renewSession').to.have.been.called;
        expect(logoutStub, 'logoutStub').to.have.been.called;
      });
    }));
  });

  describe('handles errors', function () {
    it('callAPI is a string', function () {
      const { invoke } = create();
      const action = { callAPI: 'test' };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI is a number', function () {
      const { invoke } = create();
      const action = { callAPI: 3 };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI is a array', function () {
      const { invoke } = create();
      const action = { callAPI: [] };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI object is empty {}', function () {
      const { invoke } = create();
      const action = { callAPI: {} };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI object has invalid api key', function () {
      const { invoke } = create();
      const action = { callAPI: { api: '', url: '/', method: 'POST' } };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI object has invalid url key', function () {
      const { invoke } = create();
      const action = { callAPI: { api: 'publicApi', url: '', method: 'POST' } };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI object has invalid method key', function () {
      const { invoke } = create();
      const action = { callAPI: { api: 'publicApi', url: '/', method: '' } };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('types is not a string', function () {
      const { invoke } = create();
      const action = { types: [], callAPI: { api: 'publicApi', url: '/test', method: 'GET' } };
      expect(() => invoke(action)).to.throw(Error);
    });

    it('callAPI function returns empty {}', function () {
      const { invoke } = create();
      const action = { callAPI: () => {} };
      expect(() => invoke(action)).to.throw(Error);
    });
  });
});
