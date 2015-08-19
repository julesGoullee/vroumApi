"use strict";

var express = require('express');
var router = express.Router();

/* GET api status */
router.get('/', function(req, res, next) {
    res.status(200);
    next(200,'Api is running');
});

module.exports = router;
