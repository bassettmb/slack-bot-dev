define(['lib/def', 'handler'], function(Def, Handler) {

  var Jokes = Def.type(Handler, function(source) {
    this.constructor.__super__.call(this);
    this.def_prop('source', source);
  });

  Jokes.def_method(function next() {
    return this.source.next();
  });

  Jokes.def_method(function match(msg, botName) {
    var regex = new RegExp('^Hey ' + botName + '-Tell me a joke', 'i');
    return regex.test(msg);
  });

  Jokes.def_method(function on_message(msg, cont) {
    return this.match(msg.text, msg.botName) ? msg.reply(this.next(), cont) : cont(msg);
  });

  return Jokes;

});
