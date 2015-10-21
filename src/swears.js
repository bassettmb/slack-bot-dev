define(['lib/def', 'lib/util', 'handler', 'fs'], function(Def, Util, Handler, FS) {

    var REPLY_PREFIX = "That is not appropriate language for a workplace! One should say '";
    var REPLY_POSTFIX = "' instead!";

    var createDict = function (filename) {
        var swearsArray = Util.lines(FS.readFileSync(filename).toString().toLowerCase());
        var swearsMap = {};
        for (var i = 0; i < swearsArray.length; i++) {
            swearsMap[swearsArray[i]] = true;
        }
        return swearsMap;
    };

    var Swears = Def.type(Handler, function(filename) {
        this.constructor.__super__.call(this);
        this.def_prop('dict', createDict(filename));
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
                censoredText = censoredText.replace(new RegExp(word, 'i'), censor);
            }
        }

        if (match) {
            censoredText = REPLY_PREFIX + censoredText + REPLY_POSTFIX;
            msg.reply(censoredText, cont);
        } else {
            cont(msg)
        }
    });

    return Swears;

});
