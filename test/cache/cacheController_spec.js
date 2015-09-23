var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');
var cacheController = require('../../app/cache/cacheController');

var controller = new cacheController();

var testUrl = "http://httpbin.org/cache";
var testUrl2 = "http://httpbin.org/";

describe('request', function() {

  this.timeout(10000);

  it('should exist', function(done) {
    request(testUrl, function(error, response, body) {
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
    request(testUrl, function(error, response, body) {
      var options = {
        uri: testUrl,
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
    request.get(testUrl)
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
      controller.processNewRequest(testUrl, function(response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe('checkUpdated', function() {
    var node;

    // beforeEach(function() {
    //   controller.clearCache();
    // });

    // afterEach(function() {
    //   controller.clearCache();
    // });

    it('should return a response code of 304', function(done) {
      controller.clearCache();
      request(testUrl, function(error, response, body) {
        node = controller.Cache.createNewEntry(testUrl, response.headers['last-modified'], 'data');
        
        controller.checkUpdated(testUrl, node, function(response, statusCode) {
          expect(statusCode).to.equal('200 (cache)');
          done();
        });
      });
    });
    it('should return a response code of 200', function(done) {
      controller.clearCache();

      request(testUrl2, function(error, response, body) {

        node = controller.Cache.createNewEntry(testUrl, response.headers.date, 'data');
        
        controller.checkUpdated(testUrl2, node, function(response) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
  });
});