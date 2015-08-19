"use strict";

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

describe('Marques:GetOne', function() {
    var _mockMarques1 = {
        name: 'marquesName1',
        description: 'marquesDescription1'
    };
    var _mockMarques2 = {
        name: 'marquesName2',
        description: 'marquesDescription2'
    };
    
    beforeEach(function(done) {
        mockRequest.post('/marques')
            .send(_mockMarques1)
            .end(function() {
                done();
            });
    });

    it('Should get one marques of one by _id', function(done) {

        mockRequest.get('/marques')
            .end(function(err, res) {
                var marque1 = JSON.parse(res.text).data[0];
                
                mockRequest.put('/marques?id=' + marque1._id)
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
    
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
    
    it('Should not get if id params is not defined', function(done) {
        mockRequest.put('/marques?id=')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Id params format incorrect');
                mockRequest.put('/marques')
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);

                        expect(resContent.code).to.equal(400);
                        expect(res.statusCode).to.equal(400);
                        expect(resContent.data).to.equal('Id params format incorrect');
                        done();
                    });
            });
    });

    it('Should not get if id params invalid mongoId', function(done) {
        
        var invalidMongoId = '55d45cb57e8450722b3b7dffXX';
        
        mockRequest.put('/marques?id=' + invalidMongoId)
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

        mockRequest.put('/marques?id=' + invalidMongoId)
            .end(function (err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(404);
                expect(res.statusCode).to.equal(404);
                expect(resContent.data).to.equal('Not found');
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

                    mockRequest.put('/marques?id=' + marque1._id)
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

                    mockRequest.put('/marques?id=' + marque2._id)
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

    afterEach(function(){
        mockgoose.reset();
    });
});