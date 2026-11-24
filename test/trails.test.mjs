import assert from 'node:assert/strict';
import test from 'node:test';
import { run } from '../src/trails.mjs';

test('lists trails by default', () => {
  const result = run([]);
  assert.equal(result.status, 0);
  assert.match(result.text, /lake-loop  Lake Loop/);
  assert.match(result.text, /granite-pass  Granite Pass/);
});

test('shows the distance and difficulty of a selected trail', () => {
  assert.deepEqual(run(['show', 'cedar-ridge']), {
    status: 0,
    text: 'Cedar Ridge — 6.2 km (moderate)',
  });
});

test('distinguishes missing trails from invalid usage', () => {
  assert.equal(run(['show', 'missing']).status, 1);
  assert.equal(run(['show']).status, 2);
});
