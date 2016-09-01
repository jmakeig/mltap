'use strict';

const test = require('tape-catch');
const remote = require('../marklogic-remote')(/* connection */);
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('assert.throws()', (assert) => {
  assert.plan(1);
  remote('test/throws.test.sjs') // CHANGE ME
    .then((tap) => {
      //assert.comment(tap.length);
      parseTAP(tap)
        .then(tree => assert.true('object' === typeof tree, 'Non-null parse tree (baby steps)'))
        .catch(error => assert.fail(error));
    })
    .catch((error, stderr) => assert.fail(error.body.errorResponse.message));
});

