import { config as base } from '@prismate/eslint-config/base';

/** @type {import('eslint').Linter.Config[]} */
export default [
	...base,
	{
		ignores: ['dist/**'],
	},
];