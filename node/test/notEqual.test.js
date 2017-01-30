'use strict';
const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')();
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.false()', assert => {
  assert.plan(5);
  remote('notEqual.test.sjs', path.resolve(__dirname, '../../marklogic/test'))
    .then(tap => parseTAP(tap))
    .then(tap => {
      assert.equal(tap.count, 7, 'count');
      assert.equal(tap.pass, 5, 'pass');
      assert.equal(tap.fail, 2, 'fail');
      assert.equal(tap.failures[0].diag.actual, 'undefined');
      assert.equal(tap.failures[1].diag.expected, 'true');
    })
    .catch(assert.end);
});
