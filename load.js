/* configuration required to bootstrap main or tests */
var requirejs = require('requirejs');

requirejs.config({
  'nodeRequire': require,
  'baseUrl': './src',
  'paths': {
    'config': '../config',
    'credentials': '../credentials',
    'lib': '../lib',
    'test': '../test',
  }
});

module.exports = requirejs;
