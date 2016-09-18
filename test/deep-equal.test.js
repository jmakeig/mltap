'use strict';

const test = require('tape-catch');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.deepEqual()', (assert) => {
  assert.plan(7);
  remote('test/deep-equal.test.sjs') // CHANGE ME
    .then((tap) => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.count, 2);
      assert.equal(tap.pass, 1);
      assert.equal(tap.fail, 1);
      const failure = tap.failures[0];
      assert.skip(failure.diag.expected, '?'); // Depends on #19
      assert.skip(failure.diag.actual, '?'); // Depends on #19
      assert.skip(failure.diag.at, '/test/deep-equal.test.sjs:7:10'); // Depends on #20
      assert.equal(failure.diag.operator, 'deepEqual', 'Operator is deepEqual');
    })
    .catch(error => assert.fail(error));
});

