var Slack = require('slack-client');
// FIXME: Find a portable way to add our project files to NODE_PATH
var creds = require('./credentials/testbot.js');

var slackToken = creds.api_token;
var autoReconnect = true; // Automatically reconnect after an error response from Slack.
var autoMark = true; // Automatically mark each message as read after it is processed.

var slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on('open', function(){
    console.log("Connected to %s %s", slack.team.name, slack.self.name);
});

slack.on('message', function(message){
    console.log("%s: %s", new Date().toISOString(), message);
});

slack.on('error', function(err){
    console.error("%s: error: %s", new Date().toISOString(), err);
});

slack.login();
