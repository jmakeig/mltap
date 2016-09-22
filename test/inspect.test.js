'use strict';

const test = require('tape');
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
      assert.equal(actual(results[0]), '"string"', 'string');
      assert.equal(actual(results[1]), '"Here is a string with spaces and \n line \n breaks"', 'multi-line string');
      assert.equal(actual(results[2]), '1000', 'number');
      assert.equal(actual(results[3]), 'true', 'boolean');
      assert.deepEqual(actual(results[4]), 'Object {\n  "a": "A",\n  "b": "B",\n}', 'object');
      assert.equal(actual(results[5]), '/\\d+/g', 'regex');
      assert.deepEqual(actual(results[6]), 'Array [\n  1,\n  2,\n  3,\n  4,\n  5,\n  6,\n  7,\n  8,\n  9,\n]', 'array');
      assert.equal(actual(results[7]), 'null', 'null');
      assert.equal(actual(results[8]), 'undefined', 'undefined');
      assert.deepEqual(actual(results[9]), '[Function asdf]', 'function');
      assert.deepEqual(actual(results[10]), '[Function anonymous]', 'function, anonymous');
    })
    .catch(error => assert.fail(error));
});
