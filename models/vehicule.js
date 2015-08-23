"use strict";
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var vehicule = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    marqueId: {type: mongoose.Schema.ObjectId, required: true, index: true},
    modified: { type: Date, default: Date.now }
},{ versionKey: 'version' });

module.exports = mongoose.model('vehicule', vehicule);