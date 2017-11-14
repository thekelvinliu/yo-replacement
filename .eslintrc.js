module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    jest: true
  },
  globals: {
    // react native provides fetch
    fetch: false
  },
  rules: {
    'react/jsx-filename-extension': 'off',
    'react/prefer-stateless-function': 'off'
  }
};
