const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const server = require('../app.js');

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
