var should = require('should');
var sinon = require('sinon');
var requirejs = require('../load');

describe('HandlerAdaptor', function() {

  var old_affirm_handler = {
    'message': 'affirm',
    'match': function() { return true; },
    'execute': function() { return 'affirm'; }
  };

  var old_deny_handler = {
    'message': 'deny',
    'match': function() { return false; },
    'execute': function() { return 'deny'; }
  };

  var HandlerAdaptor;

  before(function(done) {
    HandlerAdaptor = requirejs('handler_adaptor');
    done();
  });

  beforeEach(function(done) {
    msg = {};
    msg.raw = {};
    msg.channel = 'channel';
    msg.user = 'user';
    msg.text = 'message';
    msg.reply = sinon.spy(function(msg, cont) { cont(); });
    msg.respond = sinon.spy(function(msg, cont) { cont(); });
    msg.send_to = sinon.spy(function(msg, cont) { cont(); });
    done();
  });

  describe('#constructor', function() {
    it('should create a handler member', function(done) {
      var handler = {};
      var inst = new HandlerAdaptor(handler);
      inst.handler.should.equal(handler);
      done();
    });
  });

  describe('#on_message', function() {
    it('should consume the provided message on match', function(done) {
      var inst = new HandlerAdaptor(old_affirm_handler);
      inst.on_message(msg, function(obj) {
        should(obj).be.undefined();
        done();
      });
    });
    it('should send the result of execute on match', function(done) {
      var inst = new HandlerAdaptor({
        'match': function() { return true },
        'execute': function() { return 'affirm'; }
      });
      inst.on_message(msg, function() {
        msg.respond.calledOnce.should.be.true();
        msg.respond.firstCall.args[0].should.equal(old_affirm_handler.message);
        done();
      });
    });
    it('should echo the provided message on no match', function(done) {
      var inst = new HandlerAdaptor(old_deny_handler);
      inst.on_message(msg, function(obj) {
        obj.should.equal(msg);
        done();
      });
    });
    it('should send nothing on no match', function(done) {
      var inst = new HandlerAdaptor(old_deny_handler);
      inst.on_message(msg, function() {
        msg.respond.callCount.should.equal(0);
        done();
      });
    });
  });
});
