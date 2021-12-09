module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/ignore-styles': () => true, // https://github.com/sveltejs/eslint-p
  },
  rules: {
    'import/no-unresolved': ['error', { ignore: ['^~/.+$', '^virtual:'] }],
  },
}
