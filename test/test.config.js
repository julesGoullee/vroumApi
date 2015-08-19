"use strict";

require('mocha-sinon');
global.events = require('events');
global.chai = require('chai');
global.expect = chai.expect;
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);
global.chai.use(require('sinon-chai'));
var app = require('../app');
global.mockRequest = require('supertest')(app);