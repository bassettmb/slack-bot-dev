define(['lib/util'], function(Util) {

  function def_prop(name, value, opts) {
    if (typeof name !== 'string') {
      if (typeof name !== 'function' || !name.name)
        throw new TypeError('property must have a name');
      value = name;
      name = name.name;
    } else if (Util.undef(value)) {
      throw new TypeError('property must have a value');
    }
    if (!opts)
      opts = {};
    opts['value'] = value;
    if (Util.undef(opts.enumerable))
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

  function extend(constructor) {
    var self = this;
    var cons;
    if (Util.undef(constructor))
      cons = (function() { self.constructor.call(this); });
    else
      cons = (function() {
        self.constructor.call(this);
        constructor.apply(this, arguments);
      });
    return def_type(this.prototype, cons);
  }

  function def_type(prototype, constructor) {
    var cons = constructor;
    if (Util.undef(constructor)) {
      if (Util.undef(prototype)) {
        constructor = (function() {});
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
        if (ptype !== 'function' || Util.undef(prototype.prototype))
          throw new TypeError('prototype must be an object or a constructor');
        prototype = prototype.prototype;
      }
    }
    constructor.prototype = Object.create(prototype);
    def_prop.call(constructor.prototype, 'constructor', constructor);
    def_prop.call(constructor, '__super__',
        (prototype && prototype.constructor) || null);

    def_prop.call(constructor, extend);
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

  function def_enum() {
    /* Note: We allow duplicate values in accordance with C semantics. */
    var type = def_type();
    var value = 0;
    var variants = {};
    for (var ix = 0, len = arguments.length; ix < len; ix += 1) {
      var opts = arguments[ix];
      if (!opts) /* null, undefined or empty string */
        throw new TypeError('invalid enum specifier');
      var opts_ty = typeof opts;
      var variant_name;
      if (opts_ty === 'string') {
        variant_name = opts;
      } else if (opts_ty === 'object') {
        if (Util.undef(opts.variant))
          throw new TypeError("enum specifier must provide a 'variant'");
        variant_name = opts.variant;
        if (!Util.undef(opts.value)) {
          if (!Util.is_int(opts.value))
            throw new TypeError("enum specifier value must be an integral");
          value = opts.value;
        }
      }
      if (!Util.undef(variants[variant_name]))
        throw new TypeError("duplicate enum specifier: '" + variant_name + "'");
      var variant_cons = type.extend();
      var variant = new variant_cons();
      variant.def_prop('variant', variant_name);
      variant.def_prop('value', value);
      variants[variant.variant] = Object.freeze(variant);
      value += 1;
    }
    var keys = Object.keys(variants);
    for (var ix = 0, len = keys.length; ix < len; ix += 1) {
      var selector = keys[ix];
      type.def_prop(selector, variants[selector]);
    }
    type.def_method(function show() {
      return this.variant;
    });
    type.def_static_method(function read(str) {
      var variant = variants[str];
      if (Util.undef(variant))
        throw new TypeError("invalid variant: '" + str + "'");
      return variant;
    });
    type.def_method(function to_int() {

      return this.value;
    });
    type.def_method(function toString() {
      return this.show();
    });
    type.def_method(function valueOf() {
      return this.to_int();
    });
    return type;
  }

  function def_variant() {
    var type = def_type();
    var variants = {};
    for (var ix = 0, len = arguments.length; ix < len; ix += 1) {
      var cons = arguments[ix];
      if (Util.undef(cons))
        throw new TypeError('undefined is not a valid variant');
      if (!cons.name)
        throw new TypeError('variants must have names');
      if (!Util.undef(variants[cons.name]))
        throw new TypeError('variant name collision');
      var variant = type.extend(cons);
      variant.def_prop( '_variant', cons.name);
      variant.prototype.def_prop('_variant', cons.name);
      variants[cons.name] = variant;
    }
    var keys = Object.keys(variants);
    for (var ix = 0, len = keys.length; ix < len; ix += 1) {
      var selector = keys[ix];
      type.def_prop(selector, variants[selector]);
    }
    type.def_prop(function match(obj, exprs) {
      if (!(obj instanceof this))
        throw new TypeError('object is not a valid variant');
      if (Util.undef(obj._variant))
        throw new TypeError('malformed variant type');
      var expr = exprs[obj._variant];
      if (Util.undef(exprs[obj._variant])) {
        expr = exprs['_'];
        if (Util.undef(expr))
          throw new TypeError('non-exhaustive match');
      }
      return typeof expr === 'function' ? expr(obj) : expr;
    });
    return type;
  }

  return {
    'method': def_method,
    'enum': def_enum,
    'variant': def_variant,
    'prop': def_prop,
    'static_method': def_static_method,
    'type': def_type
  };

});
