const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const server = require("../app.js");

describe("Project API Test Collection", function () {
    let token;
    let companyId;
    let projectId;

    before(async function () {
        const loginRes = await request(server)
            .post("/api/auth/login")
            .send({
                email: "sir.pokhrel@gmail.com",
                password: "password"
            });

        token = loginRes.body.token;
    });

    it("should get all projects", function (done) {
        request(server)
            .get("/api/projects")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should create a new project", function (done) {
        request(server)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "New Web App",
                category: ["67c020ce05479483218ef790"],
                requirements: "React, Node.js, MongoDB",
                description: "A full-stack web application",
                status: "posted",
                company: "67bffc1fd30e0cfd3442c81c",
                duration: "3"
            })
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("title").that.equals("New Web App");
                expect(res.body).to.have.property("category").that.is.an("array").that.includes("67c020ce05479483218ef790");
                expect(res.body).to.have.property("status").that.equals("posted");
                expect(res.body).to.have.property("company").that.equals("67bffc1fd30e0cfd3442c81c");
                expect(res.body).to.have.property("_id");

                projectId = res.body._id;
                done();
            });

    });

    it("should get projects by category", function (done) {
        const categoryId = "67c020ce05479483218ef790";

        request(server)
            .get(`/api/projects/category/${categoryId}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.greaterThan(0);

                done();
            });
    });



});