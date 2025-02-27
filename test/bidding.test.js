const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const server = require('../app.js');
const path = require('path');

describe("Bidding API", function () {
    let token;

    before(async function () {
        const loginRes = await request(server)
            .post("/api/auth/login")
            .send({
                email: "pokhrelprajwal29@gmail.com",
                password: "password"
            });

        token = loginRes.body.token;
    });

    it("should create a new bidding with a PDF file", function (done) {
        request(server)
            .post("/api/biddings/create")
            .set("Authorization", `Bearer ${token}`)
            .field("freelancer", "67bffd43cdb00b3127d093a3")
            .field("project", "67c0252d4f6c641c47efc83d")
            .field("amount", "1500")
            .field("message", "Excited to work on this project!")
            .attach("proposalFile", path.join(__dirname, "test_resume.pdf"))
            .expect("Content-Type", /json/)
            .expect(201)
        done();
    });
});