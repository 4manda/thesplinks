import * as _ from 'lodash';
import allAPIActions from 'src/actions/api';

describe('api actions', function () {
  it('should have citizen actions', function () {
    expect(allAPIActions).to.have.all.keys('citizenActions', 'memberActions', 'publicActions');
  });

  _.forEach(allAPIActions, (apiActions, apiName) => {
    describe(`${apiName} api`, () => {
      _.forEach(apiActions, (apiObFunc, apiObName) => {
        describe(`${apiObName}`, function () {
          it('should return a proper callApi object', () => {
            const callApiObj = apiObFunc();
            expect(callApiObj).to.have.all.keys('types', 'callAPI', 'forceCallAPI', 'payload');
            expect(callApiObj.types).to.be.a('string');
            expect(callApiObj.callAPI()).to.have.all.keys('api', 'url', 'headers', 'method', 'body');
            expect(callApiObj.callAPI().api).to.be.a('string');
            expect(callApiObj.callAPI().url).to.be.a('string');
            expect(callApiObj.callAPI().method).to.be.a('string');
            expect(callApiObj.callAPI().body).to.be.an('object');
          });
        });
      });
    });
  });
});
