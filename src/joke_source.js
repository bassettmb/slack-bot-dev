define(['lib/def', 'lib/util', 'fs'], function(Def, Util, FS) {

  var JokeSource = Def.type(function(jokes) {
    if (Util.undef(jokes) || !jokes.length)
      jokes = ['No.'];
    this.def_prop('jokes', jokes);
    this.def_prop('length', jokes.length);
  });

  JokeSource.def_method(function next_index() {
    /* bitwise-or with 0 to coerce to int */
    return Math.random() * this.length | 0;
  });

  JokeSource.def_method(function next() {
    return this.jokes[this.next_index()];
  });
    
  /* FIXME: avoid reading the entire thing into memory */

  JokeSource.def_static_method(function from_file(filepath, cont) {
    return FS.readFile(filepath, function(err, contents) {
      return cont(err, new JokeSource(Util.lines(contents.toString())));
    });
  });

  return JokeSource;

});
