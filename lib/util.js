define(function() {

  function undef(obj) {
    return obj === void 0;
  }

  function guard_undef(obj, field) {
    function throw_error(msg) {
      var err = new TypeError(msg);
      var trace = lines(err.stack);
      var backtrace = [trace[0]];
      append(backtrace, drop(3, trace));
      err.stack = unlines(backtrace);
      throw err;
    }
    if (undef(obj))
      throw_error('undefined object');
    if (undef(field))
      return obj;
    if (typeof field !== 'string')
      throw_error('field selector must be a string');
    if (undef(obj[field]))
      throw_error('undefined field: ' + field);
    return obj;
  }

  function is_arraylike(obj) {
    return !undef(obj) && !undef(obj.length);
  }

  function is_int(obj) {
    return typeof obj === 'number' && (obj | 0) === obj;
  }

  function id(obj) {
    return obj;
  }

  function nop() {}

  function enter(fn) {
    return fn();
  }

  function thunk(fn) {
    return (function() { return fn; });
  }

  function each(obj, fn) {

    if (undef(obj))
      throw new TypeError('each: no object provided');
    if (undef(fn))
      throw new TypeError('each: no function provided');

    if (obj[Symbol.iterator])
      for (var elem of obj)
        fn(elem, ix, obj);
    else if (typeof obj === 'object')
      for (var key of Object.keys(obj))
        fn(obj[key], key, obj);
    else
      throw new TypeError('each: object is not iterable');

  }

  function map(obj, fn) {

    if (undef(obj))
      throw new TypeError('map: no object provided');
    if (undef(fn))
      throw new TypeError('map: no function provided');

    if (obj[Symbol.iterator]) {
      var res = [];
      for (var elem of obj)
        res.push(fn(elem));
      return res;
    }
    
    if (typeof obj === 'object') {
      var res = {};
      for (var key of Object.keys(obj))
        res[key] = fn(obj[key]);
      return res;
    }

    throw new TypeError('map: object is not iterable');
  }

  function filter(obj, fn) {

    if (undef(obj))
      throw new TypeError('filter: no object provided');
    if (undef(fn))
      throw new TypeError('filter: no function provided');

    if (obj[Symbol.iterator]) {
      var res = [];
      for (var elem of obj)
        if (fn(elem))
          res.push(elem);
      return res;
    } else if (typeof obj === 'object') {
      var res = {};
      for (var key of Object.keys(obj)) {
        var elem = obj[key]
        if (fn(elem))
          res[key] = elem;
      }
      return res;
    }

    throw new TypeError('filter: object is not iterable');
  }

  function foldl(obj, init, fn) {

    if (undef(obj))
      throw new TypeError('foldl: collection required');
    if (undef(obj[Symbol.iterator]))
      throw new TypeError('foldl: object must be iterable');
    if (undef(init) ||
        undef(fn) && typeof init !== 'function' ||
        typeof fn !== 'function')
      throw new TypeError('foldl: no function provided');

    var values = obj[Symbol.iterator]();
    var entry;

    if (undef(fn)) {
      entry = values.next();
      if (entry.done)
        throw new TypeError('foldl: no initial value provided for empty list');
      fn = init;
      init = entry.value;
    }

    entry = values.next();
    while (!entry.done) {
      init = fn(init, entry.value);
      entry = values.next();
    }

    return init;
  }

  function iterate(obj) {
    var values = obj[Symbol.iterator];
    if (undef(values))
      throw new TypeError('iterate: obj is not iterable');
    return values();
  }

  function collect(iterator) {
    var accum = [];
    for (;;) {
      var entry = iterator.next();
      if (entry.done)
        break;
      accum.push(entry.value);
    }
    return accum;
  }

  function append(dst, src, begin, count) {
    if (!is_arraylike(dst))
      throw new TypeError('dst must be an arraylike object');
    if (!is_arraylike(src))
      throw new TypeError('src must be an arraylike object');
    if (undef(begin))
      begin = 0;
    if (undef(count))

    var src_ix = 0;
    var dst_ix = dst.length;
    var len = src.length;
    if (!undef(count) && len > count)
      len = count;
    for (; src_ix < len; dst_ix += 1, src_ix += 1)
      dst[dst_ix] = src[src_ix];
    return dst;
  }

  function drop(count, array) {
    var res = [];
    for (var ix = count, len = array.length | 0; ix < len; ix += 1)
      res.push(array[ix]);
    return res;
  }

  function take(count, array) {
    var res = [];
    var len = (array.length | 0) < count ? array.length | 0 : count;
    for (var ix = 0; ix < len; ix += 1)
      res.push(array[ix]);
    return res;
  }

  function lines(str) {

    if (typeof str !== 'string' && !(str instanceof String))
      throw new TypeError('string required');

    var len = str.length | 0;
    var res = [];

    var begin = 0;
    var end = begin;

    for (;;) {
      if (str[end] === '\n') {
        res.push(str.substring(begin, end));
        end += 1;
        if (end === len)
          break;
        begin = end;
      } else if (str[end] === '\r') {
        if (end + 1 === len) {
          res.push(str.substring(begin, end + 1));
          break;
        }
        if (str[end + 1] === '\n') {
          res.push(str.substring(begin, end));
          end += 2;
          if (end === len)
            break;
          begin = end;
        }
      } else {
        end += 1;
        if (end === len) {
          res.push(str.substring(begin, end));
          break;
        }
      }
    }
    return res;
  }

  function unlines(array, delimiter) {
    var len = array.length | 0;
    if (len <= 0)
      return '';
    if (undef(delimiter))
      delimiter = '\n';
    var accum = array[0].toString();
    for (var ix = 1; ix < len; ix += 1)
      accum = accum + delimiter + array[ix].toString();
    return accum;
  }

  return {
    'undef': undef,
    'guard_undef': guard_undef,
    'is_arraylike': is_arraylike,
    'is_int': is_int,
    'id': id,
    'nop': nop,
    'enter': enter,
    'thunk': thunk,
    'each': each,
    'map': map,
    'filter': filter,
    'foldl': foldl,
    'iterate': iterate,
    'collect': collect,
    'append': append,
    'drop': drop,
    'take': take,
    'lines': lines,
    'unlines': unlines
  };

});
