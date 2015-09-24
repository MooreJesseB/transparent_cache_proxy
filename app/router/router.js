var express = require('express');
var request = require('request');
var cacheController = require('../cache/cacheController');

var router = new express.Router();

var controller = new cacheController();

function get(req, res) {
  console.log('\nIncoming, REQUEST URL:\n', req.url);
  
  // request(req.url, function(error, response, body) {
  //   res.send(response.body);
  // });
  // return;
  controller.processNewRequest(req.url, function(response) {
    res.send(response.body);
  });
}

function proxyPass(req, res) {
  request(req.url).pipe(res);
}

router.get('*', get);

router.post('*', proxyPass);

router.put('*', proxyPass);

router.delete('*', proxyPass);

module.exports = router;