module.exports = (function() {

  var def = require('./def');
  var Handler = require('./handler');

  var Jokes = def.type(Handler, function() {
    Handler.call(this);
  });

  Jokes.def_method(function match(msg) {
    return /[tT]ell a joke/.test(msg);
  });

  Jokes.def_method(function on_message(msg) {
    if (this.match(msg.text))
      msg.reply('No.');
  });

  return Jokes;

}());
