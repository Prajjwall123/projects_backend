const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const server = require('../app.js');
const path = require('path');

describe('/First Test Collection', function () {
    it('test get all projects route...', function (done) {
        request(server)
            .get('/api/projects')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});

describe('/Auth API Tests', function () {

    it('should upload an image and return the URL', function (done) {
        request(server)
            .post('/api/auth/upload')
            .attach('image', path.join(__dirname, 'test-image.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('imageUrl');
                expect(res.body.imageUrl).to.be.a('string');
                done();
            });
    });
});