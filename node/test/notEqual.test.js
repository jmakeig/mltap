'use strict';

const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.false()', (assert) => {
  // console.log(process.cwd());
  //console.log(__dirname);

  assert.plan(5);
  remote('notEqual.test.sjs', path.resolve(__dirname, '../../marklogic/test')) // CHANGE ME
    // .then(assert.comment)
    .then(tap => parseTAP(tap))
    // .then(tap => {console.log(JSON.stringify(tap, null, 2)); return tap;})
    .then(tap => {
      assert.equal(tap.count, 7, 'count');
      assert.equal(tap.pass, 5, 'pass');
      assert.equal(tap.fail, 2, 'fail');

      // const failure = tap.failures[0];
      // assert.equal(failure.diag.expected, 'false', 'false expected');
      // assert.equal(failure.diag.actual, 'true', 'true actual');
      
      assert.equal(tap.failures[0].diag.actual, 'undefined');
      assert.equal(tap.failures[1].diag.expected, 'true');

    })
    .catch(assert.end);
});

