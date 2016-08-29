'use strict';

const test = isMarkLogic() ? 
               require('/mltap/test') : 
               require('tape-catch');

test('Throws an error after some assertions pass', (assert) => {
  assert.true(true, 'true is true');
  throw new Error('Test error');
  assert.true(!false, 'not false is also true');
  assert.end();
});

test('This test has a fulfilled plan', (assert) => {
  assert.plan(2);
  assert.true('asdf'.length === 4,  'asdf is length 4');
  assert.true('asdfs'.length === 5, 'asdfs is length 5');
});

test('This test has an unfulfilled plan', (assert) => {
  assert.plan(25);
  assert.true('asdf'.length === 4,  'asdf is length 4');
  assert.true('asdfs'.length === 5, 'asdfs is length 5');
});


function isMarkLogic() {try {return xdmp && cts;} catch(e) {return false;}}