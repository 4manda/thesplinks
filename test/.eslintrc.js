module.exports = {
  env: {
    mocha: true,
  },
  rules: {
    'prefer-arrow-callback': 0,
    'import/prefer-default-export': 0,
    'no-unused-expressions': 0,
    'compat/compat': 1,
  },
  globals: {
    sinon: true,
    sinonTest: true,
    expect: true,
    assert: true,
    render: true,
    React: true,
    enzyme: true,
    mount: true,
    shallow: true,
  },
}
