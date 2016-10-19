'use strict';

// require('/mltap/lib/polyfill');
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

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
Test.prototype = Object.assign( 
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
  Test.prototype,
{
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
  assert: function(operator, ok, actual, expected, msg, at) {
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
      at: at || StackTrace.get()[2]
    }
    this.assertions.push(result);
    
    if(this.tally++ === this.planned) {
      this.end();
    }
  },
  /**
   * @param {number} num
   * @returns {void}
   * @throws {TypeError}
   */
  plan: function(num) {
    if('number' !== typeof num || num < 1) {
      throw new TypeError(num);
    }
    this.planned = num;
  },
  /**
   * @returns {void}
   */
  end: function() {
    this.isEnded = true;
  },
  /**
   * Runs the actual test, including clean-up to make sure `plan()`/`end()` have 
   * been called.
   * 
   * @returns {Array<object>}
   * @see assert
   */
  run: function() {
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
  },
  /********** Assertions ***************/

  /**
   * Whether the `value` is strictly (`===`) `true`. 
   * 
   * @param {any} value
   * @param {string} [msg]
   * @returns {void}
   */
  true: function(value, msg) {
    msg = msg || String(value) + ' is true?';
    this.assert('true', true === value, value, true, msg);
  },

  /**
   * Whether the `value` is strictly (`===`) `false`. 
   * 
   * @param {any} value     Any value
   * @param {string} [msg]  A short description
   * @returns {void}
   */
  false: function(value, msg) {
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
  equal: function(actual, expected, msg) {
    msg = msg || String(actual) + ' equals ' + String(expected);
    this.assert('equal', expected === actual, actual, expected, msg);
  },
  /**
   * @param {any} actual
   * @param {any} expected
   * @param {string} [msg]
   * @returns {void}
   */
  deepEqual: function(actual, expected, msg) {
    var deepEqual = require('/mltap/_modules/deep-equal/index.js');
    //assert(operator, ok, actual, expected, msg) {
    this.assert( 
      'deepEqual',
      deepEqual(actual, expected, { strict: true }), 
      actual, 
      expected,
      msg
    );
  },
  /**
   * @param {function} fn
   * @param {Error|string|RegExp} expected
   * @param {string} [msg]
   * @returns {void}
   */
  throws: function(fn, expected, msg) {
    var actual;
    try {
      fn();
    } catch (error) {
      if(error instanceof expected) {
        // assert(operator, ok, actual, expected, msg, at) {
        this.assert('throws', true, error, expected, msg, StackTrace.parse(error)[0]);
        return;
      } else {
        actual = error;
      }
    }
    var frame = StackTrace.parse(actual)[0];
    this.assert('throws', false,  
      actual, expected,
      msg, 
      stringify(frame)
      // `${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`
    );
  },
  /**
   * @param {string} [msg]
   * @returns {void}
   */
  skip: function(msg) {}
}
); // Object.assign(Test.prototype, {…})

function stringify(frame) {
  if(!frame) { return ''; }
  return frame.fileName + ':' + frame.lineNumber + ':' + frame.columnNumber;
}

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