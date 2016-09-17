'use strict';

const test = require('tape-catch');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('inspect', (assert) => {
  assert.plan(11);
  remote('test/inspect.test.sjs') // CHANGE ME
    .then((tap) => parseTAP(tap))
    .then(tap => {
      const actual = result => result.diag.actual;
      // console.log(JSON.stringify(tap, null, 2));
      const results = tap.failures; 
      assert.equal(actual(results[0]), 'string');
      assert.equal(actual(results[1]), 'Here is a string with spaces and \n line \n breaks');
      assert.equal(actual(results[2]), 1000);
      assert.equal(actual(results[3]), true);
      assert.deepEqual(actual(results[4]), {a:'A', b:'B'});
      assert.equal(actual(results[5]), '/\\d+/g');
      assert.deepEqual(actual(results[6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
      assert.equal(actual(results[7]), null);
      assert.equal(actual(results[8]), 'undefined');
      assert.deepEqual(actual(results[9]), [{'Function': 'asdf'}]);
      assert.deepEqual(actual(results[10]), ['Function']);
    })
    .catch(error => assert.fail(error));
});
