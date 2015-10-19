define(['lib/def', 'handler'], function(Def, Handler) {

  var HandlerAdaptor = Def.type(Handler, function(handler) {
    this.constructor.__super__.call(this);
    this.def_prop('handler', handler);
  });

  HandlerAdaptor.def_method(function on_message(msg, cont) {
    if (this.handler.match(msg))
      return msg.respond(this.handler.execute(msg), cont);
    return cont(msg);
  });

  return HandlerAdaptor;

});
