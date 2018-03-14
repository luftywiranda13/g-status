'use strict';

jest.mock('simple-git/promise');
const git = require('simple-git/promise');

const gStatus = require('./');

const dummySummary = [
  { path: '.travis.yml', index: ' ', working_dir: 'D' },
  { path: '.travis.yml', index: 'A', working_dir: ' ' },
  { path: 'index.js', index: 'A', working_dir: ' ' },
  { path: 'package.json', index: 'A', working_dir: 'M' },
  { path: 'readme.md', index: ' ', working_dir: 'D' },
  { path: 'readme.md', index: 'A', working_dir: ' ' },
  { path: 'test.js -> index.test.js', index: 'R', working_dir: ' ' },
  { path: 'filterer.js', index: '?', working_dir: '?' },
];

const mockGit = files => {
  git.mockReturnValue({
    silent: () => ({
      status: jest.fn(() => Promise.resolve({ files })),
    }),
  });
};

test('examples in `readme`', () => {
  mockGit([
    { path: '.travis.yml', index: 'A', working_dir: ' ' },
    { path: 'index.js', index: 'M', working_dir: 'M' },
    { path: 'readme.md', index: ' ', working_dir: 'M' },
  ]);

  gStatus().then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'M' },
    ]);
  });

  gStatus({ path: ['!*.js', '!*.md'] }).then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
    ]);
  });

  gStatus({ index: 'MA' }).then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
    ]);
  });

  gStatus({ workingTree: ' ' }).then(res => {
    expect(res).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
    ]);
  });

  gStatus({ index: 'M', workingTree: 'M' }).then(res => {
    expect(res).toEqual([{ path: 'index.js', index: 'M', workingTree: 'M' }]);
  });
});

it('returns empty array in clean repo', async () => {
  mockGit([]);

  expect(await gStatus()).toEqual([]);
});

it('filters `path`', async () => {
  mockGit(dummySummary);

  expect(await gStatus({ path: '*' })).toEqual([
    { path: '.travis.yml', index: ' ', workingTree: 'D' },
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'package.json', index: 'A', workingTree: 'M' },
    { path: 'readme.md', index: ' ', workingTree: 'D' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    { path: 'filterer.js', index: '?', workingTree: '?' },
  ]);

  expect(await gStatus({ path: '*.js' })).toEqual([
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    { path: 'filterer.js', index: '?', workingTree: '?' },
  ]);

  expect(await gStatus({ path: '!*' })).toEqual([]);
});

it('filters `index`', async () => {
  mockGit(dummySummary);

  expect(await gStatus({ index: '*' })).toEqual([
    { path: '.travis.yml', index: ' ', workingTree: 'D' },
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'package.json', index: 'A', workingTree: 'M' },
    { path: 'readme.md', index: ' ', workingTree: 'D' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    { path: 'filterer.js', index: '?', workingTree: '?' },
  ]);

  expect(await gStatus({ index: 'A' })).toEqual([
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'package.json', index: 'A', workingTree: 'M' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
  ]);

  expect(await gStatus({ index: 'R' })).toEqual([
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
  ]);

  expect(await gStatus({ index: 'AR ' })).toEqual([
    { path: '.travis.yml', index: ' ', workingTree: 'D' },
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'package.json', index: 'A', workingTree: 'M' },
    { path: 'readme.md', index: ' ', workingTree: 'D' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
  ]);
});

it('filters `workingTree`', async () => {
  mockGit(dummySummary);

  expect(await gStatus({ workingTree: '*' })).toEqual([
    { path: '.travis.yml', index: ' ', workingTree: 'D' },
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'package.json', index: 'A', workingTree: 'M' },
    { path: 'readme.md', index: ' ', workingTree: 'D' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    { path: 'filterer.js', index: '?', workingTree: '?' },
  ]);

  expect(await gStatus({ workingTree: 'A' })).toEqual([]);

  expect(await gStatus({ workingTree: 'AR ' })).toEqual([
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
  ]);
});

it('knows fully staged files', async () => {
  mockGit(dummySummary);

  expect(await gStatus({ index: 'AMDR ', workingTree: ' ' })).toEqual([
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'index.js', index: 'A', workingTree: ' ' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
    { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
  ]);

  expect(
    await gStatus({ path: '!*.js', index: 'AMDR ', workingTree: ' ' })
  ).toEqual([
    { path: '.travis.yml', index: 'A', workingTree: ' ' },
    { path: 'readme.md', index: 'A', workingTree: ' ' },
  ]);
});

it('knows partially staged files', async () => {
  mockGit(dummySummary);

  expect(await gStatus({ index: 'DRAM', workingTree: 'AMDR' })).toEqual([
    { path: 'package.json', index: 'A', workingTree: 'M' },
  ]);
});

it('knows untracked files', async () => {
  mockGit(dummySummary);

  expect(await gStatus({ index: '?', workingTree: '?' })).toEqual([
    { path: 'filterer.js', index: '?', workingTree: '?' },
  ]);
});
