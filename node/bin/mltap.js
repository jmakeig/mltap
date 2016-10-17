#! /usr/bin/env node

const doc =
`
Tape-like JavaScript test runner for MarkLogic.

Usage:
  mltap <test>...
  mltap <test>... --output <file>
  mltap <test>... --stdout
  mltap --help

Options:
  <test>                         A list of tests, usually a glob
  -o <file>, --output <file>     Send output to a file
  --stdout                       Send to standard out
  -h, --help                     Help
`;

const opts = require('docopt').docopt(doc);

// TODO: Parameterize me
const conn = {
  host:     'localhost',
  port:     '8000',
  user:     'tester',
  password: 'tester', 
  authType: 'digest',
}

const remote = require('../marklogic-remote')(conn);

remote(opts['<test>'], process.cwd())
  //.then(tap => process.stdout.write(tap + '\n'))
  .then(tap => process.stdout.write(tap + '\n'))
  .catch(error => { 
    // console.dir(error);
    if('SEC-PRIV' === error.body.errorResponse.messageCode) {
      process.stderr.write('Are you sure you configured the security settings? ');
      process.stderr.write('mltap requires roles, amps, and privileges.\n');
      process.stderr.write('\nFrom where you downloaded mltap, run:\n');
      process.stderr.write('    gradle mlDeploy\n');
    }
    process.stderr.write(error.body.errorResponse.message + '\n') ;
    if(error.stack) {
      process.stderr.write(error.stack + '\n');
    } else {
      process.stderr.write('No remote error stack to report <https://github.com/marklogic/node-client-api/issues/297>' + '\n');
    }
    process.exit(1); 
  });
