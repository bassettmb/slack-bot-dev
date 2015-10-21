define(['lib/def', 'lib/util'], function(Def, Util) {

  var Handler = Def.type();

  Handler.def_method(function on_message(ev, cont) {
    return Util.undef(cont) ? Util.id(ev) : cont(ev);
  });

  return Handler;

}); 
