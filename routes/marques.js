"use strict";
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router({ params: 'inherit' });
var debug = require('debug')('vroumApi:db:marques');

var MarqueModel = require('../models/marque');
var VehiculeModel = require('../models/vehicule');

function isValidFormatId(id) {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

//GET ONE
router.get('/:id', function (req, res, next) {
    if (req.params && isValidFormatId(req.params.id) ) {

        MarqueModel.findById(req.params.id, function (errBdd, marque) {
            if (marque === null) {
                res.status(404);
                res.json({
                    code: res.statusCode,
                    data: 'Marque Not found'
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
                debug('GetOne ' + errBdd);
                var err = new Error(errBdd);
                res.status(500);
                next(err);
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

//GET ALL
router.get('/', function(req, res, next) {
    MarqueModel.find(function (errBdd, marques) {

        if (!errBdd) {

            res.status(200);

            res.json({
                code: res.statusCode,
                data: marques
            });
        }
        else {
            debug('GetAll ' + errBdd);
            var err = new Error(errBdd);
            res.status(500);
            next(err);
        }
    });
});

//CREATE
router.post('/', function(req, res, next) {

    if (req.body && req.body.name && req.body.description) {
        var marque = new MarqueModel({
            name: req.body.name,
            description: req.body.description
        });

        marque.save(function (errBdd) {
            if (!errBdd) {
                res.status(201);
                res.json({
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

//UPDATE
router.put('/:id', function(req, res, next){
    if (req.params && isValidFormatId(req.params.id) ) {
        if (req.body && req.body.name && req.body.description){
            MarqueModel.findOneAndUpdate({_id: req.params.id},
            {
                $set:{
                    name: req.body.name,
                    description: req.body.description,
                    modified: Date.now()
                },
                $inc: {
                    version: 1
                }
            },{ upsert: false },function (errBdd, marque) {
                if (marque === null) {
                    res.status(404);
                    res.json({
                        code: res.statusCode,
                        data: 'Id marque Not found'
                    });
                }
                else if (!errBdd) {
                    res.status(200);
                    res.json({
                        code: res.statusCode,
                        data: 'Updated marque'
                    });
                }
                else {
                    if (errBdd.code === 11001) {
                        res.status(409);
                        res.json({
                            code: res.statusCode,
                            data: 'Marque name already exist, it will unique'
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
        else{
            res.status(400);
            res.json({
                code: res.statusCode,
                data: 'Missing params name or description'
            });
        }
    }
    else{
        res.status(400);
        res.json({
            code: res.statusCode,
            data: 'Id params format incorrect'
        });
    }
});

//DELETE
router.delete('/:id', function (req, res, next) {
    if (req.params && isValidFormatId(req.params.id) ) {
        
        VehiculeModel.find({marqueId: req.params.id}, function(errBdd, vehicules){
            console.log();
            if(!errBdd){
                if(vehicules.length === 0){
                    MarqueModel.findByIdAndRemove(req.params.id, function (errBdd, marque) {
                        if (marque === null) {
                            res.status(404);
                            res.json({
                                code: res.statusCode,
                                data: 'Id marque Not found'
                            });
                        }
                        else if (!errBdd) {
                            res.status(200);
                            res.json({
                                code: res.statusCode,
                                data: 'Deleted marque'
                            });
                        }
                        else {
                            debug('DELETE ' + errBdd);
                            var err = new Error(errBdd);
                            res.status(500);
                            next(err);
                        }
                    });
                }
                else{
                    res.status(400);
                    res.json({
                        code: res.statusCode,
                        data: 'Connot deleted marque with one or more vehicule. Actual: ' + vehicules.length + '.'
                    });
                }
            }
            else{
                debug('DELETE ' + errBdd);
                var err = new Error(errBdd);
                res.status(500);
                next(err);
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

module.exports = router;