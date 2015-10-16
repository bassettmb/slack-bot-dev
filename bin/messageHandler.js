// Add logic here to analyze messgaes and direct them to corresponding handlers

// Features
var calculator = require('./calculator.js');

var features = [calculator];

function process (message)
{
    for(var i in features)
    {
        if(features[i].match(message)) return features[i].execute(message);
    }
    return "Pardon? I don't understand what you just said.";
}

module.exports =
{
    process : process
}
