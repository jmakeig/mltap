'use strict';

const test = require('tape-catch');
const exec = require('./exec');

test('Throws an error after some assertions pass', (assert) => {
  assert.plan(1);
  exec('test.test.sjs')
    .then((tap) => {
      assert.comment(tap.length);
      assert.true(true, '’Tis true');
    })
    .catch((error, stderr) => assert.fail(error));
});
