module.exports = {
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    collectCoverage: true,
    coverageDirectory: "./coverage",
    collectCoverageFrom: ["index.js"],
    coveragePathIgnorePatterns: [],
    coverageThreshold: {
        global: {
            functions: 100,
            statements: 80
        }
    },
    modulePathIgnorePatterns: [".npm-cache", ".npm-tmp", ".cache", ".tmp", ".nvm", ".yarn"],
    reporters: ["default"]
};
