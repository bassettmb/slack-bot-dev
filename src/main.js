define(function() {

  var Util = require('lib/util');

  var Message = require('message');
  var HandlerAdaptor = require('handler_adaptor');
  var Pipeline = require('message_pipeline');

  var Jokes = require('jokes');
  var JokeSource = require('joke_source');
  var calculator = require('calculator');

  var Slack = require('slack-client');
  var creds = require('credentials/testbot');

  var jokes_file = 'share/jokes.txt';

  function init_pipeline(cont) {
    function with_source(err, source) {
      /* Add handlers here. */
      if (err)
        console.error('failed to initialize joke source');
      var pipeline = new Pipeline();
      pipeline.push_back(new HandlerAdaptor(calculator));
      pipeline.push_back(new Jokes(source));
      return cont(pipeline);
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
      console.error(JSON.stringify({
        'timestamp': Date.now().toISOString(),
        'error': {
          'code': err.code,
          'message': err.msg,
        }
      }));
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
