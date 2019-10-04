const path = require('path');
const baseRules = require('eslint-config-airbnb-base/rules/style');
const [_, ...restricted] = baseRules.rules['no-restricted-syntax'];
const PATHS = require('./config/paths');

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    jsx: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: [
    'babel',
    'import',
    'jsx-a11y',
    'compat',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 0,
    'func-names': 0,
    'linebreak-style': 0,
    'no-restricted-syntax': [2,
      ...restricted.filter(
        r => !['ForOfStatement'].includes(r.selector)
      ),
    ],
    'global-require': 0,
    'function-paren-newline': ['error', 'consistent'],
    'object-curly-newline': ['error', {
      'consistent': true,
    }],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': [2, { commonjs: true }],
    'compat/compat': 1,
    'react/no-unused-prop-types': 1,
    'react/forbid-prop-types': [1, { forbid: ['any']} ],
    'react/prefer-stateless-function': 0,
    'react/no-multi-comp': 0,
    'react/jsx-curly-spacing': [2, {
      'when': 'always',
      'spacing': { 'objectLiterals': 'never' },
    }],
    'react/jsx-closing-bracket-location': [1, {
      'nonEmpty': 'after-props',
      'selfClosing': 'tag-aligned',
    }],
    'react/prop-types': [1, {
      ignore: [
        // `dispatch` is typically used by Redux `@connect`
        'dispatch',
        // `data` is injected by Apollo
        'data',
      ],
    }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'jsx-a11y/label-has-for': ['error', {
      'required': { 'every': ['id'] },
    }],
    'jsx-a11y/anchor-is-valid': [ 'error', {
      'components': ['Link'],
      'specialLink': ['to'],
    }],
    'jsx-a11y/click-events-have-key-events': 1,
    'jsx-a11y/no-static-element-interactions': 1,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          PATHS.root,
          'node_modules',
        ],
      },
    },
    'polyfills': ['fetch']
  },
  globals: {
    SERVER: false,
  },
  root: true,
};
