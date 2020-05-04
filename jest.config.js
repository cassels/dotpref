module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/__*__/**',
  ],
  coverageReporters: ['text'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 100,
      lines: 90,
    },
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};
