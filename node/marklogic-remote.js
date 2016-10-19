'use strict';

const marklogic = require('marklogic');

const DEFAULT_CONN = {
  host:     'localhost',  // TODO: Parameterize me
  port:     '8000',       // TODO: Parameterize me
  user:     'tester',     // TODO: Parameterize me
  password: 'tester',     // TODO: Parameterize me 
  authType: 'digest',     // TODO: Parameterize me
}
let client;  // Defined below in config

/**
 * 
 * 
 * @param {Array<string>} tests
 * @param {string} root
 * @returns Promise
 */
function remote(tests, root = process.cwd(), accept = 'tap') {  
  // console.log(tests, root);
  return new Promise((resolve, reject) => {
    if(!tests) {
      reject('No tests');
    } else if('string' === typeof tests) {
      tests = [tests];
    }

    /*
     * Assumes external variables:
     *   Array<string> tests - The paths to the tests, relative to the root
     *   string root - The root context to resolve module imports. Assumes file system
     *   string accept - The format to return `tap`
     */
    client.invoke('/mltap/bootstrap.sjs', 
      {
        tests: tests,
        root: root, 
        accept: accept,
      })
      .result(
        response => resolve(response[0].value),
        error => {
          // FIXME: What’s the approriate way to bubble this?
          // console.error(JSON.stringify(error, null, 2)); 
          reject(error)
        } 
      )
  });
}

/**
 * Set up the MarkLogic client and return the remote runner.
 * 
 * @param {objet} [conn=DEFAULT_CONN] host, port, user, password, authType
 * @returns function `remote(tests, root)`
 */
function config(conn = DEFAULT_CONN) {
  client = marklogic.createDatabaseClient(conn)
  return remote;
}

module.exports = config;