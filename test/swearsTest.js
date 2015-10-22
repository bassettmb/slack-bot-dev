var requirejs = require('../load.js');

describe('swears', function () {

    var Swears = require('../src/swears');

    before(function (done) {
        fs.mkdirSync('temp');
        fs.writeFileSync('temp/test.txt', 'Bad\nwords\nHERE');

        // load the modules
        var expect, fs, Swears;
        requirejs(['chai', 'fs', 'src/swears'], function (chai, FS, swears) {
            expect = chai.expect;
            fs = FS;
            Swears = swears;
            done(); // We can launch tests now
        });
    });

    after(function () {
        fs.unlinkSync('temp/test.txt');
        fs.rmdirSync('temp');
    });

    describe('.Constructor()', function () {

        it('should accept a dictionary object as a param and make it a property', function () {
            var obj = {'one': 1, '2': 'two'};
            var swears = new Swears(obj);
            expect(swears).to.have.property('dict');
            expect(swears).to.have.property('dict').that.is.an('object');
            expect(swears).to.have.property('dict').that.deep.equals(obj);
        });

        it('should create an empty dictionary if a null object is passed', function () {
            var swears = new Swears(null);
            expect(swears).to.have.property('dict');
            expect(swears).to.have.property('dict').that.is.an('object');
            expect(swears).to.have.property('dict').that.deep.equals({});
        });

        it('should throw a type error if a non-object is passed', function () {
            var create = function (param) {
                var swear = new Swears(param);
            };
            expect(create(8)).to.throw('Swear dictionary must be an object');
            expect(create(undefined)).to.throw('Swear dictionary must be an object');
            expect(create('lol')).to.throw('Swear dictionary must be an object');
            expect(create(true)).to.throw('Swear dictionary must be an object');
            expect(create([8,7])).to.throw('Swear dictionary must be an object');
        });

    });

    describe('.create_dict()', function () {

        var file = 'temp/test.txt';

        it('should put lines of a file into a map as lowercase', function (done) {
            Swears.create_dict(file, function (err, dict) {
                expect(err).to.be.not.ok;
                expect(dict).to.be.an('object');
                expect(dict).to.have.property('bad');
                expect(dict).to.have.property('words');
                expect(dict).to.have.property('here');
                done();
            });
        });

        it('should pass any error to its continuation function', function (done) {
            Swears.create_dict('notafile.txt', function (err, dict) {
                expect(dict).to.not.be.ok;
                expect(err).to.be.ok;
                done()
            });
        });

    });
    
    describe('.on_message()', function () {

        var dict = {
            'bad': true,
            'words': true,
            'here': true
        };

        var swears = new Swears(dict);

        var REPLY_PREFIX = "That is not appropriate language for a workplace! One should say '";
        var REPLY_POSTFIX = "' instead!";

        it('should simply pass the message to the continuation if it doesn\'t match the dictionary', function () {
            var msg = {
                text: 'There is nothing to match',
                reply: function (txt, cont) {
                    expect('Should not reach here: fail now').to.be.not.ok;
                }
            };
            swears.on_message(msg, function (message) {
                expect(message).to.be.ok;
                expect(message).to.have.property('text');
                expect(message).to.have.property('reply');
                expect(message).to.have.property('text').that.deep.equals('There is nothing to match');
            })
        });

        it('should call the message reply function with censored message if a match is made', function () {
            var msg = {
                text: 'There is bad words here to match',
                reply: function (txt, cont) {
                    expect(txt).to.equal(REPLY_PREFIX + 'There is *** ***** **** to match' + REPLY_POSTFIX);
                }
            };
            swears.on_message(msg, function (message) {
                expect('Should not reach here: fail now').to.be.not.ok;
            })
        });

        it('should censor messages regardless of case', function () {
            var msg = {
                text: 'There is BAD wOrDS here to match',
                reply: function (txt, cont) {
                    expect(txt).to.equal(REPLY_PREFIX + 'There is *** ***** **** to match' + REPLY_POSTFIX);
                }
            };
            swears.on_message(msg, function (message) {
                expect('Should not reach here: fail now').to.be.not.ok;
            })
        });

        it('should should not censor partial matches', function () {
            var msg = {
                text: 'There is badguy words here to match',
                reply: function (txt, cont) {
                    expect(txt).to.equal(REPLY_PREFIX + 'There is badguy ***** **** to match' + REPLY_POSTFIX);
                }
            };
            swears.on_message(msg, function (message) {
                expect('Should not reach here: fail now').to.be.not.ok;
            })
        });

        it('should censor properly when there are some full and some partial matches', function () {
            var msg = {
                text: 'There is bad badguy BAD to match',
                reply: function (txt, cont) {
                    expect(txt).to.equal(REPLY_PREFIX + 'There is *** badguy *** to match' + REPLY_POSTFIX);
                }
            };
            swears.on_message(msg, function (message) {
                expect('Should not reach here: fail now').to.be.not.ok;
            })
        });

        it('should censor properly even with irregular whitespace', function () {
            var msg = {
                text: 'There is    bad\n\rwords\vhere to match',
                reply: function (txt, cont) {
                    expect(txt).to.equal(REPLY_PREFIX + 'There is    ***\n\r*****\v**** to match' + REPLY_POSTFIX);
                }
            };
            swears.on_message(msg, function (message) {
                expect('Should not reach here: fail now').to.be.not.ok;
            })
        });

    });

});