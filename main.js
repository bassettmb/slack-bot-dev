var Slack = require('slack-client');
// FIXME: Find a portable way to add our project files to NODE_PATH
var creds = require('./credentials/testbot.js');

var slackToken = creds.api_token;
var autoReconnect = true; // automatically reconnect on error 
var autoMark = true; // automatically mark messages as read

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
