'use strict';

const arrify = require('arrify');
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

module.exports = options => {
  const opts = optionsManager(options);

  return git(opts.cwd)
    .status()
    .then(summary => {
      return summary.files.map(x => ({
        path: x.path,
        index: x.index,
        workingTree: x.working_dir,
      }));
    })
    .then(filesObj => {
      if (opts.patterns !== '*') {
        const path = filesObj.map(x => x.path);
        const matching = matcher(path, arrify(opts.patterns));

        return filesObj.filter(x => matching.includes(x.path));
      }

      return filesObj;
    })
    .then(filesObj => {
      if (opts.status.index !== '*') {
        const status = filesObj.map(x => x.index);
        const matching = matcher(status, Array.from(opts.status.index));

        return filesObj.filter(x => matching.includes(x.index));
      }

      return filesObj;
    })
    .then(filesObj => {
      if (opts.status.workingTree !== '*') {
        const status = filesObj.map(x => x.workingTree);
        const matching = matcher(status, Array.from(opts.status.workingTree));

        return filesObj.filter(x => matching.includes(x.workingTree));
      }

      return filesObj;
    });
};
