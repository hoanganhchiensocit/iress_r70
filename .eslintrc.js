module.exports = {
	root: true,
	extends: '@react-native-community',
	parser: 'babel-eslint',
	plugins: ['react', 'react-native'],
	rules: {
		indent: ['off', 2],
		'no-tabs': 'off',
		'handle-callback-err': 'off',
		'linebreak-style': ['error', 'unix'],
		'brace-style': ['error', '1tbs'],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always'
			}
		],
		'max-params': ['off', 3],
		'consistent-return': 'off',
		'prefer-const': 'off',
		'no-unreachable': 'off',
		'no-lonely-if': 'off',
		'no-console': 'off',
		'no-undef': 'off',
		semi: 'off',
		'generator-star-spacing': 'off',
		'prefer-promise-reject-errors': 'off',
		'no-return-assign': 'off',
		'no-unused-vars': 'off',
		'standard/no-callback-literal': [30, ['cb', 'callback']],
		'operator-linebreak': 0,
		'comma-dangle': 0
	}
};
