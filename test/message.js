var should = require('should');
var sinon = require('sinon');
var requirejs = require('../load');


describe('Message',function(){

  var Message;
  var Client;
  var inst;
  var raw;

  var channel;
  var chan_name = 'channel';
  var user;
  var user_name = 'user';
  var text = 'text';


  before(function(done) {
    Message = requirejs('message');
    done();
  });

  beforeEach(function(done) {
    user = { 'name': user_name };
    channel = { 'send': sinon.stub() };
    Client = {};
    raw = { 'channel': channel, 'user': user, 'text': text };
    Client.getChannelGroupOrDMByID = sinon.stub().returns(channel);
    Client.getUserByID = sinon.stub().returns(user);
    inst = new Message(Client, raw);
    done();
  });

  describe('#constructor', function() {
    it('should store the original message as #raw', function() {
      inst.raw.should.equal(raw);
    });
    it('should store the channel as #channel', function() {
      inst.channel.should.equal(channel);
    });
    it('should store the user as #user', function() {
      inst.user.should.equal(user);
    });
    it('should store the message text as #text', function() {
      inst.text.should.equal(text);
    });
  });

  describe('#respond', function() {
    it('should send a message', function(done) {
      inst.respond(text, function() {
        channel.send.calledOnce.should.be.true();
        channel.send.firstCall.args[0].should.equal(text);
        done();
      });
    });
  });

  describe('#send_to', function() {
    it('should send a message to the provided name', function(done) {
      inst.send_to('derp', text, function() {
        channel.send.calledOnce.should.be.true();
        channel.send.firstCall.args[0].should.equal('@derp: ' + text);
        done();
      });
    });
  });

  describe('#reply', function() {
    it('should send a message back to the sending user', function(done) {
      inst.reply(text, function() {
        channel.send.calledOnce.should.be.true();
        channel.send.firstCall.args[0].should.equal(
            '@' + user_name + ': ' + text);
        done();
      });
    });
  });

});
