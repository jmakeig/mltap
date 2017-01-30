'use strict';
const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')();
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.deepEqual()', assert => {
  assert.plan(9);
  remote('deep-equal.test.sjs', path.resolve(__dirname, '../../marklogic/test'))
    .then(tap => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.count, 3, 'count');
      assert.equal(tap.pass, 1, 'pass');
      assert.equal(tap.fail, 2, 'fail');
      let failure = tap.failures[0];
      assert.equal(failure.diag.expected, 'Array []', 'expected Array');
      assert.equal(
        failure.diag.actual,
        'Object {\n  "a": "A",\n}',
        'actual Object'
      );
      assert.comment(failure.diag.at);
      assert.true(
        failure.diag.at.startsWith('Object.test'),
        'at stack frame instance.method'
      );
      // Yuck!
      assert.comment(failure.diag.at);
      assert.true(
        failure.diag.at.endsWith('/deep-equal.test.sjs:7:10)'),
        'at stack frame location'
      );
      assert.equal(failure.diag.operator, 'deepEqual', 'operator is deepEqual');

      failure = tap.failures[1];
      assert.equal(failure.name, '[object Object] is deepEqual to'); // FIXME: What should empty strings report as?
    })
    .catch(assert.end);
});
