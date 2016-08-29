'use strict'
const ctx = {modules: 0, root: '/Users/jmakeig/Workspaces/mltap'};

const tests = [
  'test/test.test.sjs',
  'test/lib.test.sjs',
];

const results = [];

for(let test of tests) {
  let harness = fn.head(xdmp.invoke(test, {'__filename': test}, ctx));
  harness.run();
  results.push(
    {
      module: test,
      tests: harness.results,
    }
  );
}

asTAP(results);

function asTAP(results) {
  /**
   * 
   * 
   * @param {string} str
   * @param {number} [num=2]
   * @param {any} [pad=' ']
   * @returns
   */
  function indent(str, num, pad) {
    pad = pad || ' ';
    return ' '.repeat(num) + str;
  }
  let counter = 0;
  const out = ['TAP version 13'];
  for(let module of results) {
    for(let test of module.tests) {
      out.push(`# ${test.name}`);
      for(let assertion of test.assertions) {
        switch(assertion.type) {
          case 'pass':
            out.push(`ok ${++counter} ${assertion.message}`);
            break;
          case 'fail':
            out.push(`not ok ${++counter} ${assertion.message}`);
            // YAML: Use |- to strip final line break in a multi-line value
            // key: |-
            //    value
            // <https://github.com/substack/tape/blob/master/lib/results.js#L139-L166>
            out.push(indent('---', 2));
              out.push(indent(`operator: ${assertion.details.type}`, 4));
              out.push(indent(`expected: ${assertion.details.expected}`, 4));
              out.push(indent(`actual: ${assertion.details.actual}`, 4));
              out.push(indent(`at: ${assertion.details.at}`, 4));
              if(assertion.details.stack) {
                console.log(assertion.details.stack);
              }
            out.push(indent('...', 2));
            break;
          case 'error':
            out.push(`not ok ${++counter} ${assertion.message}`);
            break;
          default:
            throw new Error(`${assertion.type} is not a valid assertion type`);
        }
      }
    }  
  }
  // out.push('\n');
  out.push(`1..${counter}`);
  return out.join('\n');
}