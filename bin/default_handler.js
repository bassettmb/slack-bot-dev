module.exports = (function() {

  var def = require('./def');
  var Handler = require('./handler');

  var error_msg = "Pardon? I don't understand what you just said.";

  var DefaultHandler = def.type(Handler);
  DefaultHandler.def_method(function on_message(msg) {
    msg.reply(error_msg);
  });

  return DefaultHandler;
})();

