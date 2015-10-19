module.exports = (function() {
  var def = require('./def');
  return def.type().def_method(function on_message(ev) { return ev; });
})(); 
