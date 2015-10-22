var should = require('should');
var sinon = require('sinon');
var requirejs = require('../load');


describe('Jokes',function(){

  var Jokes;
  var source;
  var joke = 'joke';

  var msg;
  var inst;

  before(function(done) {
    requirejs(['jokes'], function(mod) {
      Jokes = mod;
      source = ({
        'next': (function() {
          return joke;
        })
      });
      done();
    });
  });

  beforeEach(function(done) {
    msg = {};
    msg.raw = {};
    msg.channel = 'channel';
    msg.user = 'user';
    msg.text = 'message';
    msg.botName = 'botname';
    msg.reply = sinon.spy(function(msg, cont) { cont() });
    msg.respond = sinon.spy();
    msg.send_to = sinon.spy();
    inst = new Jokes(source);
    done();
  });

  describe('#match', function() {
    it('should match messages starting with "Hey botname-Tell me a joke" regardless of case', function() {
      inst.match('hey botname-tell me a joke why not', 'botname').should.be.true();
      inst.match('Hey BOTNAME-Tell me a jOKe', 'botname').should.be.true();
    });
    it('should not match anything else at the start of a message', function() {
      inst.match('Tell me a joke', 'botname').should.be.false();
      inst.match('hey botname-', 'botname').should.be.false();
      inst.match('Blocked Hey Botname-Tell me a joke', 'botname').should.be.false();
    });
  });

  describe('#next', function() {
    it('should return a joke', function() {
      inst.next().should.equal(joke);
    });
  });

  describe('#on_message', function() {
    it('should tell a joke when asked', function(done) {
      msg.text = 'Hey botname-tell me a joke';
      inst.on_message(msg, function(obj) {
        should(obj).be.undefined();
        msg.reply.calledOnce.should.be.true();
        msg.reply.calledWith(joke).should.be.true();
        done();
      });
    });
    it('should pass through messages not requesting a joke', function(done) {
      inst.on_message(msg, function(obj) {
        should(obj).equal(msg);
        done();
      });
    });
  });

});
