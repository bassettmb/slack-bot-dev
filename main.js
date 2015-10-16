var Slack = require('slack-client');
// FIXME: Find a portable way to add our project files to NODE_PATH
var creds = require('./credentials/testbot.js');

var slackToken = creds.api_token;
var autoReconnect = true; // automatically reconnect on error 
var autoMark = true; // automatically mark messages as read

// Add Handlers here
var messageHandler = require('./bin/messageHandler.js');

var slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on('open', function(){
    console.log("Connected to %s as %s", slack.team.name, slack.self.name);
});

slack.on('message', function(message){

    channel = slack.getChannelGroupOrDMByID(message.channel)
    user = slack.getUserByID(message.user)

    channelName = (channel && channel.is_channel)? '#'+channel.name : "UNKNOWN_CHANNEL";
    userName = (user && user.name)? '$'+user.name : "UNKNOWN_USER";

    console.log('> Received message from %s at %s',userName, channelName);

    if(!channel)
    {
        console.error("Channel is undefined.");
    }
    else if(!message.text)
    {
        console.error("Text is undefined.");
    }
    else{
        msg = {
            userName: userName,
            channelName: channelName,
            text: message.text
        }
        response = messageHandler.process(msg);
        channel.send(response);
        console.log("< %s responded with %s",slack.self.name, response);
    }
});

slack.on('error', function(err){
    console.error("%s: error: %s", new Date().toISOString(), err);
});

slack.login();
