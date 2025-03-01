const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const server = require('../app.js');

describe("Freelancer API", function () {
    it("should get a freelancer by ID", function (done) {
        const freelancerId = "67c30de8f9ab5cdaa2f414ec";

        request(server)
            .get(`/api/freelancers/${freelancerId}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("_id").that.equals(freelancerId);
                expect(res.body).to.have.property("freelancerName").that.is.a("string");
                expect(res.body).to.have.property("skills").that.is.an("array");

                done();
            });
    });

    it("should get all freelancers", function (done) {
        request(server)
            .get(`/api/freelancers/`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.greaterThan(0);

                res.body.forEach((freelancer) => {
                    expect(freelancer).to.be.an("object");
                    expect(freelancer).to.have.property("_id").that.is.a("string");
                    expect(freelancer).to.have.property("freelancerName").that.is.a("string");
                    expect(freelancer).to.have.property("skills").that.is.an("array");
                });

                done();
            });
    });

});
