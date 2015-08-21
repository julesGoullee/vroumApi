"use strict";
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router({ params: 'inherit' });
var debug = require('debug')('vroumApi:db:marques');

var marqueModel = require('../models/marque');

function isValidFormatId(id) {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

router.get('/:id', function (req, res, next) {
    if (req.params && isValidFormatId(req.params.id) ) {

        marqueModel.findById(req.params.id, function (errBdd, marque) {
            if (marque === null) {
                res.status(404);
                res.json({
                    code: res.statusCode,
                    data: 'Not found'
                });
            }
            else if (!errBdd) {
                res.status(200);
                res.json({
                    code: res.statusCode,
                    data: marque
                });
            }
            else {
                if (errBdd.code === 11000) {
                    res.status(404);
                    res.json({
                        code: res.statusCode,
                        data:  'Name already exist, it will unique'
                    });
                }
                else{
                    debug('PUT ' + errBdd);
                    var err = new Error(errBdd);
                    res.status(500);
                    next(err);
                }
               
            }
        });
    }
    else {
        res.status(400);
        res.json({
            code: res.statusCode,
            data: 'Id params format incorrect'
        });
    }
});

router.get('/', function(req, res, next) {
    marqueModel.find(function (errBdd, marques) {

        if (!errBdd) {

            res.status(200);

            return res.json({
                code: res.statusCode,
                data: marques
            });
        }
        else {
            debug('GET ' + errBdd);
            var err = new Error(errBdd);
            res.status(500);
            next(err);
        }
    });
});

router.post('/', function(req, res, next) {

    if (req.body && req.body.name && req.body.description) {
        var product = new marqueModel({
            name: req.body.name,
            description: req.body.description
        });

        product.save(function (errBdd) {
            if (!errBdd) {
                res.status(201);
                return res.json({
                    code: res.statusCode,
                    data: 'Create'
                });
            }
            else {
                if (errBdd.code === 11000) {
                    res.status(409);
                    res.json({
                        code: res.statusCode,
                        data: 'Name already exist, it will unique'
                    });
                }
                else{
                    debug('POST ' + errBdd);
                    var err = new Error(errBdd);
                    res.status(500);
                    next(err);
                }
                

            }
        });
    }
    else {
        res.status(400);
        res.json({
            code: res.statusCode,
            data: 'Missing params name or description'
        });
    }

});

module.exports = router;