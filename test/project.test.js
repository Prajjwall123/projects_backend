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


    it('should register a new company successfully and send OTP', function (done) {
        request(server)
            .post('/api/auth/register')
            .send({
                email: "sir.pokhrel@gmail.com",
                password: "password",
                role: "company",
                companyName: "test company",
                companyBio: "this is a test company",
                employees: "10",
                logo: "images/1740118653468-photo.jpeg"
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.equals('OTP sent to your email');
                done();
            });
    });

    it('should register a new freelancer successfully and send OTP', function (done) {
        request(server)
            .post('/api/auth/register')
            .send({
                email: "pokhrelprajwal29@gmail.com",
                password: "password",
                role: "freelancer",
                skills: ["679b4fe07dbeac15d47c7ce1", "679b4fe07dbeac15d47c7ce1"],
                experienceYears: 5,
                availability: "Full-time",
                portfolio: "A skilled MERN stack developer with 3 years of experience in building dynamic and scalable web applications. Specializing in MongoDB, Express.js, React, and Node.js, I have successfully developed and deployed multiple projects, ensuring high performance, security, and user-friendly interfaces. Passionate about problem-solving, API integration, and full-stack development, I thrive on creating efficient and modern web solutions. Whether you need a responsive website, a custom web app, or backend services, I am here to bring your ideas to life with clean and maintainable code. Let's collaborate!",
                freelancerName: "Test User",
                profileImage: "images/1738233976272-ss.png"
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.equals('OTP sent to your email');
                done();
            });
    });

    it('should verify OTP successfully', function (done) {
        request(server)
            .post('/api/auth/verify-otp')
            .send({
                email: "pokhrelprajwal29@gmail.com",
                otp: "834085"
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property("message").that.equals("OTP verified successfully");
                done();
            });
    });

    it("should login successfully and return a token", function (done) {
        request(server)
            .post("/api/auth/login")
            .send({
                email: "pokhrelprajwal29@gmail.com",
                password: "password"
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property("token").that.is.a("string");
                done();
            });
    });

});

describe("Skill API", function () {
    let skillId;

    it("should create a new skill", function (done) {
        request(server)
            .post("/api/skills")
            .set("Content-Type", "application/json")
            .send({ name: "UI/UX" })
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("message").that.equals("Skill created successfully");
                expect(res.body).to.have.property("skill").that.is.an("object");
                expect(res.body.skill).to.have.property("name").that.equals("UI/UX");
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
                expect(res.body).to.have.property("name").that.equals("UI/UX");
                done();
            });
    });

    it("should update an existing skill", function (done) {
        request(server)
            .put(`/api/skills/${skillId}`)
            .set("Content-Type", "application/json")
            .send({ name: " UI/UX" })
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