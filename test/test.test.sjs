const test = require('/mltap/test');

test('Arrays are iterable', (assert) => {
  assert.true(true);
  assert.true(!false);
  assert.end();
});

test('Strings are iterable (unfortunately)', (assert) => {
  assert.plan(2);
  assert.true('asdf'.length === 4, 'String');
  assert.true('asdfs'.length === 5, 'String');
});
