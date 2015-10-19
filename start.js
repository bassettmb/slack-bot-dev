var requirejs = require('requirejs');

requirejs.config({
  'nodeRequire': require,
  'baseUrl': './src',
  'paths': {
    'lib': '../lib',
    'credentials': '../credentials'
  }
});

requirejs(['main'], function(main) {
  main();
});
