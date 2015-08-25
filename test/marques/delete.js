"use strict";
var mockgoose = require('mockgoose');

describe('Marques:Delete',function(){
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
    
    it('Should delete one marque of one by _id', function(done) {

        mockRequest.get('/marques')
            .end(function(err, res) {
                var marque1 = JSON.parse(res.text).data[0];

                mockRequest.delete('/marques/' + marque1._id)
                    .end(function(err, res) {
                        
                        var resContent = JSON.parse(res.text);
                        expect(res.statusCode).to.equal(200);
                        expect(resContent.code).to.equal(200);
                        expect(resContent.data).to.equal('Deleted marque');
                        mockRequest.get('/marques/' + marque1._id)
                            .end(function(err, res) {
                                var resContent = JSON.parse(res.text);
                                expect(res.statusCode).to.equal(404);
                                expect(resContent.code).to.equal(404);
                                expect(resContent.data).to.equal('Marque Not found');
                                done();
                            });
                    });
            });
    });
    
    it('Should not delete if id params invalid format mongoId', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dffXX';

        mockRequest.delete('/marques/' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Id params format incorrect');
                done();
            });
    });

    it('Should not delete if id not found', function(done) {

        var invalidMongoId = '55d45cb57e8450722b3b7dff';

        mockRequest.delete('/marques/' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(404);
                expect(res.statusCode).to.equal(404);
                expect(resContent.data).to.equal('Id marque Not found');
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

        it('Should delete the first marque of several marques by _id', function(done) {

            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque1 = JSON.parse(res.text).data[0];

                    mockRequest.delete('/marques/' + marque1._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
                            expect(resContent.data).to.equal('Deleted marque');
                            mockRequest.get('/marques/' + marque1._id)
                                .end(function(err, res) {
                                    var resContent = JSON.parse(res.text);
                                    expect(res.statusCode).to.equal(404);
                                    expect(resContent.code).to.equal(404);
                                    expect(resContent.data).to.equal('Marque Not found');
                                    done();
                                });
                        });
                });
        });

    });
    
    describe('With vehicules', function(){
        var _mockVehicule1;
        var _marque;
        
        beforeEach(function(done) {
            mockRequest.post('/marques')
                .send(_mockMarques1)
                .end(function() {
                    mockRequest.get('/marques')
                        .end(function (err, res) {
                            var resContent = JSON.parse(res.text);
                            _marque = resContent.data[0];
                            _mockVehicule1 = {
                                name: 'vehiculeName1',
                                description: 'vehiculeDescription1',
                                year: '2007',
                                marqueId: _marque._id
                            };
        
                            mockRequest.post('/vehicules')
                                .send(_mockVehicule1)
                                .end(function () {
                                    done();
                                });
                        });
            });
        });
        
        it('Should not remove marque if contains one vehicule', function(done) {
            mockRequest.delete('/marques/' + _marque._id)
                .end(function (err, res) {
                    var resContent = JSON.parse(res.text);
                    expect(res.statusCode).to.equal(400);
                    expect(resContent.code).to.equal(400);
                    expect(resContent.data).to.equal('Connot deleted marque with one or more vehicule. Actual: 1.');
                    done();
                });
        });

        it('Should not remove marque if contains two vehicules', function(done) {
            _mockVehicule1 = {
                name: 'vehiculeName2',
                description: 'vehiculeDescription2',
                year: '2000',
                marqueId: _marque._id
            };

            mockRequest.post('/vehicules')
                .send(_mockVehicule1)
                .end(function () {
                    mockRequest.delete('/marques/' + _marque._id)
                        .end(function (err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(400);
                            expect(resContent.code).to.equal(400);
                            expect(resContent.data).to.equal('Connot deleted marque with one or more vehicule. Actual: 2.');
                            done();
                        });
                });
            
        });

        it('Should remove marque was vehicule', function(done) {

            mockRequest.get('/vehicules')
                .end(function (err, res) {
                    var resContent = JSON.parse(res.text);
                    var vehicule = resContent.data[0];
                    
                    mockRequest.delete('/vehicules/' + vehicule._id)
                        .end(function (err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
                            expect(resContent.data).to.equal('Deleted vehicule');
                            
                            mockRequest.delete('/marques/' + _marque._id)
                                .end(function (err, res) {
                                    var resContent = JSON.parse(res.text);
                                    expect(res.statusCode).to.equal(200);
                                    expect(resContent.code).to.equal(200);
                                    expect(resContent.data).to.equal('Deleted marque');
                                    done();
                                });
                        });
                });

        });
        
        afterEach(function(){
            mockgoose.reset('vehicule');
        });
    });
    
    afterEach(function(){
        mockgoose.reset();
    });
});