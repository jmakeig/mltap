'use strict';
const test = require('tape');
const parseTAP = require('../lib/tap-helpers').parseTAP;

test('inline', assert => {
  const module = `'use strict';
    var test = require('/mltap/test');
    var tap = require('/mltap/lib/tap');
    tap((
      test('One', function(assert) {
        assert.plan(1);
        assert.equal(null, null, 'null gonna null');
      }),
      test('Two', function(assert) {
        assert.plan(2);
        assert.true(true, 'Nothing more true than true');
        assert.deepEqual({a: 'A', b: 'B'}, {b: 'B', a: 'A'}, 'Key order');
      }),
      test('Three', function(assert) {
        assert.equal(2 + 2, 5, 'Two and two is not five');
        assert.end();
      })
    ).run());
`;
  const marklogic = require('marklogic'); // eslint-disable-line global-require

  const conn = {
    host: 'localhost',
    // TODO: Parameterize me
    port: '8000',
    // TODO: Parameterize me
    user: 'admin',
    // TODO: Parameterize me
    password: 'admin',
    // TODO: Parameterize me
    authType: 'digest'
  };
  const client = marklogic.createDatabaseClient(conn);

  assert.plan(6);
  client
    .eval(module)
    .result()
    .then(response => parseTAP(response[0].value))
    .then(tap => {
      assert.ok(tap, 'TAP parsed');
      assert.false(tap.ok, 'Suite failed');
      assert.equal(tap.count, 4, 'Total tests');
      assert.equal(tap.pass, 3, 'Passing count');
      assert.equal(tap.failures.length, 1, 'One failure');
      const fail = tap.failures[0].diag;
      assert.true(
        fail.operator && fail.expected && fail.actual && fail.at,
        'Has fail components'
      );
    })
    .catch(assert.end);
});
