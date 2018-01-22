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

      const path = filesObj.map(x => x.path);
      const matching = matcher(path, arrify(opts.patterns));

      return filesObj.filter(x => matching.includes(x.path));
    })
    .then(filesObj => {
      if (opts.status.index === optionsManager().status.index) {
        return filesObj;
      }

      const status = filesObj.map(x => x.index);
      const matching = matcher(status, Array.from(opts.status.index));

      return filesObj.filter(x => matching.includes(x.index));
    })
    .then(filesObj => {
      if (opts.status.workingTree === optionsManager().status.workingTree) {
        return filesObj;
      }

      const status = filesObj.map(x => x.workingTree);
      const matching = matcher(status, Array.from(opts.status.workingTree));

      return filesObj.filter(x => matching.includes(x.workingTree));
    });
};
