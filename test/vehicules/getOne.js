"use strict";

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

describe('Vehicule:GetOne', function() {

    var _marque1;
    var _mockVehicule1;
    var _mockVehicule2;
    beforeEach(function(done) {
        mockRequest.post('/marques')
            .send({
                name: 'marqueName1',
                description: 'marqueDescription1'
            })
            .end(function() {
                mockRequest.get('/marques')
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
                        _marque1 = resContent.data[0];
                        _mockVehicule1 = {
                            name: 'vehiculeName1',
                            description: 'vehiculeDescription1',
                            year: '2007',
                            marqueId: _marque1._id
                        };

                        _mockVehicule2 = {
                            name: 'vehiculeName2',
                            description: 'vehiculeDescription2',
                            year: '2007',
                            marqueId: _marque1._id
                        };

                        mockRequest.post('/vehicules')
                            .send(_mockVehicule1)
                            .end(function() {
                                done();
                            });
                    });
            });
    });

    it('Should get one vehicule of one by _id', function(done) {
        mockRequest.get('/vehicules')
            .end(function(err, res) {
                var vehicule1 = JSON.parse(res.text).data[0];
                mockRequest.get('/vehicules/' + vehicule1._id)
                    .end(function (err, res) {
                        var resContent = JSON.parse(res.text);

                        expect(res.statusCode).to.equal(200);
                        expect(resContent.code).to.equal(200);

                        expect(resContent.data.name).to.equal(vehicule1.name);

                        expect(resContent.data._id).to.be.a('string');
                        expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

                        expect(resContent.data.marqueId).to.be.a('string');
                        expect(resContent.data.marqueId).to.equal(_marque1._id);
                        expect(mongoose.Types.ObjectId.isValid(resContent.data.marqueId)).to.equal(true);

                        expect(resContent.data.modified).to.be.a('string');
                        var modifiedDate = new Date(Date.parse(resContent.data.modified));
                        var isValideDate = !isNaN(modifiedDate.valueOf());
                        expect(isValideDate).to.equal(true);

                        expect(resContent.data.version).to.equal(0);
                        done();
                    });
            });
    });

    it('Should not get if id params invalid mongoId', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dffXX';

        mockRequest.get('/vehicules/' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Id params format incorrect');
                done();
            });
    });

    it('Should not get if id not found', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dff';

        mockRequest.get('/vehicules/' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(404);
                expect(res.statusCode).to.equal(404);
                expect(resContent.data).to.equal('Vehicule Not found');
                done();
            });
    });

    describe('Two vehicules', function(){
        beforeEach(function(done) {
            mockRequest.post('/vehicules')
                .send(_mockVehicule2)
                .end(function() {
                    done();
                });
        });

        it('Should get the first marques of several marques by _id', function(done) {

            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule1 = JSON.parse(res.text).data[0];

                    mockRequest.get('/vehicules/' + vehicule1._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);

                            expect(resContent.data.name).to.equal(vehicule1.name);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

                            expect(resContent.data.marqueId).to.be.a('string');
                            expect(resContent.data.marqueId).to.equal(_marque1._id);
                            expect(mongoose.Types.ObjectId.isValid(resContent.data.marqueId)).to.equal(true);

                            expect(resContent.data.modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data.modified));
                            var isValideDate = !isNaN(modifiedDate.valueOf());
                            expect(isValideDate).to.equal(true);

                            expect(resContent.data.version).to.equal(0);
                            done();
                        });
                });
        });

        it('Should get the seconde marques of several marques by _id', function(done) {

            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule2 = JSON.parse(res.text).data[1];
                    mockRequest.get('/vehicules/' + vehicule2._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);

                            expect(resContent.data.name).to.equal(vehicule2.name);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

                            expect(resContent.data.marqueId).to.be.a('string');
                            expect(resContent.data.marqueId).to.equal(_marque1._id);
                            expect(mongoose.Types.ObjectId.isValid(resContent.data.marqueId)).to.equal(true);

                            expect(resContent.data.modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data.modified));
                            var isValideDate = !isNaN(modifiedDate.valueOf());
                            expect(isValideDate).to.equal(true);

                            expect(resContent.data.version).to.equal(0);
                            done();
                        });
                });
        });
    });

    describe('Other vehicules marques', function(){
        var _mockVehiculeOtherMarque;
        var _marque2;

        beforeEach(function(done) {
            mockRequest.post('/marques')
                .send({
                    name: 'marqueName2',
                    description: 'marqueDescription2'
                })
                .end(function() {
                    mockRequest.get('/marques')
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
                            _marque2 = resContent.data[1];
                            _mockVehiculeOtherMarque = {
                                name: 'vehiculeName3',
                                description: 'vehiculeDescription3',
                                year: '2000',
                                marqueId: _marque2._id
                            };

                            mockRequest.post('/vehicules')
                                .send(_mockVehiculeOtherMarque)
                                .end(function() {
                                    done();
                                });
                        });
                });
        });

        it('Should get more vehicules haven different marques', function(done) {
            mockRequest.get('/vehicules')
                .end(function (err, res) {
                    var resContent = JSON.parse(res.text);
                    var vehiculeOtherMarque = resContent.data[1];

                    mockRequest.get('/vehicules/' + vehiculeOtherMarque._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);

                            expect(resContent.data.name).to.equal(vehiculeOtherMarque.name);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

                            expect(resContent.data.marqueId).to.be.a('string');
                            expect(resContent.data.marqueId).to.equal(_marque2._id);
                            expect(mongoose.Types.ObjectId.isValid(resContent.data.marqueId)).to.equal(true);

                            expect(resContent.data.modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data.modified));
                            var isValideDate = !isNaN(modifiedDate.valueOf());
                            expect(isValideDate).to.equal(true);

                            expect(resContent.data.version).to.equal(0);
                            done();
                        });
                });
        });
    });

    afterEach(function(){
        mockgoose.reset();
    });
});