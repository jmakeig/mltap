'use strict';

var test = require('/mltap/test');

test('assert.false()', function(assert) {
  assert.plan(5);
  assert.false(false, 'false is false');
  assert.false(true, '[FAIL] true is not false');
  assert.false(0, '[FAIL] false-y is not false');
  assert.false(null, '[FAIL] false-y is not false');
  assert.false(undefined, '[FAIL] false-y is not false');
});
