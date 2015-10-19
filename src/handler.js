define(['lib/def', 'lib/util'], function(Def, Util) {

  var undef = Util.undef;
  var id = Util.id;

  var Handler = Def.type();

  Handler.def_method(function on_message(ev, cont) {
    return undef(cont) ? id(ev) : cont(ev);
  });

  return Handler;

}); 
