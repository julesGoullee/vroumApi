"use strict";

var mockgoose = require('mockgoose');

describe('Vehicules:GetAll', function() {
   
    var _marque1;
    var _mockVehicule1;
    var _mockVehicule2;
    beforeEach(function(done) {
        mockRequest.post('/marques')
            .send({
                name: 'marquesName1',
                description: 'marquesDescription1'
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

    it('Should get one vehicule', function(done) {

        mockRequest.get('/vehicules')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);
                expect(resContent.code).to.equal(200);
                expect(res.statusCode).to.equal(200);
                expect(resContent.data.length).to.equal(1);
                expect(resContent.data[0].name).to.equal(_mockVehicule1.name);
                
                done();
            });
    });
    
    describe('Two vehicules', function() {
        beforeEach(function(done) {
            mockRequest.post('/vehicules')
                .send(_mockVehicule2)
                .end(function() {
                    done();
                });
        });
        
        it('Should get two vehicules', function(done) {
            mockRequest.get('/vehicules')
                .end(function(err, res) {
                    var resContent = JSON.parse(res.text);
                    expect(resContent.code).to.equal(200);
                    expect(res.statusCode).to.equal(200);
                    expect(resContent.data.length).to.equal(2);

                    expect(resContent.data[1].name).to.equal(_mockVehicule2.name);
                    done();
                });
        });
        
        describe('Multiple marques', function() {
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
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
                        expect(resContent.code).to.equal(200);
                        expect(res.statusCode).to.equal(200);
                        expect(resContent.data.length).to.equal(3);

                        expect(resContent.data[2].name).to.equal(_mockVehiculeOtherMarque.name);
                        expect(resContent.data[2].marqueId).not.to.equal(resContent.data[1].marqueId);
                        done();
                    });
            });
            
        });
    });

    afterEach(function(){
        mockgoose.reset();
    });
});