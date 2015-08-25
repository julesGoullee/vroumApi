"use strict";
var mockgoose = require('mockgoose');

describe('Vehicules:Delete',function(){
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
    
    it('Should delete one vehicule of one by _id', function(done) {

        mockRequest.get('/vehicules')
            .end(function(err, res) {
                var vehicule1 = JSON.parse(res.text).data[0];

                mockRequest.delete('/vehicules/' + vehicule1._id)
                    .end(function(err, res) {
                        
                        var resContent = JSON.parse(res.text);
                        expect(res.statusCode).to.equal(200);
                        expect(resContent.code).to.equal(200);
                        expect(resContent.data).to.equal('Deleted vehicule');
                        mockRequest.get('/vehicules/' + vehicule1._id)
                            .end(function(err, res) {
                                var resContent = JSON.parse(res.text);
                                expect(res.statusCode).to.equal(404);
                                expect(resContent.code).to.equal(404);
                                expect(resContent.data).to.equal('Vehicule Not found');
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

        mockRequest.delete('/vehicules/' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(404);
                expect(res.statusCode).to.equal(404);
                expect(resContent.data).to.equal('Id vehicule Not found');
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
    
        it('Should delete the first vehicule of several vehicules by _id', function(done) {
    
            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var vehicule1 = JSON.parse(res.text).data[0];
    
                    mockRequest.delete('/vehicules/' + vehicule1._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
                            expect(resContent.data).to.equal('Deleted vehicule');
                            mockRequest.get('/vehicules/' + vehicule1._id)
                                .end(function(err, res) {
                                    var resContent = JSON.parse(res.text);
                                    expect(res.statusCode).to.equal(404);
                                    expect(resContent.code).to.equal(404);
                                    expect(resContent.data).to.equal('Vehicule Not found');
                                    done();
                                });
                        });
                });
        });
    
    });
    
    afterEach(function(){
        mockgoose.reset();
    });
});