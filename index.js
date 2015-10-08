var Slack = require('slack-client');

var slackToken = 'xoxb-12146415603-Ed63RLooAVPojuati2xI959e' // Add a bot at https://my.slack.com/services/new/bot and copy the token here.
var autoReconnect = true // Automatically reconnect after an error response from Slack.
var autoMark = true // Automatically mark each message as read after it is processed.

var slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on('open', function(){
    console.log("Connected to"+slack.team.name + slack.self.name);
});

slack.on('message', function(message){
    console.log(message);
});

slack.on('error', function(err){
    console.error("Error", err);
});

slack.login();