import loading from 'src/reducers/loading';

describe('loading Reducer', function () {
  const { reducer } = loading.loading;
  it('should return the initial state', function () {
    expect(reducer(undefined, {})).to.eql({
      isLoading: false,
      loadingRequestIDs: [],
    });
  });

  describe('should handle', function () {
    it('API_REQUEST that is not a select', function () {
      expect(
        reducer(undefined, { type: 'API_REQUEST', requestId: 'a' }),
      ).to.eql({
        isLoading: true,
        loadingRequestIDs: ['a'],
      });
    });

    it('SELECT_API_REQUEST', function () {
      expect(
        reducer(undefined, { type: 'SELECT_API_REQUEST', requestId: 'a' }),
      ).to.eql({
        isLoading: true,
        loadingRequestIDs: ['a'],
      });
    });

    it('API_SUCCESS when other api requests still pending', function () {
      expect(reducer(
        { isLoading: true, loadingRequestIDs: ['a', 'b'] },
        { type: 'API_SUCCESS', requestId: 'a' },
      )).to.eql({
        isLoading: true,
        loadingRequestIDs: ['b'],
      });
    });

    it('API_SUCCESS when it is the only request pending', function () {
      expect(reducer(
        { isLoading: true, loadingRequestIDs: ['a'] },
        { type: 'API_SUCCESS', requestId: 'a' },
      )).to.eql({
        isLoading: false,
        loadingRequestIDs: [],
      });
    });
  });
});
