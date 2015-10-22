/* configuration required to bootstrap main or tests */
var requirejs = require('requirejs');

requirejs.config({
  'nodeRequire': require,
  'baseUrl': './src',
  'paths': {
    'lib': '../lib',
    'credentials': '../credentials'
  }
});

module.exports = requirejs;
