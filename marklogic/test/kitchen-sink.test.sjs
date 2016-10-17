'use strict';

var test = require('/mltap/test');

test('AAAAA. ok', function(assert) {
  assert.true(true, 'true is true');
  assert.equal(1, 0 + 1, '1 is 1');
  assert.end();
});

test('not ok', function(assert) {
  assert.true(!true, 'true is true');
  assert.equal(1, 0 - 1, '1 is not -1');
  assert.end();
});

test('BBBBBB. implicit fail', function(assert) {
  assert.plan(1);
  assert.true(true, 'true is true');
});

test('CCCCC. explicit end', function(assert) {
  try {
    (function uno() { return (function dos(){ return (function tres(){ throw new Error('Nested error')})() })() })();
  } catch(error) {
    assert.end(error);
  }
});

test('DDDDD. explicit fail', function(assert) {
  assert.plan(1);
  assert.skip('called fail');
});

test('EEEEE. skip', function(assert) {
  assert.deepEqual([1], [1], 'deep equal');
  assert.skip(1, 2, 'skip');
  assert.end();
});