import { transformResponse, updateState } from 'kit/lib/utils';

import * as _ from 'lodash';

const DEFAULT_STATE = {
  componentName: 'official_name',
  dataFormat: 'txt',
  groupComponentId: 3,
  groupComponentState: 'required',
  groupComponentUuid: 'RNET-COMPONENT-ab694021-2006-42df-81b8-1a8a43d8be5c',
  pval: 'RNET-GROUP-8f6afab3-282c-4a09-98c6-663f6d0ba6c5',
  userGroupUuid: 'RNET-GROUP-8f6afab3-282c-4a09-98c6-663f6d0ba6c5',
};

const getStateWith = (newState, isArray = true) => {
  const output = _.extend({}, DEFAULT_STATE, newState);
  return isArray ? [output] : output;
};

describe('updateState', function () {
  it('should update an array-based state', function () {
    const beforeState = [DEFAULT_STATE];
    const inputState = getStateWith({ groupComponentState: 'in_motion' });
    expect(updateState(beforeState, inputState, 'groupComponentUuid'))
      .to.eql(inputState);
  });

  it('should throw an error when the current state is an object and the new state is an array', function () {
    const beforeState = DEFAULT_STATE;
    const inputState = [DEFAULT_STATE];
    expect(() => (
      updateState(beforeState, inputState, 'groupComponentUuid')
    )).to.throw();
  });

  it('should update an object-based state', function () {
    expect(updateState(
      getStateWith({
        groupComponentState: 'in_motion',
      }, false),
      DEFAULT_STATE,
      'groupComponentUuid',
    )).to.eql(DEFAULT_STATE);
  });
});

describe('response transformer', function () {
  it('should transform the dictionary keys to camelCase', function () {
    const sample = {
      normally_snake_case: 'string_not_to_be_transformed',
    };
    const expecting = {
      normallySnakeCase: 'string_not_to_be_transformed',
    };
    expect(transformResponse(sample)).to.eql(expecting);
  });

  it('should transform deeply', function () {
    const sample = {
      normally_snake_case: {
        the_other_prop: {
          a_deeply_nested_prop: 'string_not_to_be_transformed',
        },
      },
    };
    const expecting = {
      normallySnakeCase: {
        theOtherProp: {
          aDeeplyNestedProp: 'string_not_to_be_transformed',
        },
      },
    };
    expect(transformResponse(sample)).to.eql(expecting);
  });

  it('should handle deep array transformations', function () {
    const sample = [{
      normally_snake_case: [
        { this_should_transform: true },
        [{ normally_snake_case: 'okay_to_be_snakey' }],
      ],
      also_snake_case: [
        { transform_me_please: [{ me_too: false }] },
      ],
    }];

    const expecting = [{
      normallySnakeCase: [
        { thisShouldTransform: true },
        [{ normallySnakeCase: 'okay_to_be_snakey' }],
      ],
      alsoSnakeCase: [
        { transformMePlease: [{ meToo: false }] },
      ],
    }];

    expect(transformResponse(sample)).to.eql(expecting);
  });
});
