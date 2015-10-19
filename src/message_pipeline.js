define(['lib/util', 'message_tap'], function(Util, MessageTap) {
  var undef = Util.undef;
  return function(handlers) {
    var tap = new MessageTap();
    if (!undef(handlers))
      for (var elem of handlers)
        tap.push_back(elem);
    return tap;
  };
});
