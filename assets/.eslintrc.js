module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'react-app',
    // 'eslint:recommended',
    // 'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['prettier', 'react'],
  rules: {},
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    // node files
    {
      files: ['webpack.config.js'],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here

        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off'
      })
    }
  ]
};
