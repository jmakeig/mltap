'use strict';

const inspect = require('/mltap/lib/format');

// const ctx = { modules: 0, root: '/Users/jmakeig/Workspaces/mltap' };

// const tests = [
//   'test/test.test.sjs',
//   'test/lib.test.sjs',
// ];

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
function runner(tests, root, modules) {
  xdmp.securityAssert(['http://github.com/jmakeig/mltap/runner'], 'execute');
  const results = [];
  const ctx = {
    root: root,
    modules: modules || 0,
    ignoreAmps: false,
  }
  for(const test of tests) {
    console.log(`mltap: Running test ${test} from ${root}`)
    let harness = fn.head(xdmp.invoke(test, null, ctx));
    harness.run();
    results.push(
      {
        module: test,
        tests: harness.results,
      }
    );
  }
  return asTAP(results);
}

/**
 * Serialize as TAP
 * 
 * @param {Array} results
 * @returns string
 */
function asTAP(results) {
  /**
   * 
   * 
   * @param {string} str
   * @param {number} [num=2]
   * @param {string} [pad=' ']
   * @returns
   */
  function indent(str, num, pad) {
    pad = pad || ' ';
    return ' '.repeat(num) + str;
  }
  /**
   * Encode as YAML
   * 
   * @param {any} value
   * @returns string YAMLish string
   */
  function yaml(value, inheritedIndent) {
    const opts = { 
      pad: { 
        num: inheritedIndent + 4, 
        hanging: false,
      }
    };
    return inspect(value, opts);
  }

  /**
   * Whether a string contains line breaks.
   * 
   * @param {any} str Any string
   * @returns boolean `false` for non-strings too
   */
  function isMultilineString(str) {
    const re = /[\n\r]/g;
    return 'string' === typeof str && re.test(str);
  }

  let counter = 0;
  const out = ['TAP version 13'];
  for(let module of results) {
    for(let test of module.tests) {
      out.push(`# ${test.name}`);
      //out.push(`# ${test.duration * 1000}ms`)
      for(const assertion of test.assertions) {
        switch(assertion.type) {
          case 'pass':
            out.push(`ok ${++counter} ${assertion.message}`);
            break;
          case 'fail':
            out.push(`not ok ${++counter} ${assertion.message}`);
            out.push(indent('---', 2));
              out.push(indent(`operator: ${assertion.operator}`, 4));
              out.push(indent(`expected: |-\n${yaml(assertion.expected, 4)}`, 4));
              out.push(indent(`actual: |-\n${yaml(assertion.actual, 4)}`, 4));
              out.push(indent(`at: ${assertion.at}`, 4));
            out.push(indent('...', 2));
            break;
          case 'error':
            out.push(`not ok ${++counter} Error: ${assertion.message}`);
            // <https://github.com/substack/tape/blob/master/lib/results.js#L139-L166>
            out.push(indent('---', 2));
              out.push(indent(`operator: ${assertion.operator}`, 4));
              out.push(indent(`actual: |-\n${yaml(assertion.actual, 4)}`, 4));
              if(assertion.stack) {
                let frame = assertion.stack[0];
                out.push(indent(`at: "${frame.functionName} (${frame.fileName}:${frame.lineNumber}:${frame.columnNumber})"`, 4));
                out.push(indent('stack: |-', 4)); // YAML: Use |- to strip final line break in a multi-line value
                out.push(indent(`Error: ${assertion.message}`, 6));
                for(let frame of assertion.stack) {
                  out.push(indent(`at ${frame.functionName} (${frame.fileName}:${frame.lineNumber}:${frame.columnNumber})`, 10));
                }
              }
            out.push(indent('...', 2));
            break;
          default:
            throw new Error(`${assertion.type} is not a valid assertion type`);
        }
      }
    }  
  }
  out.push('');
  out.push(`1..${counter}`);
  return out.join('\n');
}

module.exports = module.amp(runner);