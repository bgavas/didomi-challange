module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/test"
  ],
  clearMocks: true,
  // Run before tests
  setupFiles: ["<rootDir>/test/setup.ts"],
  // To disable logs
  // silent: true,
  // Disable parallel testing
  maxWorkers: 1,
  // Show checkmarks
  verbose: true,
};