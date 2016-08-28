'use strict'
const ctx = {modules: 0, root: '/Users/jmakeig/Workspaces/mltap'};

const tests = [
  'test/test.test.sjs',
  'test/lib.test.sjs',
];

const results = [];

for(let test of tests) {
  let harness = fn.head(xdmp.invoke(test, {'__filename': test}));
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
  //return results;
  let counter = 0;
  const out = ['TAP version 13'];
  for(let module of results) {
    for(let test of module.tests) {
      out.push('# ' + test.name)
      for(let assertion of test.assertions) {
        switch(assertion.type) {
          case 'pass':
            out.push(`ok ${++counter} ${assertion.message}`);
            break;
          case 'fail':
            out.push(`not ok ${++counter} ${assertion.message}`);
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
  out.push('\n');
  out.push(`1..${counter}`);
  return out.join('\n');
}