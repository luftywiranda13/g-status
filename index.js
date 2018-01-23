'use strict';

const git = require('simple-git/promise');
const matcher = require('matcher');
const mergeOptions = require('merge-options');

const optionsManager = options => {
  const DEFAULTS = {
    cwd: process.cwd(),
    patterns: '*',
    status: {
      index: '*',
      workingTree: '*',
    },
  };

  return mergeOptions(DEFAULTS, options);
};

const getSummary = options => {
  return git(options.cwd)
    .silent(true)
    .status();
};

const isMatch = (data, patterns) => {
  patterns = Array.isArray(patterns) ? patterns : Array.from(patterns);

  return matcher([data], patterns).length >= 1;
};

module.exports = options => {
  const opts = optionsManager(options);

  return getSummary(opts).then(({ files }) => {
    return files
      .map(({ path, index, working_dir: workingTree }) => ({
        path,
        index,
        workingTree,
      }))
      .filter(x => isMatch(x.path, opts.patterns))
      .filter(x => isMatch(x.index, opts.status.index))
      .filter(x => isMatch(x.workingTree, opts.status.workingTree));
  });
};
