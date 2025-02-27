/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  "roots": [
    "src"
  ],
  "testMatch": [
    "**/*.test.ts"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
}