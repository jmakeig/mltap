'use strict';

/* Example output

TAP version 13
# Markdown generation
ok 1 Not unescaped
ok 2 Escaped
ok 3 Not unescaped
ok 4 Escaped
ok 5 Total lines
# escapeForHTML
ok 6 should be equal
ok 7 should be equal
ok 8 should be equal
# canary
ok 9 Indentity transform should be the same
# Workspace
ok 10 Total lines
ok 11 should be equal
# Workspace not found
ok 12 Throws a SelectorError
# Multiple workspaces
ok 13 Total lines across template and two examples
# Many workspaces
ok 14 Sum of 100 iterations
# XPath select query
ok 15 Selects one query
ok 16 Node data is string
# XPath selects nothing
ok 17 Intentionally empty selection

1..17
# tests 17
# pass  17

# ok

*/

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
          results: test.run(),
        });
      } catch(error) {
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
}
Test.prototype = {
  run() {
    const assert = newInstance(Assert);
    try {
      this.impl(assert);
    } catch(error) {
      // This should only happen with runtime exceptions, like TypeError,
      // from this library, not exceptions thrown from tested code
      throw error;
    } finally{
      assert.complete();
      return assert.report();
    }
  }
}

function Assert() {
  this.planned = null; // Is this Test or Assert state?
  //this.hasPlan = false; // TODO: Turn into a getter
  this.isEnded = false;

  this.outcomes = new Array();
}
Assert.prototype = {
  plan(count) {
    console.log(`planning: ${count}`);
    if('number' !== typeof count || count < 1) {
      throw new TypeError('count must be a positive number');
    }
    this.planned = count;
  },
  // Only called when there is *no* plan
  end() {
    if('number' === typeof this.planned) {
      this.fail(`Planned for ${this.plan}, but ended`);
    }
    this.isEnded = true;
  },
  complete() {
    console.dir(`${this.planned}, ${this.isEnded}`);
    if('number' === typeof this.planned) {
      if(this.outcomes.length !== this.planned) {
        this.fail(`Planned for ${this.planned} assertions, got ${this.outcomes.length}`);
      }
    } else if(!this.isEnded) {
      this.fail(`Didn’t call end after ${this.outcomes.length} assertions`);
    }
  },
  true(actual, message) {
    // TODO: Check this.isEnded
    try {
      message = message || `false`;
      if(true === actual) {
        this.pass(message)
      } else {
        this.fail(message);
      }
    } catch(error) {
      this.error(message, error)
    }
  },
  equal(actual, expected, message) {
    // TODO: Need a way to convey error feedback specific to 
    // the assertion type
    return this.true(expected === actual, message);
  },

  //////////////////////
  pass(message) {
    this.outcomes.push({type: 'pass', message: message});
  },
  fail(message) {
    this.outcomes.push({type: 'fail', message: message});
  },
  error(message, error) {
    this.outcomes.push({type: 'error', message: message, error: error});
  },
  report() {
    const totals = this.outcomes.reduce(
      (total, outcome) => {
        return Object
          .assign(
            {}, 
            total, 
            { [outcome.type]: total[outcome.type] + 1 }
          ); 
      }, 
      { pass: 0, fail: 0, error: 0}
    );
    return {
      totals: totals,
      assertions: this.outcomes,
    }
  }
}

function test(name, impl) {
  harness.register(name, impl);
  return harness;
}

module.exports = test;