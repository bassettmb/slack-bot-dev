define(function() {
  var match = function(message)
  {
      return (message.text.toLowerCase().indexOf("calculate") == 0 );
  }

  var calculate = function(message)
  {
      text = message.text;
      return text;
  }

  var exports =
  {
      match: match,
      execute: calculate
  };

  return exports;
});
