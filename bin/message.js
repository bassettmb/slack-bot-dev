module.exports = (function() {

  var def = require('./def');
  var util = require('./util');

  var guard_undef = util.guard_undef;

  var Message = def.type(function(raw_msg) {
    guard_undef(raw_msg);
    this.def_prop('raw', raw_msg);
    this.def_prop('channel', slack.getChannelGroupOrDMByID(raw_msg.channel));
    this.def_prop('user', slack.getUserByID(raw_msg.user));
    this.def_prop('text', raw_msg.text);
  });

  Message.def_method(function send_to(name, text) {
    return this.respond('@' + name + ': ' + text);
  });

  Message.def_method(function reply(text) {
    return this.send_to(this.raw_msg.user.name, text);
  });

  Message.def_method(function respond(text) {
    this.channel.send(text);
  });

  return Message;

})();
