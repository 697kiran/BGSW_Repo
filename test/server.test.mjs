import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest } from '../src/server.mjs';

function request(url, method = 'GET') {
  const result = {};
  handleRequest({ url, method }, {
    writeHead(status, headers) {
      Object.assign(result, { status, headers });
      return this;
    },
    end(body) {
      result.body = body;
    },
  });
  return result;
}

test('serves the training page with the three expected advisories', () => {
  const page = request('/');
  assert.equal(page.status, 200);
  const cases = page.body.toString().match(/CVE-\d{4}-\d+/g);
  assert.deepEqual(cases, ['CVE-2024-47764', 'CVE-2022-25883', 'CVE-2021-44906']);
  assert.equal(request('/styles.css').status, 200);
});

test('serves trail data and health information', () => {
  const trails = request('/api/trails');
  assert.equal(trails.status, 200);
  const entries = JSON.parse(trails.body);
  assert.equal(entries.length, 3);
  for (const entry of entries) {
    assert.ok(request('/').body.includes(entry.name));
  }
  assert.deepEqual(JSON.parse(request('/healthz').body), { status: 'ok' });
});

test('permits read-only requests to registered paths', () => {
  assert.equal(request('/package-lock.json').status, 404);
  assert.equal(request('/api/trails', 'POST').status, 405);
  assert.deepEqual(
    [request('/', 'HEAD').status, request('/', 'HEAD').body],
    [200, undefined],
  );
});
