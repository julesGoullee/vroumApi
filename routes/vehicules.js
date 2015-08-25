"use strict";
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router({ params: 'inherit' });
var debug = require('debug')('vroumApi:db:vehicule');

var VehiculeModel = require('../models/vehicule');
var MarqueModel = require('../models/marque');

function isValidFormatId(id) {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

function isInt( number ){
    return typeof number === 'string' &&
        !isNaN(parseInt(number)) &&
        parseInt(number) > 0;
}

//GET ONE
router.get('/:id', function (req, res, next) {
    if (req.params && isValidFormatId(req.params.id)) {

        VehiculeModel.findById(req.params.id, function (errBdd, vehicule) {
            if (vehicule === null) {
                res.status(404);
                res.json({
                    code: res.statusCode,
                    data: 'Vehicule Not found'
                });
            }
            else if (!errBdd) {
                res.status(200);
                res.json({
                    code: res.statusCode,
                    data: vehicule
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
router.get('/', function (req, res, next) {
    VehiculeModel.find(function (errBdd, vehicules) {

        if (!errBdd) {

            res.status(200);

            res.json({
                code: res.statusCode,
                data: vehicules
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
router.post('/', function (req, res, next) {

    if (req.body && req.body.name && req.body.description && req.body.marqueId && req.body.year &&
        isValidFormatId(req.body.marqueId) && isInt(req.body.year)) {
        var model = new VehiculeModel({
            name: req.body.name,
            description: req.body.description,
            marqueId: req.body.marqueId,
            year: parseInt(req.body.year)
        });

        MarqueModel.findById(req.body.marqueId, function (errBdd, marque) {
            if (marque === null) {
                res.status(400);
                res.json({
                    code: res.statusCode,
                    data: 'MarqueId Not found'
                });
            }
            else if (!errBdd) {
                model.save(function (errBdd) {
                    if (!errBdd) {
                        res.status(201);
                        res.json({
                            code: res.statusCode,
                            data: 'Created vehicule'
                        });
                    }
                    else {
                        if (errBdd.code === 11000) {
                            res.status(409);
                            res.json({
                                code: res.statusCode,
                                data: 'Vehicule Name already exist, it will unique'
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
                debug('PUT ' + errBdd);
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
            data: 'Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)'
        });
    }

});

//UPDATE
router.put('/:id', function (req, res, next){
    if (req.body && req.body.name && req.body.description && req.body.marqueId && req.body.year &&
        isValidFormatId(req.body.marqueId) && isValidFormatId(req.params.id) && isInt(req.body.year)) {

        MarqueModel.findById(req.body.marqueId, function (errBdd, marque) {
            if (marque === null) {
                res.status(400);
                res.json({
                    code: res.statusCode,
                    data: 'MarqueId Not found'
                });
            }
            else if (!errBdd) {
                VehiculeModel.findOneAndUpdate({_id: req.params.id},
                    {
                        $set:{
                            name: req.body.name,
                            description: req.body.description,
                            marqueId: req.body.marqueId,
                            year: parseInt(req.body.year),
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
                                data: 'Id vehicule Not found'
                            });
                        }
                        else if (!errBdd) {
                            res.status(200);
                            res.json({
                                code: res.statusCode,
                                data: 'Updated vehicule'
                            });
                        }
                        else {
                            if (errBdd.code === 11001) {
                                res.status(409);
                                res.json({
                                    code: res.statusCode,
                                    data: 'Vehicule name already exist, it will unique'
                                });
                            }
                            else {
                                debug('PUT ' + errBdd);
                                var err = new Error(errBdd);
                                res.status(500);
                                next(err);
                            }
                        }
                    });
            }
            else {
                debug('PUT ' + errBdd);
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
            data: 'Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)'
        });
    }
});

//DELETE
router.delete('/:id', function (req, res, next) {
    if (req.params && isValidFormatId(req.params.id)) {

        VehiculeModel.findByIdAndRemove(req.params.id, function (errBdd, vehicule) {
            if (vehicule === null) {
                res.status(404);
                res.json({
                    code: res.statusCode,
                    data: 'Id vehicule Not found'
                });
            }
            else if (!errBdd) {
                res.status(200);
                res.json({
                    code: res.statusCode,
                    data: 'Deleted vehicule'
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
    else {
        res.status(400);
        res.json({
            code: res.statusCode,
            data: 'Id params format incorrect'
        });
    }
});


module.exports = router;