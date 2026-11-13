const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createArticleLoadAttempt, isArticleUrl } = require('../src/features/news/components/articleLoad.ts');

function setup(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const events = [];
  const attempt = createArticleLoadAttempt({
    start: () => events.push('loading'), finish: () => events.push('loaded'), fail: e => events.push(e),
  }, 100);
  return { attempt, events };
}
test('HTTP failure survives late load completion and progress navigation', t => {
  const { attempt, events } = setup(t);
  attempt.start(); attempt.fail('http'); attempt.finish(); attempt.start();
  t.mock.timers.tick(200);
  assert.deepEqual(events, ['loading', 'http']);
});
test('redirects cannot keep the loading screen alive forever', t => {
  const { attempt, events } = setup(t);
  attempt.start(); t.mock.timers.tick(80); attempt.start(); t.mock.timers.tick(20);
  assert.deepEqual(events, ['loading', 'timeout']);
});
test('successful load cancels timeout and allows later navigation', t => {
  const { attempt, events } = setup(t);
  attempt.start(); attempt.finish(); t.mock.timers.tick(200);
  attempt.start(); attempt.finish();
  assert.deepEqual(events, ['loading', 'loaded', 'loading', 'loaded']);
});
test('unmount discards pending events and timeout', t => {
  const { attempt, events } = setup(t);
  attempt.start(); attempt.dispose(); attempt.fail('network'); attempt.finish();
  t.mock.timers.tick(200);
  assert.deepEqual(events, ['loading']);
});
test('renderer termination after success still triggers recovery', t => {
  const { attempt, events } = setup(t);
  attempt.start(); attempt.finish(); attempt.fail('process');
  assert.deepEqual(events, ['loading', 'loaded', 'process']);
});
test('a fresh retry succeeds after a failed attempt', t => {
  const { attempt } = setup(t);
  attempt.start(); attempt.fail('network'); attempt.dispose();
  const events = [];
  const retry = createArticleLoadAttempt({ start: () => events.push('loading'), finish: () => events.push('loaded'), fail: e => events.push(e) }, 100);
  retry.start(); retry.finish(); t.mock.timers.tick(200);
  assert.deepEqual(events, ['loading', 'loaded']);
});
test('only valid web article URLs are accepted', () => {
  for (const url of ['https://example.com/story', 'http://localhost:8080/story']) assert.equal(isArticleUrl(url), true);
  for (const url of ['', '/story', 'not a url', 'javascript:alert(1)', 'file:///etc/passwd']) assert.equal(isArticleUrl(url), false);
});
