"use strict";
var mockgoose = require('mockgoose');

describe('VehiculeModel:Create', function() {

    var _marque;
    beforeEach(function(done){
        mockRequest.post('/marques')
            .send({
                name: 'marqueName11',
                description: 'marqueDescription1'
            })
            .end(function() {
                mockRequest.get('/marques')
                    .end(function(err, res){
                        var resContent = JSON.parse(res.text);
                        _marque = resContent.data[0];
                        done();
                    });
            });
    });

    it('Should add one vehicules', function(done) {
        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                description: 'vehiculeDescription1',
                year: '2007',
                marqueId: _marque._id
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(201);
                expect(res.statusCode).to.equal(201);
                expect(resContent.data).to.equal('Created vehicule');
                done();
            });
    });

    it('Should not add if not params', function(done) {
        mockRequest.post('/vehicules')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                done();
            });
    });

    it('Should not add if name params not found', function(done) {

        mockRequest.post('/vehicules')
            .send({
                description: 'vehiculeDescription1',
                year: 2007,
                marqueId: _marque._id
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                done();
            });
    });

    it('Should not add if description params not found', function(done) {

        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                year: 2007,
                marqueId: _marque._id
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                done();
            });
    });

    it('Should not add if year params not found or incorrect', function(done) {

        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                description: 'vehiculeDescription1',
                year: 'yearsIncorrect',
                marqueId: _marque._id
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                mockRequest.post('/vehicules')
                    .send({
                        name: 'vehiculeName1',
                        description: 'vehiculeDescription1',
                        marqueId: _marque._id
                    })
                    .end(function (err, res) {
                        var resContent = JSON.parse(res.text);

                        expect(resContent.code).to.equal(400);
                        expect(res.statusCode).to.equal(400);
                        expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                        done();
                    });
            });
    });
    
    it('Should not add if marqueId params not found or incorrect', function(done) {

        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                year: '2007',
                description: 'vehiculeDescription1'
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);
                var invalidMongoId = '55d45cb57e8450722b3b7dffXX';

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                mockRequest.post('/vehicules')
                    .send({
                        name: 'vehiculeName1',
                        year: '2007',
                        description: 'vehiculeDescription1',
                        marqueId: invalidMongoId
                    })
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);

                        expect(resContent.code).to.equal(400);
                        expect(res.statusCode).to.equal(400);
                        expect(resContent.data).to.equal('Missing/incorrect params name(String), description(String), marqueId(mongoObjectId), year(Int)');
                        done();
                    });
            });
    });
    
    it('Should not add if marqueId not matching marque documents', function(done) {
        var notFoundMongoId = '55d45cb57e8450722b3bFFff';

        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                description: 'vehiculeDescription1',
                year: '2007',
                marqueId: notFoundMongoId
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('MarqueId Not found');
                done();
            });
    });
    
    it('Should add two different vehicules', function(done) {
    
        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                description: 'vehiculeDescription1',
                year: '2007',
                marqueId: _marque._id
            })
            .end(function() {
                mockRequest.post('/vehicules')
                    .send({
                        name: 'vehiculeName2',
                        description: 'vehiculeDescription2',
                        year: '2007',
                        marqueId: _marque._id
                    })
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
    
                        expect(resContent.code).to.equal(201);
                        expect(res.statusCode).to.equal(201);
                        expect(resContent.data).to.equal('Created vehicule');
                        done();
                    });
            });
    });
    
    it('Should not add two same name vehicule', function(done) {
    
        mockRequest.post('/vehicules')
            .send({
                name: 'vehiculeName1',
                description: 'vehiculeDescription1',
                year: '2007',
                marqueId: _marque._id
            })
            .end(function() {
                mockRequest.post('/vehicules')
                    .send({
                        name: 'vehiculeName1',
                        description: 'vehiculeDescription1',
                        year: '2007',
                        marqueId: _marque._id
                    })
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);
    
                        expect(resContent.code).to.equal(409);
                        expect(res.statusCode).to.equal(409);
                        expect(resContent.data).to.equal('Vehicule Name already exist, it will unique');
                        done();
                    });
            });
    });

    afterEach(function(){
        mockgoose.reset();
    });
});