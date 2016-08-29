## mltap

A (partial) implementation of the [tape](https://github.com/substack/tape) API. This allows you to run the same tests in Node.js or MarkLogic with no modifications to the test code. (Currently you do have to adjust the `require` imports at the start of each test to run them in MarkLogic).
`mltap` produces [TAP](https://testanything.org) output so you can use it the other tools that can consume TAP. 

```js
'use strict';

function isMarkLogic() {
  try {
    return xdmp && cts;
  } catch(e) {
    return false;
  }
}

// Detect MarkLogic at runtime
const test = isMarkLogic() ? 
               require('/mltap/test') : 
               require('tape-catch');

test('Arrays are iterable', (assert) => {
  assert.true(true, 'true is true');
  throw new Error('Test error');
  assert.true(!false, 'not false is also true');
  assert.end();
});

test('This test has a plan', (assert) => {
  assert.plan(2);
  assert.true('asdf'.length === 4,  'asdf is length 4');
  assert.true('asdfs'.length === 5, 'asdfs is length 5');
  //assert.end();
});
```

```
TAP version 13
# Arrays are iterable
ok 1 true is true
not ok 2 Error: Test error
  ---
    operator: error
    actual: undefined
    at: Test.impl (/test/test.test.sjs:18:9)
    stack: |-
      Error: Test error
          at Test.impl (/test/test.test.sjs:18:9)
          at Test.run (/mltap/test.js:76:12)
          at Object.run (/mltap/test.js:49:28)
  ...
# This test has a plan
ok 3 asdf is length 4
ok 4 asdfs is length 5

1..4
```