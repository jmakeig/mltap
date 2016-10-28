'use strict';

var StackTrace = require('/mltap/_modules/stack-trace/lib/stack-trace.js');

/**
 * 
 * 
 * @param {any} name
 * @param {any} test
 * @returns {Test}
 * @constructor
 */
function Test(name, test) {
  this.name = name || 'Test';
  if('function' !== typeof test) {
    throw new TypeError((typeof test) + ' is not a function');
  }
  this.test = test;
  this.planned = undefined;
  this.tally = 0;
  this.isEnded = false;
  
  this.assertions = [];
}
// <http://www.2ality.com/2011/06/constructor-property.html>
// Best practice: Avoid replacing the complete prototype value 
// of a constructor with your own object and only add new properties 
// to it. Alas, with subclassing, you have no choice and have to 
// set the constructor property yourself.
//
// It turns out that an instance does not own the constructor property, 
// but inherits it from its prototype:
//   > function Foo() {}
//   > var f = new Foo();
//   > Object.getOwnPropertyNames(f)
//   []
//   > Object.getOwnPropertyNames(Object.getPrototypeOf(f))
//   [ 'constructor' ]

/**
 * Internal assertion.
 * 
 * @param {string} operator
 * @param {boolean} ok
 * @param {any} actual
 * @param {any} expected
 * @param {string} [msg]
 * @returns {void}
 * @private
 */
Test.prototype.assert = function(operator, ok, actual, expected, msg, at) {
  if(this.isEnded) {
    // result = {
    //   operator: 'end',
    //   outcome: 'fail',
    //   msg: 'Tried to assert ' + operator + ' after end() has been called'
    // }
    // throw new Error('Tried to assert ' + operator + ' after end() has been called');
  }
  var outcome = ok;
  if('boolean' === typeof outcome) {
    outcome = true === outcome ? 'pass' : 'fail';
  }
  switch(outcome) {
    case 'pass':
    case 'fail':
    case 'skip':
    case 'error':
    case 'bail':
      break;
    default:
      throw new Error(String(outcome) + ' is not a valid outcome.');
  }
  var result = {
    operator: operator,
    outcome: outcome,
    expected: expected,
    actual: actual,
    message: msg,
  };

  if('fail' === outcome) {
    var stack = StackTrace.get();
    /* 
      Object.assign.assert (/mltap/test.sjs:111:30),
      Object.assign.deepEqual (/mltap/test.sjs:216:10),
      Object.test (/deep-equal.test.sjs:7:10),
      Object.assign.run (/mltap/test.sjs:153:10),
      /mltap/harness.sjs:13:26,
      Array.map (native),
      Object.harness.run (/mltap/harness.sjs:10:23),
      /mltap/harness.sjs:95:24,
      Array.map (native),
      remoteRunner (/mltap/harness.sjs:90:11),
      runner (/mltap/harness.sjs:53:12),
      /mltap/bootstrap.sjs:3:26
    */
    // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    // console.dir(stack.map(function(frame) { return frame.toString(); }));
    // result.stack = stack.map(function(frame) { return frame.toString(); });
    result.stack = stack;
    result.at = (at || stack[2]).toString();
  }
  
  this.assertions.push(result);
  
  if(this.tally++ === this.planned) {
    this.end();
  }
}
/**
 * @param {number} num
 * @returns {void}
 * @throws {TypeError}
 */
Test.prototype.plan = function(num) {
  if('number' !== typeof num || num < 1) {
    throw new TypeError(num);
  }
  this.planned = num;
}
/**
 * @returns {void}
 */
Test.prototype.end = function() {
  this.isEnded = true;
}
/**
 * Runs the actual test, including clean-up to make sure `plan()`/`end()` have 
 * been called.
 * 
 * @returns {Array<object>}
 * @see assert
 */
