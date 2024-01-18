module.exports = {
    env: {
        node: true,
        commonjs: true,
        browser: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['prettier'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'prettier/prettier': 'error',
    },
};
