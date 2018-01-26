'use strict';

const arrify = require('arrify');
const git = require('simple-git/promise');
const matcher = require('matcher');

const patternsManager = patterns => {
  const DEFAULTS = {
    path: '*',
    index: '*',
    workingTree: '*',
  };

  const merged = Object.assign({}, DEFAULTS, patterns);

  return Object.assign(
    {},
    {
      path: arrify(merged.path),
      index: Array.from(merged.index),
      workingTree: Array.from(merged.workingTree),
    }
  );
};

const getFiles = cwd => {
  return git(cwd)
    .silent(true)
    .status()
    .then(({ files }) => files);
};

const isMatch = (obj, patterns) => {
  return Object.keys(obj).every(key => {
    if (patterns[key].toString() === '*') {
      return true;
    }

    return matcher(Array.of(obj[key]), patterns[key]).length >= 1;
  });
};

module.exports = (cwd = process.cwd(), patterns) => {
  if (typeof cwd === 'object') {
    patterns = cwd;
    cwd = process.cwd();
  }

  patterns = patternsManager(patterns);

  return getFiles(cwd)
    .then(files => {
      return files.map(file => ({
        path: file.path,
        index: file.index,
        workingTree: file.working_dir,
      }));
    })
    .then(files => files.filter(x => isMatch(x, patterns)));
};
