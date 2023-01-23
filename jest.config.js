/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/lib/", "/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  testTimeout: 20000,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: -10,
    },
  },
};
