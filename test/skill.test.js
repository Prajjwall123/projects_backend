const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const server = require('../app.js');
const path = require('path');

describe("Skill API", function () {
    let skillId;

    it("should create a new skill", function (done) {
        request(server)
            .post("/api/skills")
            .set("Content-Type", "application/json")
            .send({ name: "Docker" })
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("message").that.equals("Skill created successfully");
                expect(res.body).to.have.property("skill").that.is.an("object");
                expect(res.body.skill).to.have.property("name").that.equals("Docker");
                expect(res.body.skill).to.have.property("_id").that.is.a("string");

                skillId = res.body.skill._id;
                done();
            });
    });

    it("should get all skills", function (done) {
        request(server)
            .get("/api/skills")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });

    it("should get a skill by ID", function (done) {
        request(server)
            .get(`/api/skills/${skillId}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("_id").that.equals(skillId);
                expect(res.body).to.have.property("name").that.equals("Docker");
                done();
            });
    });

    it("should update an existing skill", function (done) {
        request(server)
            .put(`/api/skills/${skillId}`)
            .set("Content-Type", "application/json")
            .send({ name: " Docker" })
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.have.property("message").that.equals("Skill updated successfully");
                done();
            });
    });

    it("should delete a skill successfully", function (done) {
        request(server)
            .delete(`/api/skills/${skillId}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.have.property("message").that.equals("Skill deleted successfully");

                request(server)
                    .get(`/api/skills/${skillId}`)
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property("message").that.equals("Skill not found");
                        done();
                    });
            });
    });

});
