'use strict';

const test = require('tape');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('inspect', (assert) => {
  assert.plan(2);
  remote('test/multiple-tests.test.sjs') // CHANGE ME
    .then((tap) => parseTAP(tap))
    .then(tap => {
      // console.log(JSON.stringify(tap, null, 2));
      assert.equal(tap.pass, 2, '2 tests pass');
      assert.equal(tap.fail, 1, '1 test fails');
    })
    .catch(error => assert.fail(error));
});
