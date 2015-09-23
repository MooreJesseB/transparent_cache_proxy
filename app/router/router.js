var express = require('express');
var request = require('request');
var cacheController = require('../cache/cacheController');

var router = new express.Router();

var controller = new cacheController();

function get(req, res) {
  console.log('\nREQUEST URL:\n', req.url);
  
  // request(req.url, function(error, res, body) {
  //   console.log("ERROR in request! - ", error);
  // }).on('response', function(response) {
  //   // console.log('\nHEADERS:\n', response.parser.headers);
  //   console.log('\nRES!!!:\n', response.headers);  
  // }).pipe(res);
  // return;
  controller.processNewRequest(req.url, function(response) {
    res = response;
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