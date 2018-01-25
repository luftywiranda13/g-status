'use strict';

const arrify = require('arrify');
const git = require('simple-git/promise');
const matcher = require('matcher');

const optionsManager = options => {
  const DEFAULTS = {
    path: '*',
    index: '*',
    workingTree: '*',
  };

  const merged = Object.assign({}, DEFAULTS, options);

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

const isMatch = (data, patterns) => {
  if (patterns.toString() === '*') {
    return true;
  }

  return matcher([data], patterns).length >= 1;
};

module.exports = (cwd = process.cwd(), options) => {
  if (typeof cwd === 'object') {
    options = cwd;
    cwd = process.cwd;
  }

  const opts = optionsManager(options);

  return getFiles(cwd).then(files => {
    const filteredFiles = files
      .map(({ path, index, working_dir: workingTree }) => ({
        path,
        index,
        workingTree,
      }))
      .filter(x => isMatch(x.path, opts.path))
      .filter(x => isMatch(x.index, opts.index))
      .filter(x => isMatch(x.workingTree, opts.workingTree));

    return filteredFiles;
  });
};
