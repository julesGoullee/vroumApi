"use strict";

require('mocha-sinon');
global.events = require('events');
global.chai = require('chai');
global.expect = chai.expect;
global.chai.use(require('sinon-chai'));
process.env.NODE_ENV = 'development';

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

before( function() {
    mockgoose(mongoose);
    var app = require('../app');
    global.mockRequest = require('supertest')(app);
    mongoose.connect('mongodb://localhost/vroum');

});

after( function() {
    mockgoose.reset();
    mongoose.connection.close();
});