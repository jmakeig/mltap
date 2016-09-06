'use strict';

const test = require('tape-catch');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.throws()', (assert) => {
  assert.plan(7);
  remote('test/throws.test.sjs') // CHANGE ME
    .then((tap) => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.count, 3, 'Three total tests run');
      assert.equal(tap.pass, 2, 'Two total tests pass');
      assert.equal(tap.fail, 1, 'Two total tests fail');
      const failure = tap.failures[0];
      assert.skip(failure.diag.operator, 'throws', 'Operator is throws');
      assert.equal(failure.diag.expected, 'ReferenceError');
      assert.equal(failure.diag.actual, 'TypeError');
      assert.equal(failure.diag.at, '/test/throws.test.sjs:17:19', 'Failure location')
    })
    .catch(error => assert.fail(error));
});

