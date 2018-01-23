'use strict';

const matcher = require('matcher');

module.exports = (data, patterns, prop) => {
  const status = data.map(x => x[prop]);
  const matched = matcher(status, Array.from(patterns));

  return data.filter(x => matched.includes(x[prop]));
};
