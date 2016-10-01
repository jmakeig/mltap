'use strict';

var test = require('/mltap/test');

test('assert.throws()', function(assert) {
  // Pass
  assert.throws(
    function() { throw new TypeError('Thrown TypeError'); }, 
    TypeError, 
    'Is a TypeError'
  );
  // Pass
  assert.throws(
    function() { throw new TypeError('Thrown TypeError'); }, 
    Error, 
    'Is an Error'
  );
  // Fail
  assert.throws(
    function() { throw new TypeError('Thrown TypeError'); }, 
    ReferenceError, 
    'Isn’t a ReferenceError'
  );
  assert.end();
});

/*
TAP version 13
# assert.throws()
ok 1 Is a TypeError
ok 2 Is an Error
not ok 3 Isn’t a ReferenceError
  ---
    operator: TODO
    expected: "[Function: ReferenceError]"
    actual: "[TypeError: Thrown TypeError]"
    at: "/test/throws.test.sjs:20:19"
  ...

1..3
*/