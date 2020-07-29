module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2019,
    // parser: "babel-eslint",
    parser: "@typescript-eslint/parser",
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  parser: "vue-eslint-parser",
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off"
  }
}
