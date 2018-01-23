'use strict';

const filterer = require('../filterer');

const data = [
  { path: '.travis.yml', index: ' ', workingTree: 'D' },
  { path: '.travis.yml', index: 'A', workingTree: ' ' },
  { path: 'index.js', index: 'A', workingTree: ' ' },
  { path: 'package.json', index: 'A', workingTree: 'M' },
  { path: 'readme.md', index: ' ', workingTree: 'D' },
  { path: 'readme.md', index: 'A', workingTree: ' ' },
  { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
  { path: 'filterer.js', index: '?', workingTree: '?' },
];

describe('filterer', () => {
  test('path', () => {
    expect(filterer(data, ['*'], 'path')).toEqual(data);

    expect(
      filterer(data, ['!*.js', '!*.json', '!*.md', '!*.yml'], 'path')
    ).toEqual([]);

    expect(filterer(data, ['*.js'], 'path')).toEqual([
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
      { path: 'filterer.js', index: '?', workingTree: '?' },
    ]);

    expect(filterer(data, ['*.js', '!*.test.js'], 'path')).toEqual([
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'filterer.js', index: '?', workingTree: '?' },
    ]);

    expect(filterer(data, ['!*.js'], 'path')).toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
    ]);
  });

  test('index', () => {
    expect(filterer(data, '*', 'index')).toEqual(data);

    expect(filterer(data, ' ', 'index')).toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
    ]);

    expect(filterer(data, 'A', 'index')).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
    ]);

    expect(filterer(data, 'M', 'index')).toEqual([]);

    expect(filterer(data, 'R', 'index')).toEqual([
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);

    expect(filterer(data, 'AM', 'index')).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
    ]);

    expect(filterer(data, ' AMR', 'index')).toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);
  });

  test('workingTree', () => {
    expect(filterer(data, '*', 'workingTree')).toEqual(data);

    expect(filterer(data, ' ', 'workingTree')).toEqual([
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'A', workingTree: ' ' },
      { path: 'readme.md', index: 'A', workingTree: ' ' },
      { path: 'test.js -> index.test.js', index: 'R', workingTree: ' ' },
    ]);

    expect(filterer(data, 'A', 'workingTree')).toEqual([]);

    expect(filterer(data, 'M', 'workingTree')).toEqual([
      { path: 'package.json', index: 'A', workingTree: 'M' },
    ]);

    expect(filterer(data, 'D', 'workingTree')).toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
    ]);

    expect(filterer(data, 'R', 'workingTree')).toEqual([]);

    expect(filterer(data, 'AM', 'workingTree')).toEqual([
      { path: 'package.json', index: 'A', workingTree: 'M' },
    ]);

    expect(filterer(data, 'AMRD', 'workingTree')).toEqual([
      { path: '.travis.yml', index: ' ', workingTree: 'D' },
      { path: 'package.json', index: 'A', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'D' },
    ]);
  });
});
