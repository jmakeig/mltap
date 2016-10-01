'use strict';

require('./polyfill');
var inspect = require('./format');

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
    var opts = {
      pad: {
        num: inheritedIndent + 4,
        hanging: false
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
    var re = /[\n\r]/g;
    return 'string' === typeof str && re.test(str);
  }

  // results = modules[]/tests[]/assertions[]

  var counter = 0;
  var out = ['TAP version 13'];

  // This is for the case where tests are being run inline
  // and don’t specify a module.
  if(results[0] && !('module' in results[0])) {
    results = [{ module: '[inline]', tests: results }];
  }
  results.forEach(function (module) {
    module.tests.forEach(function (test) {
      out.push('# ' + test.name);
      //out.push(`# ${test.duration * 1000}ms`)
      test.assertions.forEach(function (assertion) {
        switch (assertion.outcome) {
          case 'pass':
            out.push('ok ' + ++counter + ' ' + assertion.message);
            break;
          case 'fail':
            out.push('not ok ' + ++counter + ' ' + assertion.message);
            out.push(indent('---', 2));
            out.push(indent('operator: ' + assertion.operator, 4));
            out.push(indent('expected: |-\n' + yaml(assertion.expected, 4), 4));
            out.push(indent('actual: |-\n' + yaml(assertion.actual, 4), 4));
            out.push(indent('at: ' + assertion.at, 4));
            out.push(indent('...', 2));
            break;
          case 'error':
            out.push('not ok ' + ++counter + ' Error: ' + assertion.message);
            // <https://github.com/substack/tape/blob/master/lib/results.js#L139-L166>
            out.push(indent('---', 2));
            out.push(indent('operator: ' + assertion.operator, 4));
            out.push(indent('actual: |-\n' + yaml(assertion.actual, 4), 4));
            if (assertion.stack) {
              var frame = assertion.stack[0];
              out.push(indent('at: "' + frame.functionName + ' (' + frame.fileName + ':' + frame.lineNumber + ':' + frame.columnNumber + ')"', 4));
              out.push(indent('stack: |-', 4)); // YAML: Use |- to strip final line break in a multi-line value
              out.push(indent('Error: ' + assertion.message, 6));
              assertion.stack.forEach(function(frame){
                out.push(indent('at ' + _frame.functionName + ' (' + _frame.fileName + ':' + _frame.lineNumber + ':' + _frame.columnNumber + ')', 10));
              });
            }
            out.push(indent('...', 2));
            break;
          default:
            throw new Error(assertion.outcome + ' is not a valid assertion type');
        }
      });
    });
  });
  out.push('');
  out.push('1..' + counter);
  return out.join('\n');
}

module.exports = asTAP;
