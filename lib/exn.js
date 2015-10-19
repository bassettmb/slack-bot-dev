module.exports = (function() {

  var def = require('./def');
  var util = require('./util');

  var append = util.append;
  var drop = util.drop;
  var lines = util.lines;
  var unlines = util.unlines;
  var undef = util.undef;

  var Exn = (function() {
    function render_msg(exn) {
      var msg = exn.name;
      if (exn.message)
        msg = msg + ': ' + exn.message;
      var error = new Error();
      var backtrace;
      if (undef(error.stack)) {
        backtrace = [msg, '[backtrace unavailable]'];
      } else {
        backtrace = [msg];
        append(backtrace, drop(4, lines((new Error()).stack)));
      }
      return unlines(backtrace);
    }

    var type = def.type(function() {
      def.prop.call(this, 'stack', render_msg(this));
    });
    def.prop.call(type.prototype, 'name', 'Exn');
    def.method(type, function toString() {
      return this.stack;
    });

    return type;

  })();

  function def_exn(constructor) {

    if (undef(constructor))
      throw new TypeError('constructor is required');

    if (typeof constructor === 'string') {
      var type = def.type(Exn, function() { Exn.apply(this, arguments); });
      def.prop.call(type.prototype, 'name', constructor);
      return type;
    }

    if (typeof constructor !== 'function' || !constructor.name)
      throw new TypeError('constructor must be a named function or a string');

    var name = constructor.name;
    var type = def.type(Exn, constructor);
    def.prop.call(type, 'name', name);
    return type;
  }

  function drop_frames(count, backtrace) {
    guard_undef(count);
    guard_undef(backtrace);
    if (count === 0)
      return backtrace;
    var trace = [backtrace[0]];
    append(trace, backtrace

  var type = def_exn('kljsdljkf');
  console.log((new type).toString());
  throw new type();

  /*
  var TestExn = def_exn(function Test(){});
  var exn = new TestExn();
  console.log(exn.stack);
  */

  /*
  return {
    'def': def_exn,
    'type': Exn,
  };
  */

})();
