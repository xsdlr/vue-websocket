module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: ['eslint:recommended', 'standard', 'plugin:vue/recommended'],
  rules: {
    'space-before-function-paren': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow console
    'no-console': 0
  }
}
