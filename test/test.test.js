'use strict';

const test = require('tape-catch');
const remote = require('../marklogic-remote')(/* connection */);

test('Throws an error after some assertions pass', (assert) => {
  assert.plan(1);
  remote('test/test.test.sjs')
    .then((tap) => {
      //assert.comment(tap.length);
      assert.true(true, '’Tis true');
    })
    .catch((error, stderr) => assert.fail(error));
});
