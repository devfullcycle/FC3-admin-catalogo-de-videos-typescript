import { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  setupFilesAfterEnv: ['./jest-setup.ts'],
};

export default config;
