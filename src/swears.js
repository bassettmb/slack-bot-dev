define(['lib/def', 'lib/util', 'handler', 'fs'], function(Def, Util, Handler, FS) {

    var REPLY_PREFIX = "That is not appropriate language for a workplace! One should say '";
    var REPLY_POSTFIX = "' instead!";

    var Swears = Def.type(Handler, function(dict) {
        if (!dict)
            dict = {};
        this.constructor.__super__.call(this);
        this.def_prop('dict', dict);
    });

    Swears.def_method(function on_message(msg, cont) {
        var censoredText = msg.text;
        var words = msg.text.toLowerCase().split(/\s+/g);

        var matched = false;
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (this.dict[word]) {
                matched = true;
                var censor = word.replace(/./g, '*');
                censoredText = censoredText.replace(new RegExp('\\b' + word + '\\b', 'i'), censor);
            }
        }

        if (matched) {
            censoredText = REPLY_PREFIX + censoredText + REPLY_POSTFIX;
            msg.reply(censoredText, cont);
        } else {
            cont(msg)
        }
    });

    Swears.def_static_method(function create_dict(filepath, cont) {
        return FS.readFile(filepath, function(err, contents) {
            var swearsArray = Util.lines(contents.toString().toLowerCase());
            var swearsMap = {};
            for (var i = 0; i < swearsArray.length; i++) {
                swearsMap[swearsArray[i]] = true;
            }
            return cont(err, swearsMap);
        });
    });

    return Swears;

});
