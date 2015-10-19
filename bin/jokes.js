module.exports = (function() {

  var def = require('./def');
  var Handler = require('./Handler');

  var Jokes = def.type();

  Jokes.def_method(function match(msg) {
    return /[tT]ell a joke/.test(msg);
  });

  Jokes.def_method(function execute(msg) {
    if (this.match(msg.text))
      msg.reply('No.');
  });

  return Jokes;

}());
