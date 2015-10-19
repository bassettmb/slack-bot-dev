define(['lib/def', 'handler'], function(Def, Handler) {

  var Jokes = Def.type(Handler, function() {
    Handler.call(this);
  });

  Jokes.def_method(function match(msg) {
    return /[tT]ell a joke/.test(msg);
  });

  Jokes.def_method(function on_message(msg, cont) {
    return this.match(msg.text) ? msg.reply('No.', cont) : cont();
  });

  return Jokes;

});
