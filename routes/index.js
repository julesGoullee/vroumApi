"use strict";

var express = require('express');
var router = express.Router();

/* GET api status */
router.get('/', function(req, res) {
    res.status(200);
    res.send({
        code: res.statusCode,
        data: 'Api is running'
    });
});

module.exports = router;
