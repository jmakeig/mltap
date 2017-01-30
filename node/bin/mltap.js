#! /usr/bin/env node

const doc = `
A MarkLogic unit test framework, compatible with the Node.js tape library.

Usage:
  mltap [-u <user>] [-p <password>] [-d <database>] [-h <host>] [-P <port>] <tests>...

Options:
  -u --user=<user>           MarkLogic user running the tests
  -p --password=<password>   Password for MarkLogic user
  -d --database=<database>   The database name
  -h --host=<host>           MarkLogic host [default: localhost]
  -P --port=<port>           MarkLogic host port [default: 8000]
  --help                     
  --version                  
`;

const opts = require('docopt').docopt(doc);

/**
 * If the connection object lacks a password, prompt for it and 
 * resolve with a new connection object.
 * 
 * @param {object} conn  MarkLogic connection object
 *     { '--database': 'Documents',
 *       '--host': 'localhost',
 *       '--password': null,
 *       '--port': '8000',
 *       '--user': 'asdf',
 *       '<tests>': [ 'test.test.sjs' ] }
 * @returns Promise      A promise to return a MarkLogic connection object
 */
function prepareConnection(opts) {
  /* 
  * MarkLogic connection settings. First commandline options, then
  * environment variables, then defaults. 
  */
  const conn = {
    host: opts['--host'] || process.env['MLTAP_HOST'] || 'localhost',
    port: parseInt(opts['--port'], 10) || process.env['MLTAP_PORT'] || 8000,
    user: opts['--user'] || process.env['MLTAP_USER'] || 'tester',
    password: opts['--password'] || process.env['MLTAP_PASSWORD'] || 'tester',
    database: (
      opts['--database'] || process.env['MLTAP_DATABASE'] || 'Documents'
    ),
    authType: 'digest' // TODO: Parameterize me
  };
  return new Promise((resolve, reject) => {
    if (['digest', 'basic'].indexOf(conn.authType) > -1 && !conn.password) {
      const getPass = require('getpass').getPass;
      const prompt = { prompt: `Password for ${conn.user} (${conn.host})` };
      getPass(prompt, (error, password) => {
        if (error) {
          reject(error);
        } else {
          resolve(Object.assign({}, conn, { password: password }));
        }
      });
    } else {
      resolve(conn);
    }
  });
}

prepareConnection(opts)
  .then(conn => {
    const remote = require('../marklogic-remote')(conn);
    return remote(opts['<tests>'], process.cwd());
  })
  .then(tap => process.stdout.write(tap + '\n'))
  .catch(error => {
    // console.dir(error);
    if ('SEC-PRIV' === error.body.errorResponse.messageCode) {
      process.stderr.write(
        'Are you sure you configured the security settings? '
      );
      process.stderr.write('mltap requires roles, amps, and privileges.\n');
      process.stderr.write('\nFrom where you downloaded mltap, run:\n');
      process.stderr.write('    gradle mlDeploy\n');
    }
    process.stderr.write(error.body.errorResponse.message + '\n');
    if (error.stack) {
      process.stderr.write(error.stack + '\n');
    } else {
      process.stderr.write(
        'No remote error stack to report <https://github.com/marklogic/node-client-api/issues/297>' +
          '\n'
      );
    }
    process.exit(1);
  });
