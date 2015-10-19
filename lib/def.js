define(['lib/util'], function(Util) {

  var undef = Util.undef;

  function def_prop(name, value, opts) {
    if (typeof name !== 'string') {
      if (typeof name !== 'function' || !name.name)
        throw new TypeError('property must have a name');
      value = name;
      name = name.name;
    } else if (undef(value)) {
      throw new TypeError('property must have a value');
    }
    if (!opts)
      opts = {};
    opts['value'] = value;
    if (undef(opts.enumerable))
      opts.enumerable = true;
    Object.defineProperty(this, name, opts);
    return this;
  }

  function def_mut_prop(name, value) {
    return def_prop.call(this, name, value, { 'writable': true });
  }

  function def_hidden_prop(name, value) {
    return def_prop.call(this, name, value, { 'enumerable': false });
  }

  function def_method(obj, name, value) {
    def_static_method(obj.prototype, name, value);
    return obj;
  }

  function def_static_method(obj, name, value) {
    return def_prop.call(obj, name, value);
  }

  function def_type(prototype, constructor) {

    if (undef(constructor)) {
      if (undef(prototype)) {
        constructor = function() {}
        prototype = null;
      } else {
        var ptype = typeof prototype;
        if (ptype === 'function') {
          constructor = prototype;
          prototype = null;
        } else if (ptype === 'object') {
          constructor = (function() {
            prototype.apply(this, arguments);
          });
        } else {
          throw new TypeError('constructor must be a function');
        }
      }
    } else {
      var ctype = typeof constructor;
      if (ctype !== 'function')
        throw new TypeError('constructor must be a function');
      var ptype = typeof prototype;
      if (ptype !== 'object') {
        if (ptype !== 'function' || undef(prototype.prototype))
          throw new TypeError('prototype must be an object or a constructor');
        prototype = prototype.prototype;
      }
    }

    constructor.prototype = Object.create(prototype);
    def_prop.call(constructor.prototype, 'constructor', constructor);

    def_method(constructor, 'def_prop', function(name, value) {
      return def_prop.call(this, name, value);
    });

    def_method(constructor, 'def_mut_prop', function(name, value) {
      return def_mut_prop.call(this, name, value);
    });

    def_method(constructor, 'def_enum_prop', function(name, value) {
      return def_enum_prop.call(this, name, value);
    });

    def_static_method(constructor, 'def_prop', function(name, value) {
      return def_prop.call(constructor, name, value);
    });

    def_static_method(constructor, 'def_mut_prop', function(name, value) {
      return def_mut_prop.call(this, name, value);
    });

    def_static_method(constructor, 'def_enum_prop', function(name, value) {
      return def_enum_prop.call(this, name, value);
    });

    def_static_method(constructor, 'def_method', function(name, fn) {
      return def_method(this, name, fn);
    });

    def_static_method(constructor, 'def_static_method', function(name, fn) {
      return def_static_method(this, name, fn);
    });

    return constructor;
  }

  function def_variant() {
    var type = def_type();
    var variants = {};
    for (var ix = 0, len = arguments.length; ix < len; ix += 1) {
      var cons = arguments[ix];
      if (undef(cons))
        throw new TypeError('undefined is not a valid variant');
      if (!cons.name)
        throw new TypeError('variants must have names');
      if (!undef(variants[cons.name]))
        throw new TypeError('variant name collision');
      var variant = def_type(type.prototype, cons);
      def_prop.call(variant, '_variant', cons.name);
      def_prop.call(variant.prototype, '_variant', cons.name);
      variants[cons.name] = variant;
    }
    var keys = Object.keys(variants);
    for (var ix = 0, len = keys.length; ix < len; ix += 1) {
      var selector = keys[ix];
      def_prop.call(type, selector, variants[selector]);
    }
    def_prop.call(type, function match(obj, exprs) {
      if (!(obj instanceof this))
        throw new TypeError('object is not a valid variant');
      if (undef(obj._variant))
        throw new TypeError('malformed variant type');
      var expr = exprs[obj._variant];
      if (undef(exprs[obj._variant])) {
        expr = exprs['_'];
        if (undef(expr))
          throw new TypeError('non-exhaustive match');
      }
      return typeof expr === 'function' ? expr.call(obj) : expr;
    });
    return type;
  }

  return {
    'method': def_method,
    'variant': def_variant,
    'prop': def_prop,
    'static_method': def_static_method,
    'type': def_type
  };

});
