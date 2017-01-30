'use strict';
xdmp.securityAssert(['http://github.com/jmakeig/mltap/runner'], 'execute');
console.log('mltap: Bootstrapping with ' + tests.length + ' main modules');
require('/mltap/harness')(tests, root, 0, accept);
