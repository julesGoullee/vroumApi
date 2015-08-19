"use strict";
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router({ params: 'inherit' });
var debug = require('debug')('vroumApi:db:marques');

var marqueModel = require('../models/marque');

function isValidFormatId(id) {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

router.put('/', function (req, res, next) {
    if (req.query && isValidFormatId(req.query.id) ) {

        marqueModel.findById(req.query.id, function (errBdd, marque) {
            var err;
            if (marque === null) {
                err = new Error('mongosse findById');
                res.status(404);
                err.data = 'Not found';
                next(err);
            }
            else if (!errBdd) {
                res.status(200);
                res.send({
                    code: res.statusCode,
                    data: marque
                });
            }
            else {
                err = new Error('mongosse findById');
                if (errBdd.code === 11000) {
                    res.status(404);
                    err.data = 'Name already exist, it will unique';
                }
                else{
                    debug('PUT ' + errBdd);
                    err.data = JSON.stringify(errBdd);
                    res.status(500);
                }
                next(err);

            }
        });
    }
    else {
        var err = new Error('req.query.id incorrect');
        res.status(400);
        err.data = 'Id params format incorrect';
        next(err);
    }
});

router.get('/', function(req, res, next) {
    marqueModel.find(function (errBdd, marques) {

        if (!errBdd) {

            res.status(200);

            return res.send({
                code: res.statusCode,
                data: marques
            });
        }
        else {
            var err = new Error(errBdd);
            debug('GET ' + errBdd);
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
                return res.send({
                    code: res.statusCode,
                    data: 'Create'
                });
            }
            else {
                var err = new Error('mongosse save');

                if (errBdd.code === 11000) {
                    res.status(409);
                    err.data = 'Name already exist, it will unique';
                }
                else{
                    debug('POST ' + errBdd);
                    err.data = JSON.stringify(errBdd);
                    res.status(500);
                }
                next(err);

            }
        });
    }
    else {
        var err = new Error('req.body incorrect');
        res.status(400);
        err.data = 'Missing params name or description';
        next(err);
    }

});

module.exports = router;