Test.prototype.run = function() {
  // FIXME: I think the following don't work as epxected 
  // becuase of the xdmp.invoke boundary
  // console.log(this instanceof Test); // false
  // console.log(this.constructor); // undefined
  // console.log(Object.prototype.toString.call(this));
  this.test(this);
  if(this.planned) {
    if(this.planned !== this.tally) {
      var msg = 'Planned for ' + String(this.planned) + ' assertions, but got ' + String(this.tally);
      this.assert('plan', false, this.tally, this.planned, msg);
    } else {
      this.end();
    }
  } else {
    if(!this.isEnded) {
      // TODO: Exception instead?
      this.assert('end', this.isEnded, false, 'Never called end()');
    }
  }
  return this.assertions;
}
/********** Assertions ***************/

/**
 * Whether the `value` is strictly (`===`) `true`. 
 * 
 * @param {any} value
 * @param {string} [msg]
 * @returns {void}
 */
Test.prototype.true = function(value, msg) {
  msg = msg || String(value) + ' is true?';
  this.assert('true', true === value, value, true, msg);
}

/**
 * Whether the `value` is strictly (`===`) `false`. 
 * 
 * @param {any} value     Any value
 * @param {string} [msg]  A short description
 * @returns {void}
 */
Test.prototype.false = function(value, msg) {
  msg  = msg || String(value) + ' is false?';
  // assert: function(operator, ok, actual, expected, msg, at)
  this.assert('false', false === value, value, false, msg);
},
/**
 * Whether `actual` and `expected` are strictly (`===`) equal.
 * 
 * @param {any} actual
 * @param {any} expected
 * @param {string} [msg]
 * @returns {void}
 */
Test.prototype.equal = function(actual, expected, msg) {
  msg = msg || String(actual) + ' equals ' + String(expected);
  this.assert('equal', expected === actual, actual, expected, msg);
}
/**
 * Whether `actual` and `expected` are strictly (`===`) equal.
 * 
 * @param {any} actual
 * @param {any} expected
 * @param {string} [msg]
 * @returns {void}
 */
Test.prototype.notEqual = function(actual, expected, msg) {
  msg = msg || String(actual) + ' does not equal ' + String(expected);
  this.assert('notEqual', expected !== actual, actual, expected, msg);
}
/**
 * @param {any} actual
 * @param {any} expected
 * @param {string} [msg]
 * @returns {void}
 */
Test.prototype.deepEqual = function(actual, expected, msg) {
  var deepEqual = require('/mltap/_modules/deep-equal/index.js');
  //assert(operator, ok, actual, expected, msg) {
  this.assert( 
    'deepEqual',
    deepEqual(actual, expected, { strict: true }), 
    actual, 
    expected,
    msg
  );
}
/**
 * @param {function} fn
 * @param {Error|string|RegExp} expected
 * @param {string} [msg]
 * @returns {void}
 */
Test.prototype.throws = function(fn, expected, msg) {
  msg = msg || 'throws ' + String(expected);
  var actual;
  try {
    fn();
  } catch (error) {
    if(error instanceof expected) {
      // assert(operator, ok, actual, expected, msg, at) {
      this.assert('throws', true, error, expected, msg);
      return;
    } else {
      actual = error;
    }
  }
  var frame = StackTrace.parse(actual)[0];
  // function(operator, ok, actual, expected, msg, at) {
  this.assert('throws', false,  
    actual, expected,
    msg 
    // StackTrace.parse(actual).map(function(frame) { return frame.toString(); }).join('/n')
  );
}
/**
 * @param {string} [msg]
 * @returns {void}
 */
Test.prototype.skip = function(msg) {}
// }
// ); // Object.assign(Test.prototype, {…})

var runner = require('./harness');

/**
 * Creates a new test and registers it with the harness.
 * 
 * @example
 * var test = require('/mltap/test');
 * test('Uno', function(assert) { assert.plan(2); assert.true(true); assert.true(!!true); });
 * test('Dos', function(assert) { assert.true(true); assert.end(); })
 *   .run().value;
 * 
 * @param {string} name          A short name describing the nature of the test
 * @param {function(Test)} impl  The implementation of the test
 * @returns harness
 */
function test(name, impl) {
  return runner(
    new Test(name, impl)
  );
}

module.exports = test;