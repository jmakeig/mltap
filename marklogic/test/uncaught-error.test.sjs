'use strict';

var test = require('/mltap/test');

test('Fail fast on uncaught error', function(assert) {
  // 
  throw new Error('Uncaught error');
});
