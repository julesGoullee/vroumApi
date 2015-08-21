"use strict";
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var marque = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    description: { type: String, required: true },
    modified: { type: Date, default: Date.now }
},{ versionKey: 'version' });

module.exports = mongoose.model('marque', marque);