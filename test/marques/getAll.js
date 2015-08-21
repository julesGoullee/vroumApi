"use strict";

var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

describe('Marques:GetAll', function() {
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

    it('Should get one marques', function(done) {

        mockRequest.get('/marques')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);
                expect(resContent.code).to.equal(200);
                expect(res.statusCode).to.equal(200);
                expect(resContent.data.length).to.equal(1);
                
                expect(resContent.data[0].name).to.equal(_mockMarques1.name);
                
                expect(resContent.data[0]._id).to.be.a('string');
                expect(mongoose.Types.ObjectId.isValid(resContent.data[0]._id)).to.equal(true);
                
                expect(resContent.data[0].modified).to.be.a('string');
                var modifiedDate = new Date(Date.parse(resContent.data[0].modified));
                var isValideDate = !isNaN(modifiedDate.valueOf());
                expect(isValideDate).to.equal(true);
                
                expect(resContent.data[0].version).to.equal(0);
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