"use strict";
var mockgoose = require('mockgoose');

describe('Marques:Create', function() {


    it('Should add one marque', function(done) {

        mockRequest.post('/marques')
            .send({
                name: 'marqueName1',
                description: 'marqueName1'
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(201);
                expect(res.statusCode).to.equal(201);
                expect(resContent.data).to.equal('Create');
                done();
            });
    });

    it('Should not add if not params', function(done) {
        mockRequest.post('/marques')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing params name or description');
                done();
            });
    });

    it('Should not add if name params not found', function(done) {

        mockRequest.post('/marques')
            .send({
                description: 'marqueName1'
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing params name or description');
                done();
            });
    });

    it('Should not add if description params not found', function(done) {

        mockRequest.post('/marques')
            .send({
                name: 'marqueName1'
            })
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(resContent.code).to.equal(400);
                expect(res.statusCode).to.equal(400);
                expect(resContent.data).to.equal('Missing params name or description');
                done();
            });
    });

    it('Should add two different marques', function(done) {

        mockRequest.post('/marques')
            .send({
                name: 'marqueName1',
                description: 'marqueName1'
            })
            .end(function() {
                mockRequest.post('/marques')
                    .send({
                        name: 'marqueName2',
                        description: 'marqueName2'
                    })
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);

                        expect(resContent.code).to.equal(201);
                        expect(res.statusCode).to.equal(201);
                        expect(resContent.data).to.equal('Create');
                        done();
                    });
            });
    });

    it('Should not add two same name marques', function(done) {

        mockRequest.post('/marques')
            .send({
                name: 'marqueName1',
                description: 'marqueName1'
            })
            .end(function() {
                mockRequest.post('/marques')
                    .send({
                        name: 'marqueName1',
                        description: 'marqueName2'
                    })
                    .end(function(err, res) {
                        var resContent = JSON.parse(res.text);

                        expect(resContent.code).to.equal(409);
                        expect(res.statusCode).to.equal(409);
                        expect(resContent.data).to.equal('Name already exist, it will unique');
                        done();
                    });
            });
    });

    afterEach(function(){
        mockgoose.reset();
    });
});