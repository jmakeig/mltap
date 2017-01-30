'use strict';
const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')();
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.throws()', assert => {
  assert.plan(7);
  // CHANGE ME
  remote('throws.test.sjs', path.resolve(__dirname, '../../marklogic/test'))
    .then(tap => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.count, 3, 'Three total tests run');
      assert.equal(tap.pass, 2, 'Two total tests pass');
      assert.equal(tap.fail, 1, 'Two total tests fail');
      const failure = tap.failures[0];
      assert.equal(failure.diag.operator, 'throws', 'Operator is throws');
      assert.deepEqual(failure.diag.expected, '[Function ReferenceError]');
      assert.deepEqual(failure.diag.actual, '[TypeError: Thrown TypeError]');
      assert.comment(failure.diag.at);
      assert.true(
        String(failure.diag.at).endsWith('/throws.test.sjs:23:10)'),
        'Failure location'
      );
    })
    .catch(assert.end);
});
