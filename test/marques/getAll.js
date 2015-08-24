"use strict";

var mockgoose = require('mockgoose');

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
    
    describe('Two marque', function(){
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

    afterEach(function(){
        mockgoose.reset();
    });
});