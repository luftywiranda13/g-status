'use strict';

const matcher = require('matcher');

module.exports = (obj, patterns, prop) => {
  const status = obj.map(x => x[prop]);
  const matched = matcher(status, Array.from(patterns));

  return obj.filter(x => matched.includes(x[prop]));
};
