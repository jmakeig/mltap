'use strict';

const test = require('./is-marklogic') ? require('/mltap/test') : require('tape-catch');

test('One', (assert) => {
  assert.plan(1);
  assert.true(true, 'Passed assertion from the first test');
});
test('Two', (assert) => {
  assert.plan(1);
  assert.true(true, 'Passed assertion from the second test');
});
test('Three', (assert) => {
  assert.plan(1);
  assert.true(!true, 'Failed assertion from the second test');
});