module.exports = {
	extends: ['@prismate/eslint-config/base'],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	ignorePatterns: ['dist/**'],
};