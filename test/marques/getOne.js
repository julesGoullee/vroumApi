"use strict";

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

describe('Marques:GetOne', function() {
    var _mockMarques1 = {
        name: 'marqueName1',
        description: 'marqueDescription1'
    };
    var _mockMarques2 = {
        name: 'marqueName2',
        description: 'marqueDescription2'
    };
    
    beforeEach(function(done) {
        mockRequest.post('/marques')
            .send(_mockMarques1)
            .end(function() {
                done();
            });
    });

    it('Should get one marque of one by _id', function(done) {

        mockRequest.get('/marques')
            .end(function(err, res) {
                var marque1 = JSON.parse(res.text).data[0];
                
                mockRequest.get('/marques/' + marque1._id)
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
                        
                        expect(res.statusCode).to.equal(200);
                        expect(resContent.code).to.equal(200);
    
                        expect(resContent.data.name).to.equal(marque1.name);
    
                        expect(resContent.data._id).to.be.a('string');
                        expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);
    
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
        
        mockRequest.get('/marques/' + invalidMongoId)
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

        mockRequest.get('/marques/' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(404);
                expect(res.statusCode).to.equal(404);
                expect(resContent.data).to.equal('Marque Not found');
                done();
            });
    });
    
    describe('Two marque', function(){
        beforeEach(function(done) {
            mockRequest.post('/marques')
                .send(_mockMarques2)
                .end(function() {
                    done();
                });
        });
        
        it('Should get the first marques of several marques by _id', function(done) {

            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque1 = JSON.parse(res.text).data[0];

                    mockRequest.get('/marques/' + marque1._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(resContent.code).to.equal(200);
                            expect(res.statusCode).to.equal(200);

                            expect(resContent.data.name).to.equal(marque1.name);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

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

            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque2 = JSON.parse(res.text).data[1];

                    mockRequest.get('/marques/' + marque2._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(resContent.code).to.equal(200);
                            expect(res.statusCode).to.equal(200);

                            expect(resContent.data.name).to.equal(marque2.name);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

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
    
    describe('With vehicule', function(){
        var _mockVehicule;
        var _marque1;
    
        beforeEach(function(done) {
            mockRequest.get('/marques')
                .end(function(err, res) {
                    var resContent = JSON.parse(res.text);
                    _marque1 = resContent.data[0];
                    _mockVehicule = {
                        name: 'vehiculeName1',
                        description: 'vehiculeDescription1',
                        year: '2003',
                        marqueId: _marque1._id
                    };

                    mockRequest.post('/vehicules')
                        .send(_mockVehicule)
                        .end(function() {
                            done();
                        });
                });
        });

        it.only('Should get one marque of one by _id with', function(done) {

            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque1 = JSON.parse(res.text).data[0];

                    mockRequest.get('/marques/' + marque1._id + '?include=vehicules')
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);

                            expect(resContent.data.name).to.equal(marque1.name);
                            expect(resContent.data.description).to.equal(marque1.description);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);

                            expect(resContent.data.modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data.modified));
                            var isValideDate = !isNaN(modifiedDate.valueOf());
                            expect(isValideDate).to.equal(true);

                            expect(resContent.data.version).to.equal(0);
                            expect(resContent.data.vehicules.length).to.equal(1);
                            expect(resContent.data.vehicules[0].name).to.equal(_mockVehicule.name);
                            done();
                        });
                });
        });
    });

    afterEach(function(){
        mockgoose.reset();
    });
});