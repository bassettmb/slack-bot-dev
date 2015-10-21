define(['lib/def', 'lib/util'], function(Def, Util) {

  var Message = Def.type(function(client, raw_msg) {
    Util.guard_undef(raw_msg);
    this.def_prop('raw', raw_msg);
    this.def_prop('channel', client.getChannelGroupOrDMByID(raw_msg.channel));
    this.def_prop('user', client.getUserByID(raw_msg.user));
    this.def_prop('text', raw_msg.text);
  });

  Message.def_method(function send_to(name, text, cont) {
    return this.respond('@' + name + ': ' + text, cont);
  });

  Message.def_method(function reply(text, cont) {
    return this.send_to(this.user.name, text, cont);
  });

  Message.def_method(function respond(text, cont) {
    try {
      this.channel.send(text);
    } catch (exn) {
      return cont(exn);
    }
    return cont();
  });

  return Message;

});
