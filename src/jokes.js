define(['lib/def', 'handler'], function(Def, Handler) {

  var Jokes = Def.type(Handler, function(source) {
    this.constructor.__super__.call(this);
    this.def_prop('source', source);
  });

  Jokes.def_method(function next() {
    return this.source.next();
  });

  Jokes.def_method(function match(msg) {
    return /[tT]ell a joke/.test(msg);
  });

  Jokes.def_method(function on_message(msg, cont) {
    return this.match(msg.text) ? msg.reply(this.next(), cont) : cont();
  });

  return Jokes;

});
