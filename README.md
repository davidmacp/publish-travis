# publish-test

Functional Test Suite for Publish

## Install

`npm i`

## Run tests

`npm test`

Tests are set up in `package.json` to run in parallel in order to speed total execution time up

`"test": "./node_modules/.bin/codeceptjs run-multiple parallel --steps --plugins allure"`

All tests can be run at once using the above, or individual features can be run on their own by changing the command to:

`"test": "./node_modules/.bin/codeceptjs run --steps --plugins allure"`

And pointing to the relevant test in the `codecept.json` file

e.g. `"tests": "./test/features/sign*/*_test.js"` will run all tests in the `sign_in_page` folder

By default tests are run headless but the chromium browser can be displayed by setting `"show": true,` in `codecept.json`

Each test in a feature is standalone and independent of others so they can be run in any order.

## Environment

The environment tests are to be run against can be set in the `url` field of `codecept.json`

```
{
  "output": "./test/output",
  "helpers": {
    "Puppeteer": {
      "url": "http://publish-develop.eb.dev.dadi.technology",
      .....
```
