var should = require('should');
var sinon = require('sinon');
var requirejs = require('../load');


describe('Handler', function() {

  var Handler;
  var inst;

  before(function(done) {
    Handler = requirejs('handler');
    done();
  });

  beforeEach(function(done) {
    inst = new Handler();
    done();
  });

  describe('#on_message', function() {
    it('should echo the provided message', function(done) {
      var msg = {};
      inst.on_message(msg, function(obj) {
        obj.should.equal(msg);
        done();
      });
    });
  });

});
