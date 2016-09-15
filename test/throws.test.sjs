'use strict';

const test = require('./is-marklogic') ? require('/mltap/test') : require('tape-catch');

test('assert.throws()', (assert) => {
  assert.throws(
    () => { throw new TypeError('Thrown TypeError'); }, 
    TypeError, 
    'Is a TypeError'
  );
  assert.throws(
    () => { throw new TypeError('Thrown TypeError'); }, 
    Error, 
    'Is an Error'
  );
  assert.throws(
    () => { throw new TypeError('Thrown TypeError'); }, 
    ReferenceError, 
    'Isn’t a ReferenceError'
  );
  assert.end();
});