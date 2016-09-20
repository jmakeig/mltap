## mltap [![Build Status](https://travis-ci.org/jmakeig/mltap.svg?branch=develop)](https://travis-ci.org/jmakeig/mltap)

`mltap` is a **unit testing framework for [MarkLogic](https://developer.marklogic.com/)**. It includes a test harness for running tests in Server-Side JavaScript in MarkLogic, an assertion library, and a Node.js-based command-line wrapper. 

`mltap` (partially) implements the [tape](https://github.com/substack/tape) API, a popular Node.js test framework. This allows you to run the *same* tests in Node.js, modern browsers, and MarkLogic with no modifications to the test code. 

`mltap` produces standard [TAP](https://testanything.org) output so you can use it in other tools that can consume TAP, for example, for continuous integration, IDE integration, or reporting.

### Getting Started

First, install the libraries and the command-line interface, 

```shell
git clone https://github.com/jmakeig/mltap.git && cd mltap
npm install
npm run setup
npm test
npm install --global . # optional
```

This installs the the command-line interface on your `$PATH` and configures MarkLogic with the necessary library modules and security settings. You’ll only need to do this once.

Then from within the project you’d like to test,

```shell
mltap test/*.test.sjs
```

Behind the scenes, `mltap` will run each of local the `*.test.sjs` modules against the target MarkLogic JavaScript environemnt. `mltap` collates the results and produces a summary of the passed and failed tests in [TAP](https://testanything.org) format to stdout. You can use any TAP consumer to further process the output. For example, [tap-diff](https://www.npmjs.com/package/tap-diff) pretty prints TAP on the command-line.

```shell
npm install -g tap-diff
mltap test/*.test.sjs | tap-diff
```

### Example Test and TAP Output


```js
'use strict';

const test = isMarkLogic() ? 
               require('/mltap/test') : 
               require('tape-catch');

test('Throws an error after some assertions pass', (assert) => {
  assert.true(true, 'true is true');
  throw new Error('Test error');
  assert.true(!false, 'not false is also true');
  assert.end();
});

test('This test has a fulfilled plan', (assert) => {
  assert.plan(2);
  assert.true('asdf'.length === 4,  'asdf is length 4');
  assert.true('asdfs'.length === 5, 'asdfs is length 5');
});

test('This test has an unfulfilled plan', (assert) => {
  assert.plan(25);
  assert.true('asdf'.length === 4,  'asdf is length 4');
  assert.true('asdfs'.length === 5, 'asdfs is length 5');
});


function isMarkLogic() {try {return xdmp && cts;} catch(e) {return false;}}
```

```
TAP version 13
# Throws an error after some assertions pass
ok 1 true is true
not ok 2 Error: Test error
  ---
    operator: error
    actual: undefined
    at: Test.impl (/test/test.test.sjs:9:9)
    stack: |-
      Error: Test error
          at Test.impl (/test/test.test.sjs:9:9)
          at Test.run (/mltap/test.js:76:12)
          at Object.run (/mltap/test.js:49:28)
  ...
# This test has a fulfilled plan
ok 3 asdf is length 4
ok 4 asdfs is length 5
# This test has an unfulfilled plan
ok 5 asdf is length 4
ok 6 asdfs is length 5
not ok 7 Planned for 25 assertions, got 2
  ---
    operator: ok
    expected: 25
    actual: 2
    at: Test.run (/mltap/test.js:81:10)
  ...

1..7
```

### Development Set-Up

```shell
git clone https://github.com/jmakeig/mltap.git && cd mltap
npm install
# Copies the MarkLogic library modules to $ML_HOME/Modules/mltap
# You’ll need to run this anytime the MarkLogic modules change
# This should theoretically work with a modules database in the future
npm config  # Requires MarkLogic running (defaults to admin:admin@localhost:8000)
npm test
```

#### For VSCode

Install Node.js TypeScript types to enable code completion,

```shell
npm install -g typings
typings install dt~node --global
```