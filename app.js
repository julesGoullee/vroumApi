"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('vroumApi:db');

var mongoose = require('mongoose');
var routes = require('./routes/index');
var marques = require('./routes/marques');
var vehicules = require('./routes/vehicules');

var app = express();
var db = mongoose.connection;
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.set('json spaces', 2);

// Common middleWare Headers
app.use(function (req, res, next) {
    res.contentType('application/json');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/marques', marques);
app.use('/vehicules', vehicules);

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.status(404);
    res.json({
        code: 404,
        data: 'Not found'
    });
});

// Common error handlers
app.use(function(err, req, res, next) {
    if (err && err.message && err.message === 'invalid json') {
        res.status(400);
        err.data = err.message;
    }
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    require("debug").enable('vroumApi:*');

    app.use(function(err, req, res) {
        console.log('development');

        if (!res.statusCode) {
            res.status(500);
        }

        res.json({
            code: res.statusCode,
            data: err.data,
            stack: err.stack
        });
    });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
    app.set('x-powered-by', false);
    require("debug").enable('*');
    
    app.use(function (err, req, res) {
        if (!res.statusCode) {
            res.status(500);
        }

        res.json({
            code: res.statusCode,
            data: 'internal server error'
        });
    });
}

// Database
var mongoStringConnect = 'mongodb://' + ( process.env.mongoAuth || 'localhost/vroum');

mongoose.connect( mongoStringConnect, function(err) {
    if (err) {
        process.nextTick(function() {
            throw err;
        });
    }
    else{
        debug('Connection mongoDb [OK]');
    }
});

db.on('error', function(err) {
    throw err;
});

module.exports = app;