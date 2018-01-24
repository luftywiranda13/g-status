'use strict';

const arrify = require('arrify');
const extend = require('extend');
const git = require('simple-git/promise');
const matcher = require('matcher');

const optionsManager = (options = {}) => {
  const DEFAULTS = {
    cwd: process.cwd(),
    patterns: '*',
    status: {
      index: '*',
      workingTree: '*',
    },
  };

  return extend(true, DEFAULTS, options);
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

  patterns = Array.isArray(patterns) ? patterns : Array.from(patterns);

  return matcher([data], patterns).length >= 1;
};

module.exports = options => {
  const opts = optionsManager(options);

  return getFiles(opts.cwd).then(files => {
    const filteredFiles = files
      .map(({ path, index, working_dir: workingTree }) => ({
        path,
        index,
        workingTree,
      }))
      .filter(x => isMatch(x.path, arrify(opts.patterns)))
      .filter(x => isMatch(x.index, opts.status.index))
      .filter(x => isMatch(x.workingTree, opts.status.workingTree));

    return filteredFiles;
  });
};
