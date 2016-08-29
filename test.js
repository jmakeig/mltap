'use strict';

const StackTrace = require('lib/stack-trace');

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
let harness = {
  tests: new Array(),
  results: new Array(),
  register(name, impl) {
    this.tests.push(newInstance(Test, name, impl));
  },
  run() {
    for(let test of this.tests) {
      try {
        this.results.push({
          name: test.name,
          assertions: test.run(),
        });
      } catch(error) {
        console.log('Harness.run');
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
  /////////////////////////////////////////////////////////////////////
  pass(message) {
    this.outcomes.push({type: 'pass', message: message});
  },
  /**
   * 
   * 
   * @param {string} [message]
   * @param {any} [expected]
   * @param {any} [actual]
   * @param {string} [at]
   */
  fail(message, expected, actual, at) {
    this.outcomes.push({
      type: 'fail', 
      message: message,
      expected: expected,
      actual: actual,
      at: at,
    });
  },
  /**
   * Reports an unexpected error in the test.
   * 
   * @param {Error} error
   */
  error(error) {
    const stack = StackTrace.parse(error);
    this.outcomes.push({
      type: 'error', 
      message: error.message, 
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
      this.fail(`Planned for ${this.planned}, but ended`, this.planned, this.outcomes.length);
    }
    this.isEnded = true;
  },
  complete() {
    if(this.isErrored) return;
    if('number' === typeof this.planned) {
      if(this.outcomes.length !== this.planned) {
        this.fail(
          `Planned for ${this.planned} assertions, got ${this.outcomes.length}`, 
          this.planned, 
          this.outcomes.length, 
          StackTrace.get()[1]
        );
      }
    } else if(!this.isEnded) {
      this.fail(
        `Didn’t call end after ${this.outcomes.length} assertions`, 
        true, 
        false,
        StackTrace.get()[1]
      );
    }
  },
  true(actual, message) {
    // TODO: Check this.isEnded
    message = message || `false`;
    if(true === actual) {
      this.pass(message)
    } else {
      this.fail(
        message, 
        true, 
        actual,
        StackTrace.get()[1] // 0 is test.js 
      );
    }
  },
  equal(actual, expected, message) {
    return this.true(
      expected === actual, 
      message
    );
  },
  report() {
    return this.outcomes;
  }
}

function test(name, impl) {
  harness.register(name, impl);
  return harness;
}

module.exports = test;