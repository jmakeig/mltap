'use strict';

var test = require('/mltap/test');

test('assert.deepEqual()', function(assert) {
  assert.deepEqual({a: 'A'}, {a: 'A'}, 'Deep equal');
  assert.deepEqual({a: 'A'}, [], 'Not deep equal');
  assert.deepEqual({}, ''); // No message
  assert.end();
});
