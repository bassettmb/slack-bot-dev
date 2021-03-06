var should = require('should');

var requirejs = require('../load');

describe('calculator',function(){

    var calculator;
    before(function(done) {
        requirejs(['calculator'], function(cal) {
            calculator = cal;
            done(); // We can launch the tests!
        });
    });

    describe('.match()',function(){

        it('should guard against message missing text and botName fields',function(){
            missingTextMessage={notext:"", botName:"b"};
            missingBotMessage={text:"a", nobotName:""};
            calculator.match(missingTextMessage).should.be.false();
            calculator.match(missingBotMessage).should.be.false();
        });

        it('should only match message whose text starts with hey botname-calculate', function(){
            incorrectMessage={text:"hey b-calculator", botName:"b"};
            incorrectMessage2={text:"hey b2-calculate", botName:"b"};
            incorrectMessage3={text:"hi b-calculate", botName:"b"};
            correctMessage={text:"hey b-calculate", botName:"b"};
            
            calculator.match(incorrectMessage).should.be.false();
            calculator.match(incorrectMessage2).should.be.false();
            calculator.match(incorrectMessage3).should.be.false();
            calculator.match(correctMessage).should.be.true();
        });

        it('should match those texts regardless of upper / lower case', function(){
            message1={text:"Hey b-Calculate", botName:"b"};
            message2={text:"hEY B-calcuLATE", botName:"b"};

            calculator.match(message1).should.be.true();
            calculator.match(message2).should.be.true();
        });

        it('should match those texts ignoring spaces', function(){
            message1={text:"Hey  b   -     Calculate", botName:"b"};

            calculator.match(message1).should.be.true();
        });
        
    });

    describe('execute',function(){

        it('should be able to directly output number', function(){
            texts = ["123.456","-1",".1234"];
            answer = [123.456, -1, 0.1234];

            for(var i = 0 ;i<texts.length;++i)
            {
                msg = {text:"hey b-calculate "+texts[i], botName:"b"};
                calculator.execute(msg).should.be.equal(answer[i]);
            }
            
        });

        it('should be able to compute simple arithmetics', function(){
            texts = ["1+2-3+5","1*3*5/2-7","0.123*200 - 1", "2^3" , "2^2^2"];
            answer = [5, 0.5, 23.6, 8,16];

            for(var i = 0 ;i<texts.length;++i)
            {
                msg = {text:"hey b-calculate "+texts[i], botName:"b"};
                calculator.execute(msg).should.be.equal(answer[i]);
            }       
        });

        it('should follow the priorities', function(){
            texts = ["1*2-3*5","3/1*5-7*10","0.123*200 - 1*100"];
            answer = [-13,-55,-75.4];

            for(var i = 0 ;i<texts.length;++i)
            {
                msg = {text:"hey b-calculate "+texts[i], botName:"b"};
                calculator.execute(msg).should.be.equal(answer[i]);
            }       
        });

        it('should be able to handle parentheses / brackets / braces', function(){
            texts = ["1*(2-3)*5","300/10/(1+2)","[1+2]","-1*{2+[3*(4+5)]}"];
            answer = [-5,10,3,-29];

            for(var i = 0 ;i<texts.length;++i)
            {
                msg = {text:"hey b-calculate "+texts[i], botName:"b"};
                calculator.execute(msg).should.be.equal(answer[i]);
            }   
        });

        it('should be able to detect mismatched parentheses / brackets / braces', function(){
            texts = ["1*(2-3))*5","300/10/[(1+2)","(1+2]","-1*{2+[3*(4+5)]]"];

            for(var i = 0 ;i<texts.length;++i)
            {
                msg = {text:"hey b-calculate "+texts[i], botName:"b"};
                if (i === 0) {
                    calculator.execute(msg).should.be.equal("Oops... there are extra bracket / parentheses!");
                } else {
                    calculator.execute(msg).should.match(/Failed to find matchting bracket/);
                }
            }   
        });

    });

});
