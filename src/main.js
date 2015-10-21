define(function() {

  var Util = require('lib/util');

  var Message = require('message');
  var HandlerAdaptor = require('handler_adaptor');
  var Pipeline = require('message_pipeline');

  var Swears = require('swears');
  var Jokes = require('jokes');
  var JokeSource = require('joke_source');
  var calculator = require('calculator');

  var Slack = require('slack-client');
  var creds = require('credentials/testbot');

  var swears_file = 'share/swears.txt';
  var jokes_file = 'share/jokes.txt';

  function init_pipeline(cont) {
    function with_source(err, source) {
      /* Add handlers here. */
      if (err)
        console.error('failed to initialize joke source');

      return Swears.create_dict(swears_file, function (err, dict) {
        if (err)
          console.error('failed to initialize swears dictionary');

        var pipeline = new Pipeline();
        pipeline.push_back(new Swears(dict));
        pipeline.push_back(new HandlerAdaptor(calculator));
        pipeline.push_back(new Jokes(source));
        return cont(pipeline);
      });
    }
    return JokeSource.from_file(jokes_file, with_source);
  }

  function init_slack(pipeline, cont) {

    var slackToken = creds.api_token;
    var autoReconnect = true; // automatically reconnect on error 
    var autoMark = true; // automatically mark messages as read

    var conn = new Slack(slackToken, autoReconnect, autoMark);

    conn.on('open', function() {
      console.log("Connected to %s as %s", conn.team.name, conn.self.name);
    });

    conn.on('message', function(message) {
      pipeline.on_message(new Message(conn, message), Util.nop);
    });

    conn.on('error', function(err) {
      console.error("%s: error: %s", new Date().toISOString(), err);
    });

    return cont(conn);

  }

  function main() {
    init_pipeline(function(pipeline) {
      return init_slack(pipeline, function(conn) {
        return conn.login();
      });
    });
  }

  return main;

});
