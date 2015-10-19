define(function() {

  var Message = require('message');
  var HandlerAdaptor = require('handler_adaptor');
  var Pipeline = require('message_pipeline');

  var Jokes = require('jokes');
  var calculator = require('calculator');

  var Slack = require('slack-client');
  var creds = require('credentials/testbot');

  function init_slack() {
    var slackToken = creds.api_token;
    var autoReconnect = true; // automatically reconnect on error 
    var autoMark = true; // automatically mark messages as read
    return new Slack(slackToken, autoReconnect, autoMark);
  }

  function config_evs(conn) {
    var pipeline = new Pipeline([new HandlerAdaptor(calculator), new Jokes]);
    conn.on('open', function() {
        console.log("Connected to %s as %s", conn.team.name, conn.self.name);
    });
    conn.on('message', function(message) {
      pipeline.on_message(new Message(conn, message));
    });
    conn.on('error', function(err){
        console.error("%s: error: %s", new Date().toISOString(), err);
    });
    return conn;
  }

  function main() {
    var conn = init_slack();
    config_evs(conn);
    conn.login();
  }

  return main;

});
