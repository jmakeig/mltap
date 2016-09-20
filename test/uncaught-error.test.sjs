'use strict';

const test = require('./is-marklogic') ? require('/mltap/test') : require('tape');

test('Fail fast on uncaught error', (assert) => {
  // 
  throw new Error('Uncaught error');
});
