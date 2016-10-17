'use strict';

var test = require('/mltap/test');

test('inspect', function(assert) {
  // All of these are intended to fail
  // so we can test the serialization of 
  // various types
  assert.equal('string', null, 'string');
  assert.equal('Here is a string with spaces and \n line \n breaks', null, 'string with line breaks');
  assert.equal(1000, null, 'number');
  assert.equal(true, null, 'boolean');
  assert.equal({a: 'A', b: 'B'}, null, 'object');
  assert.equal(/\d+/g, null, 'regexp');
  assert.equal([1, 2, 3, 4, 5, 6, 7, 8, 9], null, 'array');
  assert.equal(null, 14, 'null');
  assert.equal(undefined, null, 'undefined');
  assert.equal(function asdf() {}, null, 'function');
  assert.equal(function() {}, null, 'function, anonymous');
  try {
    throw new ReferenceError('asdf');
  } catch(err) {
    assert.equal(err, null, 'Error');
  }
  assert.end();
});


// MarkLogic 
/*
TAP version 13
# inspect
not ok 1 string
  ---
    operator: TODO
    expected: "null"
    actual: "'Here is a string with spaces and \n line \n breaks'"
    at: "Test.impl (/test/inspect.test.sjs:9:10)"
  ...
not ok 2 number
  ---
    operator: TODO
    expected: "null"
    actual: "1000"
    at: "Test.impl (/test/inspect.test.sjs:10:10)"
  ...
not ok 3 boolean
  ---
    operator: TODO
    expected: "null"
    actual: "true"
    at: "Test.impl (/test/inspect.test.sjs:11:10)"
  ...
not ok 4 object
  ---
    operator: TODO
    expected: "null"
    actual: "{ a: 'A', b: 'B' }"
    at: "Test.impl (/test/inspect.test.sjs:12:10)"
  ...
not ok 5 regexp
  ---
    operator: TODO
    expected: "null"
    actual: "/\d+/g"
    at: "Test.impl (/test/inspect.test.sjs:13:10)"
  ...
not ok 6 array
  ---
    operator: TODO
    expected: "null"
    actual: "[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]"
    at: "Test.impl (/test/inspect.test.sjs:14:10)"
  ...
not ok 7 null
  ---
    operator: TODO
    expected: "14"
    actual: "null"
    at: "Test.impl (/test/inspect.test.sjs:15:10)"
  ...
not ok 8 undefined
  ---
    operator: TODO
    expected: "null"
    actual: "undefined"
    at: "Test.impl (/test/inspect.test.sjs:16:10)"
  ...
not ok 9 function
  ---
    operator: TODO
    expected: "null"
    actual: "[Function]"
    at: "Test.impl (/test/inspect.test.sjs:17:10)"
  ...
not ok 10 Error
  ---
    operator: TODO
    expected: "null"
    actual: "[ReferenceError: asdf]"
    at: "Test.impl (/test/inspect.test.sjs:21:12)"
  ...

1..10
*/

// Node
/*
TAP version 13
# inspect
not ok 1 string
  ---
    operator: equal
    expected: null
    actual:   'Here is a string with spaces and \n line \n breaks'
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:9:10)
  ...
not ok 2 number
  ---
    operator: equal
    expected: null
    actual:   1000
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:10:10)
  ...
not ok 3 boolean
  ---
    operator: equal
    expected: null
    actual:   true
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:11:10)
  ...
not ok 4 object
  ---
    operator: equal
    expected: |-
      null
    actual: |-
      { a: 'A', b: 'B' }
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:12:10)
  ...
not ok 5 regexp
  ---
    operator: equal
    expected: null
    actual:   /\d+/g
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:13:10)
  ...
not ok 6 array
  ---
    operator: equal
    expected: null
    actual:   [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:14:10)
  ...
not ok 7 null
  ---
    operator: equal
    expected: 14
    actual:   null
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:15:10)
  ...
not ok 8 undefined
  ---
    operator: equal
    expected: null
    actual:   undefined
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:16:10)
  ...
not ok 9 function
  ---
    operator: equal
    expected: null
    actual:   [Function]
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:17:10)
  ...
not ok 10 Error
  ---
    operator: equal
    expected: |-
      null
    actual: |-
      [ReferenceError: asdf]
    at: Test.err (/Users/jmakeig/Workspaces/mltap/test/inspect.test.sjs:21:12)
  ...

1..10
# tests 10
# pass  0
# fail  10
*/
