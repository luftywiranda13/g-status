'use strict';

const { homedir } = require('os');

const gStatus = require('../');

describe('error', () => {
  it('throws if if `cwd` is not a git repository', async () => {
    await expect(gStatus({ cwd: homedir() })).rejects.toThrowError(
      'fatal: Not a git repository (or any of the parent directories): .git'
    );
  });
});
