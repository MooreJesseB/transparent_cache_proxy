var CacheModel = require('../../app/cache/CacheModel');
var request = require('request');

function cacheController() {
  this.Cache = new CacheModel();
}

cacheController.prototype.processNewRequest = function(url, callback) {
  // new request. First check to clear out expired cache elements
  this.Cache.checkCacheDurations();

  var node = this.Cache.searchCache(url);
  var self = this;

  // If url is already in cache then check if url headers have been last-modified
  if (node) {
    this.checkUpdated(url, node, function(response, statusCode) {
      callback(response, statusCode);
    });

  // Create new node in cache
  } else {
    console.log("Creating new node");
    request(url, function(error, response, body) {
      if (!error) {

        node = self.Cache.createNewEntry(url, response.headers['last-modified'], response);  
        callback(response);

        self.Cache.reportCache();
      }
    });
  }
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

        console.log("Node exists: Response with cache data.", node.id);

        self.Cache.promoteElement(node.id);

        callback(node.data, '200 (cache)');

        self.Cache.reportCache();

      } else {

        console.log("Node exists: update node with new data");

        self.Cache.updateElement(node.id, response, response.headers['last-modified']);
        
        callback(response);

        self.Cache.reportCache();
      }
    } 
  });
};

cacheController.prototype.clearCache = function() {
    this.Cache.clearCache();
};

module.exports = cacheController;
