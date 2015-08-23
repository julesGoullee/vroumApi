"use strict";
var mockgoose = require('mockgoose');

describe('Marques:Delete',function(){
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
    
    it('Should delete one marque of one by _id', function(done) {

        mockRequest.get('/marques')
            .end(function(err, res) {
                var marque1 = JSON.parse(res.text).data[0];

                mockRequest.delete('/marques/' + marque1._id)
                    .end(function(err, res) {
                        
                        var resContent = JSON.parse(res.text);
                        expect(res.statusCode).to.equal(200);
                        expect(resContent.code).to.equal(200);
                        expect(resContent.data).to.equal('Delete');
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

        it('Should delete the first marques of several marques by _id', function(done) {

            mockRequest.get('/marques')
                .end(function(err, res) {
                    var marque1 = JSON.parse(res.text).data[0];

                    mockRequest.delete('/marques/' + marque1._id)
                        .end(function(err, res) {
                            var resContent = JSON.parse(res.text);
                            expect(res.statusCode).to.equal(200);
                            expect(resContent.code).to.equal(200);
                            expect(resContent.data).to.equal('Delete');
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
    
    afterEach(function(){
        mockgoose.reset();
    });
});