"use strict";

describe('404:api', function() {
    it('Should not get', function(done) {

        mockRequest.get('/urlNotExist')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(res.statusCode).to.equal(404);
                expect(resContent.code).to.equal(404);
                expect(resContent.data).to.equal('Not found');
                done();
            });
    });

    it('Should not post', function(done) {

        mockRequest.post('/urlNotExist')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(res.statusCode).to.equal(404);
                expect(resContent.code).to.equal(404);
                expect(resContent.data).to.equal('Not found');
                done();
            });
    });
    
    it('Should not put', function(done) {

        mockRequest.put('/urlNotExist')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(res.statusCode).to.equal(404);
                expect(resContent.code).to.equal(404);
                expect(resContent.data).to.equal('Not found');
                done();
            });
    });
    
    it('Should not delete', function(done) {

        mockRequest.delete('/urlNotExist')
            .end(function(err, res) {
                var resContent = JSON.parse(res.text);

                expect(res.statusCode).to.equal(404);
                expect(resContent.code).to.equal(404);
                expect(resContent.data).to.equal('Not found');
                done();
            });
    });
});