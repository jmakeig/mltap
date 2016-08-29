'use strict';

// Detect MarkLogic at runtime
const test = isMarkLogic() ? 
               require('/mltap/test') : 
               require('tape-catch');

const lib = require('../lib.js');

test('Relative paths for libraries', (assert) => {
  assert.true('asdf' === lib(), 'lib returns "asdf"');
  assert.end();
});

function isMarkLogic() {try {return xdmp && cts;} catch(e) {return false;}}