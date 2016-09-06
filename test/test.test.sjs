'use strict';

const test = require('./is-marklogic') ? require('/mltap/test') : require('tape-catch');

test('Throws an error after some assertions pass', (assert) => {
  assert.true(true, 'true is true');
  assert.end();
});

test('Another test', (assert) => {
  assert.true(!true, 'true is not true');
  assert.end();
});

