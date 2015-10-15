var should = require('should');

var calculator = require('./../bin/calculator');

describe('calculator',function(){

	describe('.match()',function(){

		it('should guard against message missing text field',function(){
			missingTextMessage={notext:""};
			calculator.match(missingTextMessage).should.be.false;
		});

		it('should only match message whose text starts with calculate', function(){
			incorrectMessage={text:"calculator"};
			correctMessage={text:"calculate"};
			
			calculator.match(incorrectMessage).should.be.false;
			calculator.match(correctMessage).should.be.true;
		});

		it('should match those texts regardless of upper / lower case', function(){
			message1={text:"Calculate"};
			message2={text:"calcuLATE"};

			calculator.match(message1).should.be.true;
			calculator.match(message2).should.be.true;
		});

		it('should match those texts ignoring spaces', function(){
			message1={text:"     Calculate"};

			calculator.match(message1).should.be.true;
		});
		
	});

	describe('execute',function(){

		it('should be able to directly output number', function(){
			texts = ["123.456","-1",".1234"];
			answer = [123.456, -1, 0.1234];

			for(var i = 0 ;i<texts.length;++i)
			{
				msg = {text:"calculate "+texts[i]};
				calculator.execute(msg).should.be.equal(answer[i]);
			}
			
		});

		it('should be able to compute simple arithmetics', function(){
			texts = ["1+2-3+5","1*3*5/2-7","0.123*200 - 1", "2^3" , "2^2^2"];
			answer = [5, 0.5, 23.6, 8,16];

			for(var i = 0 ;i<texts.length;++i)
			{
				msg = {text:"calculate "+texts[i]};
				calculator.execute(msg).should.be.equal(answer[i]);
			}		
		});

		it('should follow the priorities', function(){
			texts = ["1*2-3*5","3/1*5-7*10","0.123*200 - 1*100"];
			answer = [-13,-55,-75.4];

			for(var i = 0 ;i<texts.length;++i)
			{
				msg = {text:"calculate "+texts[i]};
				calculator.execute(msg).should.be.equal(answer[i]);
			}		
		});

		it('should be able to handle parentheses / brackets / braces', function(){
			texts = ["1*(2-3)*5","300/10/(1+2)","[1+2]","-1*{2+[3*(4+5)]}"];
			answer = [-5,10,3,-29];

			for(var i = 0 ;i<texts.length;++i)
			{
				msg = {text:"calculate "+texts[i]};
				calculator.execute(msg).should.be.equal(answer[i]);
			}	
		});

		it('should be able to detect mismatched parentheses / brackets / braces', function(){
			texts = ["1*(2-3))*5","300/10/[(1+2)","(1+2]","-1*{2+[3*(4+5)]]"];

			for(var i = 0 ;i<texts.length;++i)
			{
				msg = {text:"calculate "+texts[i]};
				calculator.execute(msg).should.be.undefined;
			}	
		});

	});

});