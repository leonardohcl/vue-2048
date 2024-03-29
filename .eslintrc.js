module.exports = {
  root: true,

  env: {
    node: true,
    jest: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'no-dupe-class-members': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
  },

  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/typescript'],
}
