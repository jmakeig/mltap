'use strict';

var test = require('/mltap/test');

test('One', function(assert) {
  assert.plan(2);
  assert.true(true, 'Passed assertion from the first test');
  assert.equal(1, 1);
});
test('Two', function(assert) {
  assert.plan(1);
  assert.true(true, 'Passed assertion from the second test');
});
test('Three', function(assert) {
  assert.plan(1);
  assert.true(!true, 'Failed assertion from the second test');
});
