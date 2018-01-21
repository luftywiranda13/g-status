# g-status

[![Greenkeeper badge](https://badges.greenkeeper.io/luftywiranda13/g-status.svg)](https://greenkeeper.io/)

> Get the change between index (or staging-area) and working directory of a `git` repository

[![Package Version](https://img.shields.io/npm/v/g-status.svg?style=flat-square)](https://www.npmjs.com/package/g-status)
[![Downloads Status](https://img.shields.io/npm/dm/g-status.svg?style=flat-square)](https://npm-stat.com/charts.html?package=g-status&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/luftywiranda13/g-status/master.svg?style=flat-square)](https://travis-ci.org/luftywiranda13/g-status)
[![Coverage Status](https://img.shields.io/codecov/c/github/luftywiranda13/g-status/master.svg?style=flat-square)](https://codecov.io/gh/luftywiranda13/g-status)

Think of `git status` or `git status --porcelain`, but returns a _ready-to-consume_ result.

## Why

* Actively maintained
* Accepts simple [wildcard matching](https://github.com/sindresorhus/matcher)
* Promise API
* Ability to filter with status codes, see [Status option](#status)
* Knows which files are partially/fully-staged

## Installation

```sh
npm install g-status
```

## Usage

```sh
$ git status --porcelain

A  .travis.yml  # fully-staged
MM index.js     # partially-staged
 M readme.md    # unstaged
```

```js
const gStatus = require('g-status');

gStatus().then(res => {
  console.log(res);
  /*
    [
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
      { path: 'readme.md', index: ' ', workingTree: 'M' }
    ]
  */
});

gStatus({ patterns: ['!*.js', '!*.md'] }).then(res => {
  console.log(res);
  //=> [{ path: '.travis.yml', index: 'A', workingTree: ' ' }]
});

// To get the list of files marked as `Modified` or `Added` in the staging area,
gStatus({ status: { index: 'MA' } }).then(res => {
  console.log(res);
  /*
    [
      { path: '.travis.yml', index: 'A', workingTree: ' ' },
      { path: 'index.js', index: 'M', workingTree: 'M' },
    ]
  */
});

// To get the list of files that arenʼt changed in the working tree
gStatus({ status: { workingTree: ' ' } }).then(res => {
  console.log(res);
  //=> [{ path: '.travis.yml', index: 'A', workingTree: ' ' }]
});
```

## API

### gStatus([options])

Returns `Promise<Array>` of `Object` with `path`, `index`, and `workingTree` as the key.

#### options

Type: `Object`

##### cwd

Type: `string`<br />
Default: `process.cwd()`

Current working directory.

##### patterns

Type: `string` | `string[]`<br />
Default: `*`

Case-insensitive. Use `*` to match zero or more characters. A pattern starting with `!` will be negated.

##### status

Type: `Object`

See [Short Format](https://git-scm.com/docs/git-status#_short_format) for more informations about `git` status codes.

One difference is that `*` will match all value here.

###### index

Type: `string`<br />
Default: `*` (all)

String of `git` status codes of the index/staging-area.

###### workingTree

Type: `string`<br />
Default: `*` (all)

String of `git` status codes of the working tree.

## Related

* [simple-git](https://github.com/steveukx/git-js) – Simple git interface for Node.js
* [staged-git-files](https://github.com/mcwhittemore/staged-git-files) – Abandoned, the latest commit was 3 years ago

## License

MIT &copy; [Lufty Wiranda](https://www.luftywiranda.com)
