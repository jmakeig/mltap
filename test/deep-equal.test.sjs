'use strict';

const test = require('./is-marklogic') ? require('/mltap/test') : require('tape-catch');

test('assert.throws() passes', (assert) => {
  assert.deepEqual({a: 'A'}, {a: 'A'}, 'Deep equal');
  assert.deepEqual({a: 'A'}, [], 'Not deep equal');
  assert.end();
});
