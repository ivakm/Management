// @ts-check
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');

/**
 * Build a rules object from a plugin by filtering rules whose meta.docs.recommended is true.
 * @param {Record<string, import('eslint').Rule.RuleModule>} rules
 * @param {string} prefix
 * @returns {Record<string, 'error'>}
 */
function recommendedRules(rules, prefix) {
  /** @type {Record<string, 'error'>} */
  const result = {};
  for (const [name, rule] of Object.entries(rules)) {
    if (rule.meta && rule.meta.docs && rule.meta.docs.recommended) {
      result[`${prefix}/${name}`] = 'error';
    }
  }
  return result;
}

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...recommendedRules(angularPlugin.rules, '@angular-eslint'),
      'curly': ['error', 'all'],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      ...recommendedRules(angularTemplatePlugin.rules, '@angular-eslint/template'),
    },
  },
  {
    ignores: ['dist/', '.angular/', 'node_modules/'],
  },
];
