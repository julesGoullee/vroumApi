"use strict";

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

describe('Marques:GetAll', function() {
    var _mockMarques1 = {
        name: 'marqueName1',
        description: 'marquesDescription1'
    };
    
    var _mockMarques2 = {
        name: 'marquesName2',
        description: 'marqueDescription2'
    };
    
    beforeEach(function(done) {
        mockRequest.post('/marques')
            .send(_mockMarques1)
            .end(function() {
                done();
            });
    });

    it('should get empty marques', function(done) {
        mockgoose.reset();
        mockRequest.get('/marques')
            .end(function(err,res) {
                var resContent = JSON.parse(res.text);
                expect(resContent.code).to.equal(200);
                expect(res.statusCode).to.equal(200);
                expect(resContent.data.length).to.equal(0);
                done();
            });
    });

    
    it('Should get one marques', function(done) {

        mockRequest.get('/marques')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);
                expect(resContent.code).to.equal(200);
                expect(res.statusCode).to.equal(200);
                expect(resContent.data.length).to.equal(1);
                
                expect(resContent.data[0].name).to.equal(_mockMarques1.name);
                done();
            });
    });
    
    describe('Two marques', function(){
        
        beforeEach(function(done) {
            mockRequest.post('/marques')
                .send(_mockMarques2)
                .end(function() {
                    done();
                });
        });
        
        it('Should get two marques', function(done) {
            mockRequest.get('/marques')
                .end(function(err, res) {
                    var resContent = JSON.parse(res.text);

                    expect(resContent.code).to.equal(200);
                    expect(res.statusCode).to.equal(200);
                    expect(resContent.data.length).to.equal(2);

                    expect(resContent.data[1].name).to.equal(_mockMarques2.name);
                    done();
                });
        });
    });
    
    describe('With include vehicules', function() {
        var _mockVehicule1;
        var _marque1;

        beforeEach(function(done) {
            mockRequest.get('/marques')
                .end(function(err, res) {
                    var resContent = JSON.parse(res.text);
                    _marque1 = resContent.data[0];
                    _mockVehicule1 = {
                        name: 'vehiculeName1',
                        description: 'vehiculeDescription1',
                        year: '2003',
                        marqueId: _marque1._id
                    };

                    mockRequest.post('/vehicules')
                        .send(_mockVehicule1)
                        .end(function() {
                            done();
                        });
                });
        });

        it('Should get one marque of one by _id', function(done) {

            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque1 = JSON.parse(res.text).data[0];

                    mockRequest.get('/marques?include=vehicules')
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);

                            expect(resContent.data[0].name).to.equal(marque1.name);
                            expect(resContent.data[0].description).to.equal(marque1.description);

                            expect(resContent.data[0]._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data[0]._id)).to.equal(true);

                            expect(resContent.data[0].modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data[0].modified));
                            var isValideDate = !isNaN(modifiedDate.valueOf());
                            expect(isValideDate).to.equal(true);

                            expect(resContent.data[0].version).to.equal(0);
                            expect(resContent.data[0].vehicules.length).to.equal(1);
                            expect(resContent.data[0].vehicules[0].name).to.equal(_mockVehicule1.name);
                            done();
                        });
                });
        });

        it('Should get one marque of one by _id with two vehicules', function(done) {
            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque1 = JSON.parse(res.text).data[0];
                    var vehicule2 = {
                        name: 'vehiculeName2',
                        description: 'vehiculeDescription2',
                        year: '2001',
                        marqueId: marque1._id
                    };
                    
                    mockRequest.post('/vehicules')
                        .send(vehicule2)
                        .end(function () {
                                mockRequest.get('/marques?include=vehicules')
                                    .end(function(err, res) {
                                        var resContent = JSON.parse(res.text);

                                        expect(res.statusCode).to.equal(200);
                                        expect(resContent.code).to.equal(200);

                                        expect(resContent.data[0].name).to.equal(marque1.name);
                                        expect(resContent.data[0].description).to.equal(marque1.description);

                                        expect(resContent.data[0]._id).to.be.a('string');
                                        expect(mongoose.Types.ObjectId.isValid(resContent.data[0]._id)).to.equal(true);

                                        expect(resContent.data[0].modified).to.be.a('string');
                                        var modifiedDate = new Date(Date.parse(resContent.data[0].modified));
                                        var isValideDate = !isNaN(modifiedDate.valueOf());
                                        expect(isValideDate).to.equal(true);

                                        expect(resContent.data.length).to.equal(1);
                                        expect(resContent.data[0].version).to.equal(0);
                                        expect(resContent.data[0].vehicules.length).to.equal(2);
                                        expect(resContent.data[0].vehicules[0].name).to.equal(_mockVehicule1.name);
                                        expect(resContent.data[0].vehicules[1].name).to.equal(vehicule2.name);
                                        done();
                                    });
                        });
                });
            
        });
        
        describe('Two marques', function(){
            var _mockVehicule2;
            var _marque2;

            beforeEach(function(done) {
                mockRequest.post('/marques')
                    .send(_mockMarques2)
                    .end(function() {
                        mockRequest.get('/marques')
                            .end(function(err, res){
                                _marque2 = JSON.parse(res.text).data[1];
                                _mockVehicule2 = {
                                    name: 'vehiculeName2',
                                    description: 'vehiculeDescription2',
                                    year: '2001',
                                    marqueId: _marque2._id
                                };

                                mockRequest.post('/vehicules')
                                    .send(_mockVehicule2)
                                    .end(function() {
                                        done();
                                    });
                            });
                    });
            });

            it('Should get marques with Vehicules', function(done) {


                mockRequest.get('/marques?include=vehicules')
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
                        
                        expect(resContent.code).to.equal(200);
                        expect(res.statusCode).to.equal(200);
                        
                        var marque1 = resContent.data[0];
                        expect(marque1.name).to.equal(_marque1.name);

                        expect(marque1._id).to.be.a('string');
                        expect(mongoose.Types.ObjectId.isValid(marque1._id)).to.equal(true);

                        expect(marque1.modified).to.be.a('string');
                        var modifiedDate = new Date(Date.parse(marque1.modified));
                        var isValideDate = !isNaN(modifiedDate.valueOf());
                        expect(isValideDate).to.equal(true);

                        expect(marque1.version).to.equal(0);
                        expect(marque1.vehicules[0].name).to.equal(_mockVehicule1.name);


                        var marque2 = resContent.data[1];
                        expect(marque2.name).to.equal(_marque2.name);

                        expect(marque2._id).to.be.a('string');
                        expect(mongoose.Types.ObjectId.isValid(marque2._id)).to.equal(true);

                        expect(marque2.modified).to.be.a('string');
                        modifiedDate = new Date(Date.parse(marque2.modified));
                        isValideDate = !isNaN(modifiedDate.valueOf());
                        expect(isValideDate).to.equal(true);

                        expect(marque2.version).to.equal(0);
                        expect(marque2.vehicules[0].name).to.equal(_mockVehicule2.name);
                        done();
                    });
                });

        });
    });
    
    afterEach(function(){
        mockgoose.reset();
    });
});