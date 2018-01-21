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
      const path = filesObj.map(x => x.path);
      const matching = matcher(path, arrify(opts.patterns));

      return filesObj.filter(x => matching.includes(x.path));
    })
    .then(res => {
      if (opts.status.index !== '*') {
        const status = res.map(x => x.index);
        const matching = matcher(status, Array.from(opts.status.index));

        return res.filter(x => matching.some(m => x.index.includes(m)));
      }

      return res;
    })
    .then(res => {
      if (opts.status.workingTree !== '*') {
        const status = res.map(x => x.workingTree);
        const matching = matcher(status, Array.from(opts.status.workingTree));

        return res.filter(x => matching.some(m => x.workingTree.includes(m)));
      }

      return res;
    });
};
