module.exports = (function() {
  var def = require('./lib/def');
  var Handler = require('./handler');
  var HandlerAdaptor = def.type(Handler, function(handler) {
    this.def_prop('handler', handler);
  });
  HandlerAdaptor.def_method(function on_message(msg) {
    if (!this.handler.match(msg))
      return msg;
    msg.respond(this.handler.execute(msg));
    return null;
  });
  return HandlerAdaptor;
})();

