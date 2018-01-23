'use strict';

jest.mock('simple-git/promise');
const git = require('simple-git/promise');

const gStatus = require('./');

const dummyFiles = [
  { path: '.travis.yml', index: ' ', working_dir: 'D' },
  { path: '.travis.yml', index: 'A', working_dir: ' ' },
  { path: 'index.js', index: 'A', working_dir: ' ' },
  { path: 'package.json', index: 'A', working_dir: 'M' },
  { path: 'readme.md', index: ' ', working_dir: 'D' },
  { path: 'readme.md', index: 'A', working_dir: ' ' },
  { path: 'test.js -> index.test.js', index: 'R', working_dir: ' ' },
  { path: 'filterer.js', index: '?', working_dir: '?' },
];

const mockGit = files =>
  git.mockReturnValue({
    silent: () => ({
      status: jest.fn(() => {
        return Promise.resolve({ files });
      }),
    }),
  });

test('examples in `readme`', () => {
  mockGit([
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'M', workingTree: 'M' },
    { path: 'readme.md', index: ' ', workingTree: 'M' },
  ]);

  gStatus().then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'M' },
    ]);
  });

  gStatus({ patterns: ['!*.js', '!*.md'] }).then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
    ]);
  });

  gStatus({ status: { index: 'MA' } }).then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
    ]);
  });

  gStatus({ status: { workingTree: ' ' } }).then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
    ]);
  });

  gStatus({ status: { index: 'M', workingTree: 'M' } }).then(res => {
    expect(res).toEqual([{ path: 'index.js', index: 'M', workingTree: 'M' }]);
  });
});

it('returns empty array in clean repo', async () => {
  mockGit([]);
  await expect(gStatus()).resolves.toEqual([]);
});

describe('dirty repo', () => {
  beforeAll(() => {
    mockGit(dummyFiles);
  });

  it('respects `patterns` for path', async () => {
    await expect(gStatus({ patterns: '*' })).resolves.toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
      { path: 'filterer.js', index: '?', workingTree: '?' },
    ]);

    await expect(gStatus({ patterns: '*.js' })).resolves.toEqual([
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
      { path: 'filterer.js', index: '?', workingTree: '?' },
    ]);

    await expect(gStatus({ patterns: '!*' })).resolves.toEqual([]);
  });

  it('respects `status` for `index`', async () => {
    await expect(gStatus({ status: { index: '*' } })).resolves.toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
      { path: 'filterer.js', index: '?', workingTree: '?' },
    ]);

    await expect(gStatus({ status: { index: 'A' } })).resolves.toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
    ]);

    await expect(gStatus({ status: { index: 'R' } })).resolves.toEqual([
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);

    await expect(gStatus({ status: { index: 'AR ' } })).resolves.toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);
  });

  it('respects `status` for `workingTree`', async () => {
    await expect(gStatus({ status: { workingTree: '*' } })).resolves.toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
      { path: 'filterer.js', index: '?', workingTree: '?' },
    ]);

    await expect(gStatus({ status: { workingTree: 'A' } })).resolves.toEqual(
      []
    );

    await expect(gStatus({ status: { workingTree: 'AR ' } })).resolves.toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);
  });

  it('knows fully staged files', async () => {
    await expect(
      gStatus({ status: { index: 'AMDR ', workingTree: ' ' } })
    ).resolves.toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);

    await expect(
      gStatus({
        patterns: '!*.js',
        status: { index: 'AMDR ', workingTree: ' ' },
      })
    ).resolves.toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
    ]);
  });

  it('knows partially staged files', async () => {
    await expect(
      gStatus({ status: { index: 'DRAM', workingTree: 'AMDR' } })
    ).resolves.toEqual([
      { path: 'package.json', index: 'A', workingTree: 'M' },
    ]);
  });

  it('knows untracked files', async () => {
    await expect(
      gStatus({ status: { index: '?', workingTree: '?' } })
    ).resolves.toEqual([{ path: 'filterer.js', index: '?', workingTree: '?' }]);
  });
});
