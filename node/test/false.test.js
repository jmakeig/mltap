'use strict';

const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.false()', (assert) => {
  // console.log(process.cwd());
  //console.log(__dirname);

  assert.plan(8);
  remote('false.test.sjs', path.resolve(__dirname, '../../marklogic/test')) // CHANGE ME
    // .then(assert.comment)
    .then(tap => parseTAP(tap))
    // .then(tap => {console.log(JSON.stringify(tap, null, 2)); return tap;})
    .then(tap => {
      assert.equal(tap.count, 5, 'count');
      assert.equal(tap.pass, 1, 'pass');
      assert.equal(tap.fail, 4, 'fail');

      const failure = tap.failures[0];
      assert.equal(failure.diag.expected, 'false', 'false expected');
      assert.equal(failure.diag.actual, 'true', 'true actual');
      assert.true(failure.diag.at.startsWith('Object.test'), 'at stack frame instance.method'); // Yuck!
      assert.true(failure.diag.at.endsWith('/false.test.sjs:8:15)'), 'at stack frame location')
      assert.equal(failure.diag.operator, 'false', 'operator is false');
    })
    .catch(assert.end);
});

