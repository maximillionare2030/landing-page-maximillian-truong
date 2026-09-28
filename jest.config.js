const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // jest-environment-jsdom is not installed; all current tests are node-level.
  // DOM tests would need that package installed plus a per-file
  // `@jest-environment jsdom` docblock to opt into it.
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(customJestConfig);

