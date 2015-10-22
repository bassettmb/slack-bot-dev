define(function() {
    var match = function(message)
    {
        if(!message.text) return false;
        text = message.text.replace(/\s+/g, '').toLowerCase();
        return (text.indexOf("calculate") === 0 );
    }

    var execute = function(message)
    {
        text = message.text.replace(/\s+/g, '');
        formula = text.substr(9);

        response = parse(formula);

        if(response.ending === formula.length && response.result) return cutPrecision(response.result);
        return response.error || "Oops... there are extra bracket / parentheses!";
    }

    function isDigit(c)
    {
        return c>='0' && c<='9';
    }

    function readDigits(formula)
    {
        var matchBracket = {
            '(':')',
            '[':']',
            '{':'}'
        }
        if(formula[0] === '-')
        {
            var res = readDigits(formula.substr(1));
            if(res.parseLen === 0 || res.error) return res;
            if(res.startsWith === '-') return {error:" Consecutive minus signs are not allowed."};
            return {
                parseLen: res.parseLen+1,
                startsWith: '-',
                number: 0 - res.number
            };
        }
        else if(formula[0] in matchBracket)
        {
            var res = parse(formula.substr(1));
            if( res.ending+1 < formula.length && formula[res.ending+1] === matchBracket[formula[0]])
            {
                return {
                    parseLen: res.ending+2,
                    startsWith: formula[0],
                    number: res.result
                };
            }
            else
            {
                return {
                    parseLen: 0,
                    error: " Failed to find matchting bracket for " + formula[0]
                };
            }
        }
        else
        {
            var i = 0;
            var num = 0;
            while(i<formula.length && isDigit(formula[i]))
            {
                num = num * 10 + (formula[i]-'0');
                ++i;
            }
            if(i<formula.length && formula[i]==='.')
            {
                var radix = 0.1;
                ++i;
                while(i<formula.length && isDigit(formula[i]))
                {
                    num = num + radix * (formula[i]-'0');
                    radix /= 10;
                    ++i;
                }
            }
            return {
                parseLen: i,
                startsWith: formula[0],
                number: num
            };
        }
    }

    function parse(formula)
    {
        var i = 0;
        var numbers = [];
        var operators = [];
        var result = {};

        while(i < formula.length)
        {
            // Read a number
            var number = readDigits(formula.substr(i));

            if(number.parseLen === 0 || number.error)
            {
                result.ending = i;
                result.error = "Parsing formula failed at location "+ i + (number.error || "");
                return result;
            }

            numbers.push(number.number);
            i+=number.parseLen;

            // Read an operator

            if(i === formula.length || formula[i]==')' || formula[i]=='}' || formula[i]==']')
            {
                result.ending = i;
                result.result = calculate(numbers, operators);
                return result;
            }

            if("+-*/^".indexOf(formula[i]) != -1)
            {
                operators.push(formula[i]);
                ++i;
            }
            else if(formula[i] === '(')
            {
                operators.push('*');
            }
            else
            {
                result.ending = i;
                result.error = "Parsing failed because of unknown operator " + formula[i] +  " at location "+i;
                return result;
            }

        }

    }

    function whoIsFirst(operators)
    {
        var priority = ['^','*/','+-'];
        for(var p = 0; p<priority.length;++p)
            for(var i = 0; i<operators.length; ++i)
                if(priority[p].indexOf(operators[i]) != -1) return i;
        return 0;
    }

    function calculate(numbers, operators)
    {
        while(operators.length > 0)
        {
            var i = whoIsFirst(operators);
            switch(operators[i])
            {
                case '*':
                    numbers[i] *= numbers[i+1];
                    break;
                case '/':
                    numbers[i] /= numbers[i+1];
                    break;
                case '+':
                    numbers[i] += numbers[i+1];
                    break;
                case '-':
                    numbers[i] -= numbers[i+1];
                    break;
                case '^':
                    numbers[i] = Math.pow(numbers[i],numbers[i+1]);
                    break;
            }
            operators.splice(i,1);
            numbers.splice(i+1,1);
        }
        return numbers[0];
    }

    function countDecimals (number)
    {
        if(Math.floor(number) === number) return 0;
        return number.toString().split(".")[1].length || 0; 
    }

    function cutPrecision(num)
    {
        if(countDecimals(num) > 6) return parseFloat(num.toFixed(6));
        return num;
    }

    var exports =
    {
        match: match,
        execute: execute
    };

    return exports;
});
