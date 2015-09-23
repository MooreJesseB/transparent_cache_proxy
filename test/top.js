function importTest(name, path) {
  describe(name, function() {
    require(path);
  });
}

describe('top', function() {
  importTest('DoublyLinkedList', '../test/DoublyLinkedList/List_spec');
  importTest('CacheModel', '../test/cache/CacheModel_spec');
  importTest('cacheController', '../test/cache/cacheController_spec');
});