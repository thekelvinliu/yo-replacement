module.exports = {
  extends: 'airbnb',
  env: {
    jest: true
  },
  globals: {
    // react native provides fetch
    fetch: false
  },
  rules: {
    'react/jsx-filename-extension': 'off'
  }
};
