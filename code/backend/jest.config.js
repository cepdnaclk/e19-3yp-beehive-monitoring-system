export default {
    type: 'module',

    // The root of your source code, typically where your package.json is located
    rootDir: './',
  
    // A list of paths to directories that Jest should use to search for files in
    roots: ['<rootDir>/src'],
  
    // A list of file extensions your modules use
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
    // The test environment that will be used for testing
    testEnvironment: 'node',
  
    // A map from regular expressions to module names that allow to stub out resources
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  
    // The glob patterns Jest uses to detect test files
    testMatch: ['<rootDir>/src/test/**/*.test.(js|jsx|ts|tsx)'],
  
    // SetupFiles: An array of file paths to include before each test
    //setupFiles: ['<rootDir>/jest.setup.js'],
  
    // Transform files before running tests
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
  };
  