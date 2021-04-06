module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "require-jsdoc": "off",
    "max-len": "off",
    "quotes": ["error", "double"],
  },
};
