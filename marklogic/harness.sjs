var tap = require('./lib/tap');

var harness = {
  items: [],
  register: function(test) {
    this.items.push(test);
    console.debug('mltap:', 'Registering ' + test.name + ': ' + this.items.length);
    return this;
  },
  run: function() {
    return this.items.map(function(test) {
      return {
        name: test.name,
        assertions: test.run()
      }
    });
  }
};

/**
 * Registers zero or more tests and returns the harness itself.
 * 
 * @param {Iterable<Test>} tests
 * @returns harness Singleton instance of the global harness
 */
function runner(/* ...tests */) {
  if('string' === typeof arguments[1]) {
    return remoteRunner(arguments[0], arguments[1], arguments[2], arguments[3]);
  } else { 
    for(var i = 0; i < arguments.length; i++) {
      harness.register(arguments[i]);
    }
    return harness;
  }
}

/**
 * Run the tests at the referenced paths and return a TAP string.
 * Must be amped to the mltap-internal role.
 * 
 * @example
 * 'use strict';
 * const mltap = require('/mltap');
 * mltap(['test/test.test.sjs', 'test/lib.test.sjs',]);
 * 
 * @param {Array<string>} tests
 * @returns {string} TAP 13 output
 */
function remoteRunner(tests, root, modules, accept) {
  xdmp.securityAssert(['http://github.com/jmakeig/mltap/runner'], 'execute');
  console.debug('mltap:', tests, root, modules);
  var results = [];
  var ctx = {
    root: root,
    modules: modules || 0,
    ignoreAmps: false,
  }

  var transform = function identity(r) { return r; };
  if('tap' === accept) {
    transform = tap;
  }

  return transform(
    tests.map(function(test) {
      var harness = fn.head(xdmp.invoke(test, null, ctx));
      console.log('mltap:', 'Registering tests ' + test + ' from ' + root);
      return {
        module: test,  
        tests: harness.run()
      };
    })
  );
}

module.exports = module.amp(runner);