// Add logic here to analyze messgaes and direct them to corresponding handlers

// Features

module.exports = (function() {

  var util = require('./util');
  var def = require('./def');
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

    var type = def.type(function() {
      var def_prop = def.prop.bind(this);
      def_prop('front', new Map());
      def_prop('back', new Map());
      def.mut_prop.call(this, 'next_id', 0);
    });

    def_method(type, function push_front(listener) {
      var id = this.next_id;
      this.front.set(id, listener);
      this.next_id += 1;
      return id;
    });

    def_method(type, function push_back(listener) {
      var id = this.next_id;
      this.back.set(id, listener);
      this.next_id += 1;
      return id;
    });

    def_method(type, function remove(listener_id) {
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

    def_method(type, function on_message(msg) {
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

    return type;

  })();
})();
