## mltap [![Build Status](https://travis-ci.org/jmakeig/mltap.svg?branch=develop)](https://travis-ci.org/jmakeig/mltap)

A (partial) implementation of the [tape](https://github.com/substack/tape) API. This allows you to run the same tests in Node.js or MarkLogic with no modifications to the test code. (Currently you do have to adjust the `require` imports at the start of each test to run them in MarkLogic).
`mltap` produces [TAP](https://testanything.org) output so you can use it the other tools that can consume TAP. 

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

Install Node.js types to enable code completions:

```shell
npm install -g typings
typings install dt~node --global
```