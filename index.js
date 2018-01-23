'use strict';

const arrify = require('arrify');
const git = require('simple-git/promise');
const mergeOptions = require('merge-options');

const filterer = require('./filterer');

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

module.exports = options => {
  const opts = optionsManager(options);

  return git(opts.cwd)
    .status()
    .then(summary =>
      summary.files.map(x => {
        const { path, index, working_dir: workingTree } = x;

        return { path, index, workingTree };
      })
    )
    .then(filesObj => {
      if (opts.patterns === optionsManager().patterns) {
        return filesObj;
      }

      return filterer(filesObj, arrify(opts.patterns), 'path');
    })
    .then(filesObj => {
      if (opts.status.index === optionsManager().status.index) {
        return filesObj;
      }

      return filterer(filesObj, opts.status.index, 'index');
    })
    .then(filesObj => {
      if (opts.status.workingTree === optionsManager().status.workingTree) {
        return filesObj;
      }

      return filterer(filesObj, opts.status.workingTree, 'workingTree');
    });
};
