var express = require('express');

var router = new express.Router();

function get(req, res) {

}

router.get("*", get);

module.exports = router;