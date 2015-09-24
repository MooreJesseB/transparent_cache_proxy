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
  console.log("Promoting node");
  this._memCache.updateTimestamp(url, this.now());
};

Cache.prototype.checkCacheLimits = function(object) {
  console.log("Check cache limits");
  this.checkElementsLength();
  if (this.checkSizeLimits(object)) {
    return true;
  }
};

Cache.prototype.checkElementsLength = function() {
  if (this._memCache.getLength() > this._config.cacheSizeElements - 1) {
    this._memCache.remove();
  }

  return this._memCache.getLength();
};

Cache.prototype.checkCacheDurations = function() {
  var nodesRemoved = [];

  if (this._memCache.getLength() > 0) {
    while (
      this._memCache.getTail() && 
      this._memCache.getTail().timestamp < this.now() - this._config.cacheDuration
    )

      {
        var nodeId = this._memCache.remove();
        console.log("Node duration expired - Removing old cache\n", nodeId, '\n');
        nodesRemoved.push(nodeId);
      }  
  }

  return nodesRemoved;
};

Cache.prototype.checkSizeLimits = function(object) {
  // id (or url) is also used as the primary key for the list objects and needs to be taken into account
  var newEntrySize = this.sizeOfObject(object) + this.sizeOfObject(object.id);
  var currentNode;

  while (newEntrySize + this._sizeBytes > this._config.cacheSizeBytes) {

    if (newEntrySize > this._config.cacheSizeBytes) {
      console.log("Cache is not large enough to store this url");
      return true;
    }

    currentNode = this._memCache.getTail();

    if (currentNode) {

      this._memCache.remove();
      this._sizeBytes -= this.sizeOfObject(currentNode) + this.sizeOfObject(currentNode.id);  

      console.log("Cache is too large: removing oldest node");
    } else {

      // Edge case catch all break
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

Cache.prototype.createNewEntry = function(url, lastUpdated, data, timestamp) {

  var node = this._memCache.makeNode(url, data, lastUpdated, timestamp || this.now());

  if (this.checkCacheLimits(node)) {
    console.log("Error! Can not create node!");
    return null;
  }

  node = this._memCache.add(node);

  // increase the cacheSize in bytes
  this._sizeBytes += this.sizeOfObject(node) + this.sizeOfObject(url);

  return node;
};

Cache.prototype.updateElement = function(id, data, lastUpdated) {
  this._memCache.updateData(id, data, lastUpdated, this.now());
};

Cache.prototype.clearCache = function() {
  this._memCache = new List();
  this._sizeBytes = 0;
};

Cache.prototype.cacheEmptyCheck = function() {
  return (!!this._memCache.getLength());
};

Cache.prototype.reportCache = function() {
  console.log("Cache size bytes:", this._sizeBytes);
  console.log("Cache num elements:", this._memCache.getLength());
};

module.exports = Cache;