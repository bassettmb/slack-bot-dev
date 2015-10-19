module.exports = (function() {

  var def = require('./def');
  var util = require('./util');

  var guard_undef = util.guard_undef;

  var Message = def.type(function(raw_msg) {
    guard_undef(raw_msg);
    var def_prop = def.prop.bind(this);
    def_prop('raw', raw_msg);
    def_prop('channel', slack.getChannelGroupOrDMByID(raw_msg.channel));
    def_prop('user', slack.getUserByID(raw_msg.user));
    def_prop('text', raw_msg.text);
  });

  def.method(Message, function send_to(name, text) {
    return this.respond('@' + name + ': ' + text);
  });

  def.method(Message, function reply(text) {
    return this.send_to(this.raw_msg.user.name, text);
  });

  def.method(type, function respond(text) {
    this.channel.send(text);
  });

  return type;

})();
