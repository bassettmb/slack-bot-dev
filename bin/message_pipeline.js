module.exports = (function() {
  var MessageTap = require('./message_tap');
  var util = require('./util');
  var undef = util.undef;
  return function(handlers) {
    var tap = new MessageTap();
    if (!undef(handlers))
      for (var elem of handlers)
        tap.push_back(elem);
    return tap;
  };
})();

