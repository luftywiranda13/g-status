'use strict';

const isEqual = require('lodash.isequal');
const matcher = require('matcher');

module.exports = (data, patterns, prop) => {
  // NOTE:
  // * Array.from('MADRC ') => [ 'M', 'A', 'D', 'R', 'C', ' ' ]
  // * Array.from(['MADRC ']) => ['MADRC ']
  patterns = Array.isArray(patterns) ? patterns : Array.from(patterns);

  if (isEqual(patterns, ['*'])) {
    return data;
  }

  const props = data.map(x => x[prop]);
  const matched = matcher(props, patterns);

  return data.filter(x => matched.includes(x[prop]));
};
