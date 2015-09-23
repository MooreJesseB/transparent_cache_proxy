var CacheModel = require('../../app/cache/CacheModel');
var request = require('request');

function cacheController() {
  this.Cache = new CacheModel();
}

cacheController.prototype.processNewRequest = function(url, callback) {
  var node = this.Cache.searchCache(url);
  var self = this;

  // If url is already in cache then check if url headers have been last-modified
  if (node) {
    this.checkUpdated(url, node, function(response) {
      callback(response);
    });

  // Create new node in cache
  } else {
    request(url, function(error, response, body) {
      if (!error) {
        node = self.Cache.createNewEntry(url, response.headers['last-modified'], response);  
        callback(response);
      }
    });
  }

  // if (!this.Cache.interval) {
  //   this.startDurationInterval();  
  // }
};

cacheController.prototype.checkUpdated = function(url, node, callback) {
  var self = this;
  
  var options = {
    'url': url,
    'headers': {'If-Modified-Since': node.lastUpdated}
  };

  request(options, function(error, response, body) {
    if (!error) {

      if (response.statusCode === 304) {

        self.Cache.promoteElement(node.id);

        callback(node.data, '200 (cache)');

      } else {

        self.Cache.updateElement(node.id, response, response.headers['last-modified']);
        
        callback(response);
      }
    } 
  });
};

// Periodically check the cache for expired entries
cacheController.prototype.startDurationInterval = function() {
  this.Cache.interval = setInterval(function() {
    this.Cache.checkCacheDurations();
  }, 1000);
};
cacheController.prototype.clearCache = function() {
    this.Cache.clearCache();
};

module.exports = cacheController;
