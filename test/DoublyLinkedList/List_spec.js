var expect = require('chai').expect;
var should = require('chai').should();
var List = require('../../app/DoublyLinkedList/List');

describe('List', function() {
  
  var list;

  beforeEach(function() {
    list = new List(); 
  });

  describe('Constructor', function () {
    it('should have a length of zero', function() {
      expect(list._length).to.equal(0);
    });
    it('should have a _head of null', function() {
      expect(list._head).to.equal(null);
    });
    it('should have a _tail of null', function() {
      expect(list._tail).to.equal(null);
    });
    it('should have nodes be an empty object', function() {
      expect(list.nodes).to.equal(undefined);
    });
  });

  describe('Make Node - ', function() {

    var now = new Date();
    var node;

    beforeEach(function() {
      node = list.makeNode(
        'banana',
        'data',
        now,
        now.getTime()
      );
    });

    it('should have the correct id', function() {
      expect(node.id).to.equal('banana');
    });
    it('should have the correct data', function() {
      expect(node.data).to.equal('data');
    });
    it('should have the correct lastUpdated', function() {
      expect(node.lastUpdated).to.equal(now);
    });
    it('should have the correct timestamp', function() {
      expect(node.timestamp).to.equal(now.getTime());
    });
  });

  describe('Add Node - ', function() {

    describe('Add a single node', function() {

      var now;
      var node;

      beforeEach(function() {
        var now = new Date();
        node = list.makeNode(
          'banana',
          'data',
          now,
          now.getTime()
        );
        node = list.add(node);
      });

      it('should increase list length', function() {
        expect(list._length).to.equal(1);
      });
      it('should return the new node', function() {
        expect(node.id).to.equal('banana');
      });
      it('should set new node to head', function() {
        expect(list._head.data).to.equal('data');
      });
      it('should set new node to tail', function() {
        expect(list._tail.data).to.equal('data');
      });
      it('should create new node key for id', function() {
        expect(list._nodes.banana).to.equal(list._head);
      });
    });

    describe('Add two nodes', function() {

      beforeEach(function() {
        list.add(list.makeNode('banana', 'data'));
        list.add(list.makeNode('apple', 'data'));
      });

      it('should set second node as head', function() {
        expect(list._head.id).to.equal('apple');
      });
    });
  });

  describe('Remove node - ', function() {

    describe('should remove node from list of one node', function() {

      beforeEach(function() {
        list.add(list.makeNode('banana', 'data'));
        list.remove();
      });

      it('should decrement the list length', function() {
        expect(list._length).to.equal(0);
      });
      it('should remove node from ids', function() {
        should.not.exist(list._nodes.banana);
      });
    });
    describe('Remove node from list of two nodes', function() {

      beforeEach(function() {
        list.add(list.makeNode('banana', 'data'));
        list.add(list.makeNode('apple', 'data'));
        list.remove();
      });

      it('should remove the tail node', function() {
        expect(list._tail.id).to.equal('apple');
      });
    });
  });

  describe('Promote node - ', function() {

    var node;

    describe('Promote with one node', function() {

      beforeEach(function() {
        list.add(list.makeNode('banana', 'data'));
        list.promote('banana');
      });

      it('should do nothing', function() {
        node = list._nodes.banana;
        expect(list._head).to.equal(node);
      });
      it('should do nothing', function() {
        node = list._nodes.banana;
        expect(list._tail).to.equal(node);
      });
    });

    describe('Promote last node out of two', function() {

      beforeEach(function() {
        list.add(list.makeNode('banana', 'data'));
        list.add(list.makeNode('apple', 'data'));
        list.promote('banana');
      });

      it('should promote tail node to head', function() {
        node = list._nodes.banana;
        expect(list._head).to.equal(node);
      });
      it('should move head node to tail', function() {
        node = list.find('apple');
        expect(list._tail).to.equal(node);
      });
      it('should set promoted node.next to tail', function() {
        expect(list.find('banana').next).to.equal(list.find('apple'));
      });
      it('should set new tail node.prev to promoted node', function() {
        expect(list.find('apple').prev).to.equal(list.find('banana'));
      });
    });

    describe('Promote middle node of three', function() {

      beforeEach(function() {
        list.add(list.makeNode('banana', 'data'));
        list.add(list.makeNode('apple', 'data'));
        list.add(list.makeNode('mango', 'data'));
        list.promote('apple');
      });

      it('should set promoted node to head', function() {
        node = list.find('apple');
        expect(list._head).to.equal(node);
      });
      it('should set promoted node.next to old head', function() {
        expect(list.find('apple').next).to.equal(list.find('mango'));
      });      
      it('should set old head.prev to promoted node', function() {
        expect(list.find('mango').prev).to.equal(list.find('apple'));
      });
      it('should set old head.next to new tail', function() {
        expect(list.find('mango').next).to.equal(list.find('banana'));
      });
      it('should set tail.prev old head', function() {
        expect(list.find('banana').prev).to.equal(list.find('mango'));
      });
    });
  });

  describe('getLength', function() {

    it('should have a length of zero', function() {
      expect(list.getLength()).to.equal(0);
    });
  });

  describe('find', function() {

    it('should find the correct node', function() {
      list.add(list.makeNode('banana', 'data'));
      expect(list.find('banana').id).to.equal('banana');
    });
  });

  describe('updateData', function() {
      var now = new Date();
      var id = 'banana';
      var node;
    beforeEach(function() {
      list.add(list.makeNode(id, 'data'));
      list.updateData(id, 'dataNew', now, now);
      node = list.find(id);
    });
    it('should update the node with new data', function() {
      expect(node.data).to.equal('dataNew');
    });
    it('should update the node with new lastUpdated', function() {
      expect(node.lastUpdated).to.equal(now);
    });
    it('should update the node with new timestamp', function() {
      expect(node.timestamp).to.equal(now);
    });
    it('should set the updated node as the head', function() {
      should.not.exist(node._head);
    });
  });
});



