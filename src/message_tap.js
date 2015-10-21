define(['lib/def', 'lib/util', 'handler'], function(Def, Util, Handler) {

  function validate_msg(msg) {
    Util.guard_undef(msg.channel);
    Util.guard_undef(msg.user);
    return msg;
  }

  var MessageTap = Def.type(function() {
    /* NB: map is ordered based on when an item was inserted. */
    this.def_prop('front', new Map());
    this.def_prop('back', new Map());
    this.def_mut_prop('next_id', 0);
  });

  MessageTap.def_method(function push_front(listener) {
    var id = this.next_id;
    this.front.set(id, listener);
    this.next_id += 1;
    return id;
  });

  MessageTap.def_method(function push_back(listener) {
    var id = this.next_id;
    this.back.set(id, listener);
    this.next_id += 1;
    return id;
  });

  MessageTap.def_method(function remove(listener_id) {
    if (this.front.has(listener_id)) {
      this.front.remove(listener_id);
      return true;
    }

    if (this.back.has(listener_id)) {
      this.back.remove(listener_id);
      return true;
    }

    return false;
  });

  MessageTap.def_method(function on_message(msg, cont) {

    var self = this;

    if (Util.undef(cont))
      cont = Util.nop;

    try {
      validate_msg(msg);
    } catch (exn) {
      return cont(exn);
    }

    function for_entry(msg, entry, cont) {
      var handler = entry[1];
      return handler.on_message(msg, cont);
    }

    function for_each(queue, cont, done) {
      var it = queue.entries();
      function iterate(msg) {
        if (!msg)
          return done();
        var entry = it.next();
        if (entry.done)
          return cont(msg, done);
        return for_entry(msg, entry.value, iterate);
      }
      return iterate;
    }

    function for_tap() {
      return for_each(self.front, function(msg, cont) {
        return for_each(self.back, cont, cont)(msg);
      }, Util.id)(msg);
    }

    return for_tap();

  });

  return MessageTap;

});
