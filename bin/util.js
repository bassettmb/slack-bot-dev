module.exports = (function() {

  function undef(obj) {
    return obj === void 0;
  }

  function def_or_else(obj, guard) {
    if (undef(obj))
      obj = guard;
    return obj;
  }

  function id(obj) {
    return obj;
  }

  function nop() {}

  function is_arraylike(obj) {
    return !undef(obj) && !undef(obj.length);
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

  return {
    'undef': undef,
    'guard_undef': guard_undef,
    'is_arraylike': is_arraylike,
    'id': id,
    'nop': nop,
    'append': append,
    'drop': drop,
    'take': take,
    'lines': lines,
    'unlines': unlines
  };

})();
