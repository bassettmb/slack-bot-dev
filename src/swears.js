define(['lib/util', 'fs'], function(Util, FS) {

    var swearsFile = 'share/swears.txt';

    var swearsArray = Util.lines(FS.readFileSync(swearsFile).toString().toLowerCase());

    var swearsMap = {};
    for (var i = 0; i < swearsArray.length; i++) {
        swearsMap[swearsArray[i]] = true;
    }

    var match = function (msg) {
        var text = msg.text.toLowerCase();
        var words = text.split(/\s+/g);
        for (var i = 0; i < words.length; i++) {
            if (swearsMap[words[i]]) {
                return true;
            }
        }
        return false;
    };

    var censor = function (msg) {
        var result = msg.text;
        var text = msg.text.toLowerCase();
        var words = text.split(/\s+/g);
        for (var i = 0; i < words.length; i++) {
            if (swearsMap[words[i]]) {
                var blocked = words[i].replace(/./g, '*');
                result.replace(new RegExp(words[i], 'i'), blocked);
            }
        }
        return result;
    };

    return {
        match: match,
        execute: censor
    };

});