'use strict';

const arrify = require('arrify');
const git = require('simple-git/promise');
const matcher = require('matcher');

const getFiles = cwd => {
  return git(cwd)
    .silent(true)
    .status()
    .then(({ files }) => files);
};

const isMatch = patterns => obj => {
  return Object.keys(obj).every(key => {
    if (patterns[key].toString() === '*') {
      return true;
    }

    // `matcher()` is used instead of `matcher.isMatch()`
    // because `matcher()` accepts patterns in array format.

    // If nothing's matched, `matcher()` returns an empty array.
    return matcher(Array.of(obj[key]), patterns[key]).length >= 1;
  });
};

module.exports = ({
  cwd = process.cwd(),
  path = '*',
  index = '*',
  workingTree = '*',
} = {}) => {
  const patterns = {
    path: arrify(path),
    index: [...index],
    workingTree: [...workingTree],
  };

  return getFiles(cwd)
    .then(files => {
      return files.map(({ path, index, working_dir: workingTree }) => ({
        path,
        index,
        workingTree,
      }));
    })
    .then(files => files.filter(isMatch(patterns)));
};
