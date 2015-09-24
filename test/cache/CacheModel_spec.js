var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');
var Cache = require('../../app/cache/CacheModel');

var urlBasic = "http://httpbin.org/";

describe('CacheModel', function() {
  var cache;
  beforeEach(function() {
    cache = new Cache();
  });
  describe('Constructor', function() {
    it('should have a config cacheDuration', function() {
      should.exist(cache._config.cacheDuration);
    });
    it('should have a sizeBytes property equal to zero', function() {
      expect(cache._sizeBytes).to.equal(0);
    });
    it('should have a memCache', function() {
      should.exist(cache._memCache);
    });
  });

  describe('methods', function() {

    describe('sizeOfObject', function() {
      it('should have a number size', function() {
        var size = cache.sizeOfObject('banana');
        expect(size).to.equal(12);
      });
    });

    describe('checkElementsLength', function() {
      it('should have a length of zero', function() {
        expect(cache.checkElementsLength()).to.equal(0);
      });
    });

    describe('checkSizeLimits', function() {
      it('should have a size of zero', function() {
        expect(cache._sizeBytes).to.equal(0);
      });
      it('should have a size of zero', function() {
        var node = cache._memCache.makeNode('banana', 'data');
        expect(cache.checkSizeLimits(node)).to.equal(undefined);
      });
    });

    describe('createNewEntry', function() {
      
      var now;
      var node;
      var bytes;

      beforeEach(function() {
        now = new Date();
        cache.clearCache();
        node = cache.createNewEntry('banana', now, 'data');
      });

      it('should have a memCache', function() {
        should.exist(cache._memCache);
      });
      it('should return the new node', function() {
        expect(node.id).to.equal('banana');
      });
      it('should create a new entry', function() {
        expect(cache._memCache.find('banana').id).to.equal('banana');
      });
      it('should increase the cache memory size', function() {
        expect(cache._sizeBytes).to.be.above(0);
      });
      it('should increase the cache memory size by a particular amount', function() {
        cache.clearCache();
        node = cache.createNewEntry('banana', now, 'data');
        bytes = cache.sizeOfObject(node);
        bytes += cache.sizeOfObject('banana');
        expect(cache._sizeBytes).to.equal(bytes);
      });
      it.skip('should be be too large for the cache', function(done) {
        request(urlBasic, function(error, response, body) {
          cache.clearCache();
            should.not.exist(cache.createNewEntry(urlBasic, response, now, now.getTime()));
            done();
        });
      });

      describe('searchCache', function() {
        
        it('should find the element', function() {
          expect(cache.searchCache('banana').id).to.equal('banana');
        });
      });
    });

    describe('checkCacheDurations', function() {
      var now;
      var node;

      beforeEach(function() {
        now = new Date();
        cache.clearCache();
      });

      it('should not remove the new node', function() {
        cache.createNewEntry('banana', now, 'data');
        var removed = cache.checkCacheDurations();
        expect(removed.length).to.equal(0);
      });
      it('should remove the old node', function() {
        cache.createNewEntry('banana', now, 'data', now - cache._config.cacheDuration - 1000);
        cache.createNewEntry('mango', now, 'data');
        var removed = cache.checkCacheDurations();
        expect(removed[0]).to.equal('banana');
      });
    });
  });
});
