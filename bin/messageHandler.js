// Add logic here to analyze messgaes and direct them to corresponding handlers

// Features
var calculator = require('./calculator.js');

var executor = [calculator];

function validate (message)
{

}

function process (message)
{
	//var direct = validate(message);
	//var response = executor[direct].execute(message);
	return "Received";
}

module.exports =
{
	process : process
}