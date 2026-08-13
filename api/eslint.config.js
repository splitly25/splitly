const js = require('@eslint/js')
const babelParser = require('@babel/eslint-parser')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
        allowImportExportEverywhere: true
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
        global: 'readonly',
        // ES2020 globals
        BigInt: 'readonly',
        globalThis: 'readonly'
      }
    },
    rules: {
      // Common
      'no-console': 'warn',
      // Existing violations stay visible while CI adoption is incremental.
      'no-const-assign': 'warn',
      'no-dupe-keys': 'warn',
      'no-empty': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-irregular-whitespace': 'warn',
      'no-lonely-if': 'warn',
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-escape': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': 'warn',
      'space-before-blocks': ['warn', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      'indent': ['warn', 2],
      'semi': ['warn', 'never'],
      'quotes': ['warn', 'single'],
      'array-bracket-spacing': 'warn',
      'linebreak-style': 'off',
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': 'warn',
      'comma-dangle': 'warn',
      'comma-spacing': 'warn',
      'arrow-spacing': 'warn'
    }
  },
  {
    files: ['src/**/*.js']
  }
]
