module.exports = {
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    collectCoverage: true,
    coverageDirectory: "./coverage",
    collectCoverageFrom: ["**/*"],
    coveragePathIgnorePatterns: [`(.*)\.mocks\.(.*)`, `\/coverage`, `jest\.config`, `package\.json`, `\.lock`, `\-lock`, `^[.]`],
    coverageThreshold: {
        global: {
            statements: 80
        }
    },
    modulePathIgnorePatterns: [".npm-cache", ".npm-tmp", ".cache", ".tmp", ".nvm", ".yarn"],
    reporters: ["default"]
};
