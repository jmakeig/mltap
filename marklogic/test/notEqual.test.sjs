'use strict';

var test = require('/mltap/test');

test('assert.false()', function(assert) {
  assert.plan(7);
  assert.notEqual('asdf', 'fdsa', 'strings notEqual');
  assert.notEqual(44, 45, 'numbers notEqual');
  assert.notEqual({a: 'A'}, {a: 'A'}, 'object comparison')
  assert.notEqual('44', 44, 'casting notEqual');
  assert.notEqual(0, false, 'false-y notEqual');
  assert.notEqual(void 0, undefined, '[FAIL] void0 equals undefined');
  assert.notEqual(true, !false, '[FAIL] true is not false');
});
