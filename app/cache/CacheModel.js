var request = require('request');
var List = require('../DoublyLinkedList/List');

function Cache() {
  this._config = require('../../app/cache/cacheConfig');
  this._memCache = new List();
  this._sizeBytes = 0;
}

Cache.prototype.searchCache = function(url) {
  node = this._memCache.find(url);
  if (node) {
    return this._memCache.find(url);
  }
};

Cache.prototype.now = function() {
  return new Date().getTime();
};

Cache.prototype.promoteElement = function(url) {
  this._memCache.updateTimestamp(url, this.now());
};

Cache.prototype.checkCacheLimits = function(object) {
  // Check max entries
  this.checkElementsLength();
  this.checkSizeLimits(object);
};

Cache.prototype.checkElementsLength = function() {
  if (this._memCache.getLength() > this._config.cacheSizeElements - 1) {
    console.log("checkElementsLength");
    this._memCache.remove();
  }

  return this._memCache.getLength();
};

Cache.prototype.checkCacheDurations = function() {
  if (this._memCache.getLength() > 0) {
    while (this._memeCache.getTail() && this._memCache.getTail().timestamp < this.now()) {
      console.log("Removing old cache");
      this._memCache.remove();
    }  
  }
};

Cache.prototype.checkSizeLimits = function(object) {
  // id (or url) is also used as the primary key for the list objects and needs to be taken into account
  var newEntrySize = this.sizeOfObject(this._memCache.makeNode(object)) + this.sizeOfObject(object.id);
  var currentNode;

  while (newEntrySize + this._sizeBytes > this._config.cachSizeBytes) {
    currentNode = this._memCache.getTail();
    console.log("Check size limits");
    if (currentNode) {
      this._memCache.remove();
      this._sizeBytes -= this.sizeOfObject(currentNode);  
    } else {
      // Edge case catch all break
      console.log("Cache is not large enough to store this url");
      this.clearCache();
      this._sizeBytes = 0;
      break;
    }
  }
};

// This should probably be in it's own module.
// It is not really possible get completely accurate object byte sizes in JavaScript.
Cache.prototype.sizeOfObject = function(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if ( typeof value === 'number' ) {
      bytes += 8;
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value);
      for(var key in value) {
        stack.push(value[key]);
      }
    }
  }
  return bytes;
};

Cache.prototype.createNewEntry = function(url, lastUpdated, data) {

  var node = this._memCache.makeNode(url, data, lastUpdated, this.now());

  this.checkCacheLimits(node);

  node = this._memCache.add(node);

  // increase the cacheSize in bytes
  this._sizeBytes += this.sizeOfObject(this._memCache.makeNode(url, data)) + this.sizeOfObject(url);

  return node;
};

Cache.prototype.updateElement = function(id, data, lastUpdated) {
  this._memCache.updateData(id, data, lastUpdated, this.now());
};

Cache.prototype.clearCache = function() {
  this._memCache = new List();
  this._sizeBytes = 0;
};

module.exports = Cache;