'use strict';

const StackTrace = require('/mltap/_modules/stack-trace/lib/stack-trace.js');

/**
 * CAUTION: This is a total hack.
 * 
 * For objects that cross an `xdmp.invoke()` boundary
 * only the enumerable properties of the instance are 
 * copied, not all of the inherited ones from the 
 * prototype chain. 
 * 
 * This function creates a new instance of a type and then
 * copies all of the enumerable properties from the 
 * immediate prototype onto the newly created instance. 
 * 
 * @param {class|function} Type
 * @returns A new instance that behaves like a `Type`
 */
function newInstance(Type, ...args) {
  // <http://stackoverflow.com/a/3871769/563324>
  let instance = Object.create(Type.prototype);
  instance.constructor = Type;
  const constructed = Type.apply(instance, args);
  if('object' === typeof constructed) {
     instance = constructed;
  }
  // TODO: Shouldn't be necessary
  // Object
  //   .getOwnPropertyNames(Type.prototype)
  //   .forEach(prop => instance[prop] = Type.prototype[prop]);
  return instance;
} 

/**
 * Singleton
 */
const harness = {
  tests: new Array(),
  results: new Array(),
  register(name, impl) {
    this.tests.push(newInstance(Test, name, impl));
  },
  run() {
    for(let test of this.tests) {
      try {
        const start = Date.now();
        const results = test.run();
        const end = Date.now();
        this.results.push({
          name: test.name,
          assertions: results,
          duration: end - start,
        });
      } catch(error) {
        // console.log('Harness.run');
        throw error;
      }
    }
  },
  *[Symbol.iterator]() {
     yield* this.tests[Symbol.iterator](); 
  }
}

function Test(name, impl) {
  this.name = name;
  this.impl = impl;

  this.planned = null; 
  //this.hasPlan = false; // TODO: Turn into a getter
  this.isEnded = false;
  this.isErrored = false;

  this.outcomes = new Array();
}
Test.prototype = {
  run() {
    try {
      this.impl(this);
    } catch(error) {
      this.error(error);
      this.isErrored = true;
    }
    this.complete();
    return this.report();
  },
  report() {
    return this.outcomes;
  },
  /**
   * Reports an unexpected error in the test.
   * 
   * @param {Error} error
   */
  error(error, at) {
    const stack = StackTrace.parse(error);
    // console.log(error.message);
    this.outcomes.push({
      type: 'error', 
      message: error.message, 
      actual: error,
      at: stack[0].toString(),
      stack: stack 
    });
  },
  plan(count) {
    if('number' !== typeof count || count < 1) {
      throw new TypeError('count must be a positive number');
    }
    this.planned = count;
  },
  // Only called when there is *no* plan
  end() {
    if('number' === typeof this.planned) {
      this.assert(false, 'plan', `Planned for ${this.planned}, but ended`, this.outcomes.length, this.planned);
    }
    this.isEnded = true;
  },
  complete() {
    if(this.isErrored) return;
    if('number' === typeof this.planned) {
      if(this.outcomes.length !== this.planned) {
        assert(false, 'plan', `Planned for ${this.planned} assertions, got ${this.outcomes.length}`, this.outcomes.length, this.planned);
      }
    } else if(!this.isEnded) {
      this.assert(false, 'plan', `Didn’t call end after ${this.outcomes.length} assertions`, this.outcomes.length);
    }
  },
  //////////// Assertions //////////// 
  /**
   * Internal assertion implementation. This is meant to be
   * called only from within this instance.
   * 
   * @param {boolean} ok       Whether the assertion is true
   * @param {string} operator  Type of assertion
   * @param {string} message   User message
   * @param {any} actual       Actual value
   * @param {[any]} expected   Expected value
   * @param {[string]} at
   */
  assert(ok, operator, message, actual, expected, at) {
    const report = {
      operator: operator, 
      message: message,
    }
    if(ok) {
      this.outcomes.push(
        Object.assign(report, {
          type: 'pass', 
        })
      );
    } else {
      this.outcomes.push(
        Object.assign(report, {
          type: 'fail', 
          actual: actual,
          expected: expected,
          at: at || StackTrace.get()[2], // Will this actually work?
        })
      );
    }
  },
  true(actual, message) {
    this.assert(Boolean(actual), 'true', message || 'true', actual);
  },
  false(actual, message) {
    this.assert(!Boolean(actual), 'false', message || 'false', actual);
  },
  equal(actual, expected, message) {
    this.assert(actual === expected, 'equal', message || 'equal', actual, expected);
  },

  /**
   * Assert that the function call fn() throws an exception. expected, if present, 
   * must be a RegExp or Function. The RegExp matches the string representation of 
   * the exception, as generated by err.toString(). The Function is the exception 
   * thrown (e.g. Error). msg is an optional description of the assertion. 
   * 
   * @param {function} fn
   * @param {Error} expected
   * @param {string} message
   * @returns void
   */
  throws(fn, expected, message) {
    let actual;
    try {
      fn();
    } catch (error) {
      if(error instanceof expected) {
        this.assert(true, 'throws', message || 'throws');
        return;
      } else {
        actual = error;
      }
    }
    const frame = StackTrace.parse(actual)[0];
    this.assert(false, 'throws', 
      message || 'throws', 
      actual, expected, 
      `${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`);
  },
  deepEqual(actual, expected, message) {
    const deepEqual = require('/mltap/_modules/deep-equal/index.js');
    this.assert(deepEqual(actual, expected, { strict: true }), 
      'deepEqual', 
      message || 'deepEqual', 
      actual, expected);
  },
}

// TODO: Extract this to a util module
function typeName(obj) {
  if(null === obj) {
    return 'null';
  } else if('function' === typeof obj) {
    return String(obj).split(' ')[1].replace(/\(\)$/, '');
  } else if(obj && obj.constructor) {
    return typeName(obj.constructor);
  }
  return typeof obj;
}

function test(name, impl) {
  harness.register(name, impl);
  return harness;
}

module.exports = test;