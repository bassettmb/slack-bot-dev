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
  var Config = require('config');
  var Creds = require('credentials/testbot');

  function init_pipeline(cont) {
    function with_source(err, source) {
      if (err)
        console.error('failed to initialize joke source');

      return Swears.create_dict(Config.Swears.filepath, function (err, dict) {
        if (err)
          console.error('failed to initialize swears dictionary');

        var pipeline = new Pipeline();
        pipeline.push_back(new Swears(dict));
        pipeline.push_back(new HandlerAdaptor(calculator));
        pipeline.push_back(new Jokes(source));
        return cont(pipeline);
      });
    }
    return JokeSource.from_file(Config.Jokes.filepath, with_source);
  }

  function init_slack(pipeline, cont) {

    var slackToken = Creds.api_token;
    var autoReconnect = true; // automatically reconnect on error 
    var autoMark = true; // automatically mark messages as read

    var conn = new Slack(slackToken, autoReconnect, autoMark);

    conn.on('open', function() {
      console.log("Connected to %s as %s", conn.team.name, conn.self.name);
    });

    conn.on('message', function(message) {
      if (message.user && message.channel && message.text) {
        pipeline.on_message(new Message(conn, message), Util.nop);
      }
    });

    conn.on('error', function(err) {
      var d = new Date();
      console.error(JSON.stringify({
        'timestamp': d.toISOString(),
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
