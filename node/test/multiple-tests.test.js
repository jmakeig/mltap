'use strict';

const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')();
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('mutiple tests', assert => {
  assert.plan(2);
  remote(
    'multiple-tests.test.sjs',
    path.resolve(__dirname, '../../marklogic/test')
  )
    .then(tap => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.pass, 3, '3 tests pass');
      assert.equal(tap.fail, 1, '1 test fails');
    })
    .catch(assert.end);
});
