'use strict';

const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('Fail fast on uncaught error', (assert) => {
  assert.plan(1);
  remote('uncaught-error.test.sjs', path.resolve(__dirname, '../../marklogic/test')) // CHANGE ME
    .then((tap) => parseTAP(tap))
    .then(tap => {
      assert.fail('Should have thrown an error');
    })
    .catch(error => assert.true(error instanceof Error, 'Is an Error'));
});
