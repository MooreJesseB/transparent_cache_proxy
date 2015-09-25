var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');
var cacheController = require('../../app/cache/cacheController');

var controller = new cacheController();

var urlBasic = "http://httpbin.org/";
var url304 = "http://httpbin.org/cache";


describe('request', function() {

  this.timeout(10000);

  it('should exist', function(done) {
    request(url304, function(error, response, body) {
      if (!error) {
        should.exist(response);
        done();
      } else {
        console.log("ERROR:");
        done();
      }
    });
  }); 
  it('should return a response code of 304 and have no body', function(done) {
    request(url304, function(error, response, body) {
      var options = {
        uri: url304,
        headers: {'If-Modified-Since': response.headers['last-modified']}
      };
      request(options, function(error, response, body) {
        expect(response.statusCode).to.equal(304);
        expect(response.body.length).to.equal(0);
        done();
      });
    });      
  });
  it('should return a response code of 200', function(done) {
    var res;
    request.get(url304)
    .on('response', function(response) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

describe('cacheController', function() {

  this.timeout(10000);

  beforeEach(function() {
    controller.clearCache();
  });

  describe('processNewRequest', function() {

    it('should create a new cache element', function(done) {
      controller.processNewRequest(url304, function(response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('should return a cached element', function(done) {

      controller.processNewRequest(url304, function(response, statusCode) {

        controller.processNewRequest(url304, function(response, statusCode) {

          expect(statusCode).to.equal('200 (cache)');
          done();
        });
      });
    });
  });

  describe('checkUpdated', function() {
    var node;

    it('should return a response code of 304', function(done) {
      controller.clearCache();
      request(url304, function(error, response, body) {
        node = controller.Cache.createNewEntry(url304, response.headers['last-modified'], 'data');
        
        controller.checkUpdated(url304, node, function(response, statusCode) {
          expect(statusCode).to.equal('200 (cache)');
          done();
        });
      });
    });
    it('should return a response code of 200', function(done) {
      controller.clearCache();

      request(urlBasic, function(error, response, body) {

        node = controller.Cache.createNewEntry(url304, response.headers.date, 'data');
        
        controller.checkUpdated(urlBasic, node, function(response) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
  });
});
