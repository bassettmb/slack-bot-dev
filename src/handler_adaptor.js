define(['lib/def', 'handler'], function(Def, Handler) {
  var HandlerAdaptor = Def.type(Handler, function(handler) {
    Handler.call(this);
    this.def_prop('handler', handler);
  });
  HandlerAdaptor.def_method(function on_message(msg) {
    if (!this.handler.match(msg))
      return msg;
    msg.respond(this.handler.execute(msg));
    return null;
  });
  return HandlerAdaptor;
});
