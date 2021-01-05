module.exports = {
    name: "voucher service",
    preset: 'ts-jest',
    testEnvironment: 'node',
    forceCoverageMatch: [
        "**/*.{js,ts}"
    ],
    cacheDirectory: "./tmp",
    rootDir: "./test",
    coverageDirectory: "./out",
    coverageReporters: [
        "json"
    ],
    errorOnDeprecated: true,
    maxConcurrency: 0,
    runner: "jest-serial-runner",
};
