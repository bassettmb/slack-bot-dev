// Add logic here to analyze messgaes and direct them to corresponding handlers

// Features

module.exports = (function() {

  var def = require('../lib/def');
  var util = require('../lib/util');
  var Handler = require('./handler');

  var nop = util.nop;
  var undef = util.undef;
  var guard_undef = util.guard_undef;

  function validate_msg(msg) {
    guard_undef(msg.channel);
    guard_undef(msg.user);
    return msg;
  }

  return (function() {

    var MessageTap = def.type(function() {
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

    MessageTap.def_method(function on_message(msg) {
      validate_msg(msg);
      function with_queue(queue) {
        for (var entry of queue.entries()) {
          var handler = entry[1];
          msg = handler.on_message(msg);
          if (!msg)
            break;
        }
        return msg;
      }
      with_queue(this.front) && with_queue(this.back);
      return msg;
    });

    return MessageTap;

  })();
})();
