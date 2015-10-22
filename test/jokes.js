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
    msg.reply = sinon.spy(function(msg, cont) { cont() });
    msg.respond = sinon.spy();
    msg.send_to = sinon.spy();
    inst = new Jokes(source);
    done();
  });

  describe('#match', function() {
    it('should match "tell a joke"', function() {
      inst.match('tell a joke').should.be.true();
    });
    it('should match "Tell a joke"', function() {
      inst.match('Tell a joke').should.be.true();
    });
  });

  describe('#next', function() {
    it('should return a joke', function() {
      inst.next().should.equal(joke);
    });
  });

  describe('#on_message', function() {
    it('should tell a joke when asked', function(done) {
      msg.text = 'tell a joke';
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
