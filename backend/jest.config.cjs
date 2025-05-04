// module.exports = {
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src'],
//   moduleFileExtensions: ['js', 'json'],
//   transform: {
//     '^.+\\.js$': 'babel-jest',
//   },
//   collectCoverage: true,
//   coverageDirectory: 'coverage',
//   coverageReporters: ['text', 'lcov'],
// };

module.exports = {
    testMatch: [
        "**/src/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
};
