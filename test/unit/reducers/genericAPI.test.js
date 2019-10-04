import * as _ from 'lodash';
import apiReducer from 'src/reducers/api';

describe('api Reducer', function () {
  it('has citizen roots', function () {
    expect(apiReducer).to.have.property('citizen');
  });

  _.forEach(apiReducer, (api, key) => {
    describe(`${key} should`, function () {
      it('have state and reducer keys', function () {
        expect(api).to.have.property('state');
        expect(api.state).to.eql({});
        expect(api).to.have.property('reducer');
      });

      it('should return initial state', function () {
        _.forEach(api.reducer(undefined, {}), state => {
          expect(state).to.eql([]);
        });
      });
    });
  });

  describe('should handle', function () {
    it('SELECT_RSVP_SUCCESS', function () {
      expect(apiReducer.citizen.reducer(undefined, {
        type: 'SELECT_RSVP_SUCCESS',
        response: [{ rsvp_uuid: 'a' }],
      }).rsvps).to.eql([{ rsvpUuid: 'a' }]);
    });

    it('UPDATE_RSVP_SUCCESS', function () {
      expect(apiReducer.citizen.reducer({
        rsvps: [{ rsvpUuid: 'a' }],
      }, {
        type: 'UPDATE_RSVP_SUCCESS',
        response: [{ rsvp_uuid: 'a', attending: true }],
      }).rsvps).to.eql([{ rsvpUuid: 'a', attending: true }]);
    });
  });
});
