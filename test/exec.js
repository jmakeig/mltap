'use strict';
const path = require('path');
const child = require('child_process');

/**
 * @example
 * exec(['test1.test.sjs', 'test2.test.sjs'])
 *   .then(console.log)
 *   .catch(console.error);
 * 
 * @module
 */

function exec(tests) {
  if(!tests) {
    tests = ['*.test.sjs'];
  } else if('string' === typeof tests) {
    tests = [tests];
  }
  return new Promise(function(resolve, reject) {
    // console.dir(tests);
    child.exec(`bin/mltap ${tests.join(' ')}`, 
      {cwd: path.resolve(__filename, process.cwd())}, // TODO: Is this the correct logic? mltap needs 
        (error, stdout, stderr) => {
        if(error) {
          reject(error, stderr);
        } else {
          resolve(stdout);
        }
      }
    )
  });
}

// exec(['test.test.sjs', 'test.test.sjs'])
//   .then(console.log)
//   .catch(console.error);

module.exports = exec;