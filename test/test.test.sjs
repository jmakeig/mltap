'use strict';

function isMarkLogic() {
  try {
    return xdmp && cts;
  } catch(e) {
    return false;
  }
}

// Detect MarkLogic at runtime
const test = isMarkLogic() ? 
               require('/mltap/test') : 
               require('tape-catch');

test('Arrays are iterable', (assert) => {
  assert.true(!true, 'true is true');
  assert.true(!false, 'not false is also true');
  assert.end();
});

test('This test has a plan', (assert) => {
  assert.plan(2);
  assert.true('asdf'.length === 4,  'asdf is length 4');
  assert.true('asdfs'.length === 5, 'asdfs is length 5');
  //assert.end();
});
