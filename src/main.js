define(function() {

  var Util = require('lib/util');

  var Message = require('message');
  var HandlerAdaptor = require('handler_adaptor');
  var Pipeline = require('message_pipeline');

  var Jokes = require('jokes');
  var calculator = require('calculator');

  var Slack = require('slack-client');
  var creds = require('credentials/testbot');

  var nop = Util.nop;

  function init_slack() {

    var slackToken = creds.api_token;
    var autoReconnect = true; // automatically reconnect on error 
    var autoMark = true; // automatically mark messages as read
    var pipeline = new Pipeline([new HandlerAdaptor(calculator), new Jokes]);

    var conn = new Slack(slackToken, autoReconnect, autoMark);

    conn.on('open', function() {
      console.log("Connected to %s as %s", conn.team.name, conn.self.name);
    });

    conn.on('message', function(message) {
      pipeline.on_message(new Message(conn, message), nop);
    });

    conn.on('error', function(err) {
      console.error("%s: error: %s", new Date().toISOString(), err);
    });

    return conn;
  }

  function main() {
    init_slack().login();
  }

  return main;

});
