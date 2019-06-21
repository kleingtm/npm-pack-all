module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true,
        jest: true
    },
    extends: ["eslint:recommended", "eslint-config-prettier"],
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module"
    },
    plugins: ["eslint-plugin-prettier", "json"],
    rules: {
        "prettier/prettier": "error",
        "no-console": "off",
        "no-useless-escape": "off", // makes useless escapes warnings instead of errors
        "prefer-const": "warn",
        "prefer-template": "warn"
    }
};
