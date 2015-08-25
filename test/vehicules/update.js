"use strict";

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');


describe('VehiculeModel:Update', function() {
    var _marque1;
    var _mockVehicule1;
    var _mockVehicule2;
    
    beforeEach(function(done){
        mockRequest.post('/marques')
            .send({
                name: 'marqueName1',
                description: 'marqueDescription1'
            })
            .end(function() {
                mockRequest.get('/marques')
                    .end(function(err, res){
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

    it('Should update name and description vehicule of one by _id', function(done) {

        mockRequest.get('/vehicules')
            .end(function(err, res) {
                var vehicule1 = JSON.parse(res.text).data[0];
                mockRequest.put('/vehicules/' + vehicule1._id)
                    .send({
                        name: 'vehiculeName1Updated1',
                        description: 'vehiculeName1Updated1',
                        year: '2009',
                        marqueId: vehicule1.marqueId
                    })
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
                        expect(res.statusCode).to.equal(200);
                        expect(resContent.code).to.equal(200);

                        expect(resContent.data).to.equal('Updated vehicule');
                        mockRequest.get('/vehicules/' + vehicule1._id)
                            .end(function(err, res) {
                                var resContent = JSON.parse(res.text);
                                expect(res.statusCode).to.equal(200);
                                expect(resContent.code).to.equal(200);
                                expect(resContent.data.name).to.equal('vehiculeName1Updated1');
                                expect(resContent.data.description).to.equal('vehiculeName1Updated1');
                                expect(resContent.data.year).to.equal(2009);
                                expect(resContent.data.marqueId).to.equal(vehicule1.marqueId);
                                expect(resContent.data.marqueId).to.equal(_marque1._id);

                                //expect(resContent.data.modified).not.to.equal(resContent.data.modified);
                                //TODO fakeTime && test modifed time
                                expect(resContent.data.version).to.equal(1);
                                done();
                            });
                    });
            });
    });
    
    it('Should update one marque version 2', function(done) {

        mockRequest.get('/vehicules')
            .end(function(err, res) {
                var vehicule1 = JSON.parse(res.text).data[0];
                mockRequest.put('/vehicules/' + vehicule1._id)
                    .send({
                        name: 'vehiculeName1Updated1',
                        description: 'vehiculeName1Updated1',
                        year: '2009',
                        marqueId: vehicule1.marqueId
                    })
                    .end(function(err, res) {

                        var resContentUpdated1 = JSON.parse(res.text);
                        expect(res.statusCode).to.equal(200);
                        expect(resContentUpdated1.code).to.equal(200);

                        expect(resContentUpdated1.data).to.equal('Updated vehicule');
                        mockRequest.get('/vehicules/' + vehicule1._id)
                            .end(function(err, res) {
                                var resContentUpdate1 = JSON.parse(res.text);
                                expect(res.statusCode).to.equal(200);
                                expect(resContentUpdate1.code).to.equal(200);
                                expect(resContentUpdate1.data.name).to.equal('vehiculeName1Updated1');
                                expect(resContentUpdate1.data.description).to.equal('vehiculeName1Updated1');
                                expect(resContentUpdate1.data.year).to.equal(2009);
                                expect(resContentUpdate1.data.marqueId).to.equal(vehicule1.marqueId);
                                //expect(resContent.data.modified).not.to.equal(resContent.data.modified);
                                //TODO fakeTime && test modifed time
                                expect(resContentUpdate1.data.version).to.equal(1);
                                mockRequest.put('/vehicules/' + vehicule1._id)
                                    .send({
                                        name: 'vehiculeName1Updated2',
                                        description: 'vehiculeName1Updated2',
                                        year: '2009',
                                        marqueId: vehicule1.marqueId
                                    })
                                    .end(function (err, res) {
                                        var resContentUpdated2 = JSON.parse(res.text);
                                        expect(res.statusCode).to.equal(200);
                                        expect(resContentUpdated2.code).to.equal(200);

                                        expect(resContentUpdated2.data).to.equal('Updated vehicule');
                                        mockRequest.get('/vehicules/' + vehicule1._id)
                                            .end(function (err, res) {
                                                var resContentUpdate2 = JSON.parse(res.text);
                                                expect(res.statusCode).to.equal(200);
                                                expect(resContentUpdate2.code).to.equal(200);
                                                expect(resContentUpdate2.data.name).to.equal('vehiculeName1Updated2');
                                                expect(resContentUpdate2.data.description).to.equal('vehiculeName1Updated2');
                                                expect(resContentUpdate2.data.year).to.equal(2009);
                                                expect(resContentUpdate2.data.marqueId).to.equal(vehicule1.marqueId);
                                                //expect(resContent.data.modified).not.to.equal(resContent.data.modified);
                                                //TODO fakeTime && test modifed time
                                                expect(resContentUpdate2.data.version).to.equal(2);
                                                
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
    
    it('Should not update if id params invalid format mongoId', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dffXX';

        mockRequest.put('/vehicules/' + invalidMongoId)
            .send({
                name: 'vehiculeName1Updated1',
                description: 'vehiculeName1Updated1',
                year: '2009',
                marqueId: _mockVehicule1.marqueId
            })
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                done();
            });
    });

    it('Should not update if id not found', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dff';

        mockRequest.put('/vehicules/' + invalidMongoId)
            .send({
                name: 'vehiculeName1Updated1',
                description: 'vehiculeName1Updated1',
                year: '2009',
                marqueId: _mockVehicule1.marqueId
            })
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(404);
                expect(res.statusCode).to.equal(404);
                expect(resContent.data).to.equal('Id vehicule Not found');
                done();
            });
    });
    
    it('Should not update if marqueId not found', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dff';

        mockRequest.put('/vehicules/' + _mockVehicule1.marqueId)
            .send({
                name: 'vehiculeName1Updated',
                description: 'vehiculeDescription1Updated',
                year: '2009',
                marqueId: invalidMongoId
            })
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('MarqueId Not found');
                done();
            });
    });
    
    describe('Two vehicules same marque', function(){
        beforeEach(function(done) {
            mockRequest.post('/vehicules')
                .send(_mockVehicule2)
                .end(function() {
                    done();
                });
        });
    
        it('Should update the first vehicule of several vehicules by _id', function(done) {

            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule1 = JSON.parse(res.text).data[0];
    
                    mockRequest.put('/vehicules/' + vehicule1._id)
                        .send({
                            name: 'vehiculeName1Updated',
                            description: 'vehiculeDescription1Updated',
                            year: '2009',
                            marqueId: vehicule1.marqueId
                        })
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
    
                            expect(resContent.data).to.equal('Updated vehicule');
                            mockRequest.get('/vehicules/' + vehicule1._id)
                                .end(function(err, res) {
                                    var resContent = JSON.parse(res.text);
                                    expect(res.statusCode).to.equal(200);
                                    expect(resContent.code).to.equal(200);
                                    expect(resContent.data.name).to.equal('vehiculeName1Updated');
                                    expect(resContent.data.year).to.equal(2009);
                                    expect(resContent.data.version).to.equal(1);
                                    done();
                                });
                        });
                });
        });
    
        it('Should not update the first vehicule of several vehicules by _id if other as same name', function(done) {
    
            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule1 = JSON.parse(res.text).data[0];
                    mockRequest.put('/vehicules/' + vehicule1._id)
                        .send({
                            name: 'vehiculeName2',
                            description: 'vehiculeDescription1Update',
                            year: '2009',
                            marqueId: vehicule1.marqueId
                        })
                        .end(function(err, res) {
    
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
    
                            expect(resContent.data).to.equal('Updated vehicule');
                            //TODO mockgoose not suppported index unique :'(

                            //mockRequest.get('/vehicules')
                            //    .end(function(err, res) {
                                    //var resContent = JSON.parse(res.text);
                                    //console.log(resContent);
                                    //expect(res.statusCode).to.equal(409);
                                    //expect(resContent.code).to.equal(409);

                                    //expect(resContent.data[0].name).not.to.equal(resContent.data[1].name);
                                    done();
                                //});
                        });
                });
        });
        
        it('Should get the seconde vehicule of several vehicules by _id', function(done) {
        
            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule2 = JSON.parse(res.text).data[1];
        
                    mockRequest.get('/vehicules/' + vehicule2._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
        
                            expect(resContent.code).to.equal(200);
                            expect(res.statusCode).to.equal(200);
        
                            expect(resContent.data.name).to.equal(vehicule2.name);
        
                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);
                            expect(resContent.data._id).to.equal(vehicule2._id);

                            expect(resContent.data.year).to.equal(vehicule2.year);
                            expect(resContent.data.marqueId).to.equal(_marque1._id);

                            expect(resContent.data.modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data.modified.toString()));
                            var isValideDate = !isNaN(modifiedDate.valueOf());
                            expect(isValideDate).to.equal(true);
        
                            expect(resContent.data.version).to.equal(0);
                            done();
                        });
                });
        });
    });
    
    describe('Two vehicules different marques', function(){
        var _mockVehicule3;
        var _marque2;
        
        beforeEach(function(done){
            mockRequest.post('/marques')
                .send({
                    name: 'marqueName2',
                    description: 'marqueDescription2'
                })
                .end(function() {
                    mockRequest.get('/marques')
                        .end(function(err, res){
                            var resContent = JSON.parse(res.text);
                            _marque2 = resContent.data[1];
                            _mockVehicule3 = {
                                name: 'vehiculeName3',
                                description: 'vehiculeDescription3',
                                year: '2003',
                                marqueId: _marque2._id
                            };

                            mockRequest.post('/vehicules')
                                .send(_mockVehicule3)
                                .end(function() {
                                    done();
                                });
                        });
                });
        });

        it('Should update the first vehicule of several vehicules by _id', function(done) {

            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule1 = JSON.parse(res.text).data[0];

                    mockRequest.put('/vehicules/' + vehicule1._id)
                        .send({
                            name: 'vehiculeName1Updated',
                            description: 'vehiculeDescription1Updated',
                            year: '2009',
                            marqueId: vehicule1.marqueId
                        })
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);

                            expect(resContent.data).to.equal('Updated vehicule');
                            mockRequest.get('/vehicules/' + vehicule1._id)
                                .end(function(err, res) {
                                    var resContent = JSON.parse(res.text);
                                    expect(res.statusCode).to.equal(200);
                                    expect(resContent.code).to.equal(200);
                                    expect(resContent.data.marqueId).to.equal(_marque1._id);
                                    expect(_mockVehicule3.marqueId).to.equal(_marque2._id);
                                    
                                    done();
                                });
                        });
                });
        });

        it('Should change the first vehicule', function(done) {

            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule1 = JSON.parse(res.text).data[0];
                    mockRequest.put('/vehicules/' + vehicule1._id)
                        .send({
                            name: 'vehiculeName1Update1',
                            description: 'vehiculeDescription1Update1',
                            year: '2009',
                            marqueId: _marque2._id
                        })
                        .end(function(err, res) {

                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
                            expect(resContent.data).to.equal('Updated vehicule');

                            mockRequest.get('/vehicules/' + vehicule1._id)
                                .end(function(err, res) {
                                    var resContent = JSON.parse(res.text);
                                    expect(res.statusCode).to.equal(200);
                                    expect(resContent.code).to.equal(200);
                                    expect(resContent.data.marqueId).to.equal(_marque2._id);
                                    expect(_mockVehicule3.marqueId).to.equal(_marque2._id);

                                    done();
                                });
                        });
                });
        });

        it('Should get the seconde vehicules of several vehicules by _id', function(done) {
        
            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule3 = JSON.parse(res.text).data[1];
        
                    mockRequest.get('/vehicules/' + vehicule3._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);

                            expect(resContent.code).to.equal(200);
                            expect(res.statusCode).to.equal(200);

                            expect(resContent.data.name).to.equal(vehicule3.name);

                            expect(resContent.data._id).to.be.a('string');
                            expect(mongoose.Types.ObjectId.isValid(resContent.data._id)).to.equal(true);
                            expect(resContent.data._id).to.equal(vehicule3._id);

                            expect(resContent.data.year).to.equal(vehicule3.year);
                            expect(resContent.data.marqueId).to.equal(_marque2._id);

                            expect(resContent.data.modified).to.be.a('string');
                            var modifiedDate = new Date(Date.parse(resContent.data.modified.toString()));
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