module.exports = (function() {
  var def = require('../lib/def');
  var Handler = def.type();
  Handler.def_method(function on_message(ev) { return ev; });
  return Handler;
})(); 
