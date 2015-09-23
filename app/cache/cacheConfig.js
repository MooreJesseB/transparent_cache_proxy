var config = {
  cacheDuration: 30 * 1000,
  cacheSizeBytes: 1024 * 2,
  cacheSizeElements: 50,
  // TODO: implement file cache and noSQL cache
  cacheType: 'memory'
};

module.exports = config;