'use strict';

const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.deepEqual()', (assert) => {
  // console.log(process.cwd());
  //console.log(__dirname);

  assert.plan(8);
  remote('deep-equal.test.sjs', path.resolve(__dirname, '../../marklogic/test')) // CHANGE ME
    // .then(assert.comment)
    .then(tap => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.count, 2, 'count');
      assert.equal(tap.pass, 1, 'pass');
      assert.equal(tap.fail, 1, 'fail');
      const failure = tap.failures[0];
      assert.equal(failure.diag.expected, 'Array []', 'expected Array');
      assert.equal(failure.diag.actual, 'Object {\n  "a": "A",\n}', 'actual Object');
      assert.true(failure.diag.at.startsWith('Object.test'), 'at stack frame instance.method'); // Yuck!
      assert.true(failure.diag.at.endsWith('/deep-equal.test.sjs:7:10)'), 'at stack frame location')
      assert.equal(failure.diag.operator, 'deepEqual', 'operator is deepEqual');
    })
    .catch(assert.fail);
});

