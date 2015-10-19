// FIXME: Find a portable way to add our project files to NODE_PATH

var Message = require('./src/message');
var HandlerAdaptor = require('./src/handler_adaptor');
var Pipeline = require('./src/message_pipeline');

var Jokes = require('./src/jokes');
var calculator = require('./src/calculator');

var Slack = require('slack-client');
var creds = require('./credentials/testbot');

function init_slack() {
  var slackToken = creds.api_token;
  var autoReconnect = true; // automatically reconnect on error 
  var autoMark = true; // automatically mark messages as read
  return new Slack(slackToken, autoReconnect, autoMark);
}

function config_evs(slack) {
  var pipeline = new Pipeline([new HandlerAdaptor(calculator), new Jokes]);

  slack.on('open', function() {
      console.log("Connected to %s as %s", slack.team.name, slack.self.name);
  });

  slack.on('message', function(message) {
    pipeline.on_message(new Message(slack, message));
  });

  slack.on('error', function(err){
      console.error("%s: error: %s", new Date().toISOString(), err);
  });

  return slack;
}

var conn = init_slack();
config_evs(conn);
conn.login();
