define(['lib/util', 'message_tap'], function(Util, MessageTap) {
  return function(handlers) {
    var tap = new MessageTap();
    if (!Util.undef(handlers))
      for (var elem of handlers)
        tap.push_back(elem);
    return tap;
  };
});
