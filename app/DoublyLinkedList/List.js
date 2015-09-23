 // Special doubly linked list for transparent cache

 function DoublyLinkedList() {
  this._length = 0;
  this._head = null;
  this._tail = null;
  this._nodes = {};
 }

 DoublyLinkedList.prototype = {
  
  add: function(node) {
    if (this._length === 0) {

      // For empty list, first node
      this._head = node;
      this._tail = node;
    } else {

      // For cache, new node goes at head
      node.next = this._head;
      this._head.prev = node;
      this._head = node;
    }

    // Set the id
    this._nodes[node.id] = node;

    // Add to list length
    this._length++;

    return node;
  },

  remove: function() {
    var node = this._tail;

    if (node) {
      // Special remove for cache: Only tail ever removed
      if (this._length === 1) {
        this._head = null;
        this._tail = null;
        this._nodes = {};
      } else {
        node.prev.next = null;
        this._tail = node.prev;
      }

      // Clear node
      this._nodes[node] = null;

    } else {
      console.log("Error: List is empty or there is no tail node");
    }

    if (this._length) {
      this._length--;      
    }
  },

  find: function(id) {
    return this._nodes[id];
  },

  promote: function(id) {
    var node = this.find(id);

    if (this._length > 1 && this._head !== node) {
      
      // Remove node from current position
      node.prev.next = node.next;
      
      if (this._tail === node) {
        this._tail = node.prev;  
      }

      if (node.next) {
        node.next.prev = node.prev;
      }

      // Put new node at the head
      node.next = this._head;
      this._head.prev = node;
      this._head = node;
    }
  },

  getTail: function() {
    return this._tail;
  },

  getPrev: function(id) {
    return this.find(id).prev;
  },

  updateTimestamp: function(id, timestamp) {
    node = this.find(id);

    node.data.timestamp = timestamp;
    this.promote(id);
  },

  updateData: function(id, data, lastUpdated, timestamp) {
    var node = this.find(id);

    node.data = data;
    node.lastUpdated = lastUpdated;
    node.timestamp = timestamp;
    
    this.promote(id);
  },

  getLength: function() {
    return this._length;
  },

  makeNode: function(id, data, lastUpdated, timestamp) {
    return {
      'data': data,
      'id': id,
      'lastUpdated': lastUpdated,
      'timestamp': timestamp,
      next: null,
      prev: null
    };
  }
 };

 module.exports = DoublyLinkedList;