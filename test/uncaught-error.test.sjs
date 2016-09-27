'use strict';

const test = require('/mltap/lib/is-marklogic') ? require('/mltap/test') : require('tape');

test('Fail fast on uncaught error', (assert) => {
  // 
  throw new Error('Uncaught error');
});
