'use strict';

const test = require('tape');
// const parseTAP = require('../lib/tap-helpers').parseTAP;

test('AAAAA. ok', assert => {
  assert.true(true, 'true is true');
  assert.equal(1, 0 + 1, '1 is 1');
  assert.end();
});

test('not ok', assert => {
  assert.true(!true, 'true is true');
  assert.equal(1, 0 - 1, '1 is not -1');
  assert.end();
});

test('BBBBBB. implicit fail', assert => {
  assert.plan(1);
  assert.true(true, 'true is true');
});

test('CCCCC. explicit end', assert => {
  try {
    (function uno() {
      return (function dos() {
        return (function tres() {
          throw new Error('Nested error');
        })();
      })();
    })();
  } catch (error) {
    assert.end(error);
  }
});

test('DDDDD. explicit fail', assert => {
  assert.plan(1);
  assert.fail('called fail');
});

test('EEEEE. skip', assert => {
  assert.deepEqual([1], [1], 'deep equal');
  assert.skip(1, 2, 'skip');
  assert.end();
});

test('FFFFF. after ended', assert => {
  assert.true(true);
  assert.end();
  assert.true(true);
});
/*
> tape node/test/kitchen-sink.js

TAP version 13
# AAAAA. ok
ok 1 true is true
ok 2 1 is 1
# not ok
not ok 3 true is true
  ---
    operator: ok
    expected: true
    actual:   false
    at: Test.test (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:13:14)
  ...
not ok 4 1 is not -1
  ---
    operator: equal
    expected: |-
      -1
    actual: |-
      1
    at: Test.test (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:14:10)
  ...
# BBBBBB. implicit fail
ok 5 true is true
# CCCCC. explicit end
not ok 6 Error: Nested error
  ---
    operator: error
    expected: |-
      undefined
    actual: |-
      [Error: Nested error]
    at: Test.error (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:28:12)
    stack: |-
      Error: Nested error
          at tres (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:25:78)
          at dos (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:25:105)
          at uno (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:25:110)
          at Test.error (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:25:115)
          at Test.bound [as _cb] (/Users/jmakeig/Workspaces/mltap/node_modules/tape/lib/test.js:65:32)
          at Test.run (/Users/jmakeig/Workspaces/mltap/node_modules/tape/lib/test.js:84:10)
          at Test.bound [as run] (/Users/jmakeig/Workspaces/mltap/node_modules/tape/lib/test.js:65:32)
          at Immediate.next (/Users/jmakeig/Workspaces/mltap/node_modules/tape/lib/results.js:71:15)
          at runCallback (timers.js:574:20)
          at tryOnImmediate (timers.js:554:5)
  ...
# DDDDD. explicit fail
not ok 7 called fail
  ---
    operator: fail
    at: Test.test (/Users/jmakeig/Workspaces/mltap/node/test/kitchen-sink.js:34:10)
  ...
# EEEEE. skip
ok 8 deep equal
ok 9 1 # SKIP

1..9
# tests 9
# pass  5
# fail  4
*/
