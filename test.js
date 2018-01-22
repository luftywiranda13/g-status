'use strict';

const { join } = require('path');
const { outputFileSync } = require('fs-extra');
const execa = require('execa');
const fixtures = require('fixturez');

const gStatus = require('./');

const f = fixtures(__dirname);

describe('clean repo', () => {
  let tmpPath;

  beforeEach(() => {
    tmpPath = f.copy('dummy-repo');

    execa.sync('git', ['init'], { cwd: tmpPath });
    execa.sync('git', ['add', '--all'], { cwd: tmpPath });
    execa.sync('git', ['commit', '-m', 'initial commit'], { cwd: tmpPath });
  });

  test('bare', async () => {
    expect.assertions(1);

    await expect(gStatus({ cwd: tmpPath })).resolves.toEqual([]);
  });
});

describe('dirty repo', () => {
  let tmpPath;

  beforeEach(() => {
    tmpPath = f.copy('dummy-repo');

    execa.sync('git', ['init'], { cwd: tmpPath });
    execa.sync('git', ['add', 'index.js', 'readme.md'], { cwd: tmpPath });
    execa.sync('git', ['commit', '-m', 'initial commit'], { cwd: tmpPath });

    execa.sync('git', ['add', '.travis.yml'], { cwd: tmpPath });

    outputFileSync(join(tmpPath, 'readme.md'), 'foo');
    outputFileSync(join(tmpPath, 'index.js'), 'foo');
    execa.sync('git', ['add', 'index.js'], { cwd: tmpPath });

    outputFileSync(join(tmpPath, 'index.js'), 'bar');
  });

  test('bare', async () => {
    expect.assertions(1);

    await expect(gStatus({ cwd: tmpPath })).resolves.toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'M' },
    ]);
  });

  test('patterns', async () => {
    expect.assertions(1);

    await expect(
      gStatus({ cwd: tmpPath, patterns: ['!*.js', '!*.md'] })
    ).resolves.toEqual([{ path: '.travis.yml', index: 'A', workingTree: ' ' }]);
  });

  test('status', async () => {
    expect.assertions(3);

    await expect(
      gStatus({ cwd: tmpPath, status: { index: 'MA' } })
    ).resolves.toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
    ]);

    await expect(
      gStatus({ cwd: tmpPath, status: { workingTree: ' ' } })
    ).resolves.toEqual([{ path: '.travis.yml', index: 'A', workingTree: ' ' }]);

    await expect(
      gStatus({ cwd: tmpPath, status: { index: 'M', workingTree: 'M' } })
    ).resolves.toEqual([{ path: 'index.js', index: 'M', workingTree: 'M' }]);
  });
});
