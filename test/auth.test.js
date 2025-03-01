const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const server = require('../app.js');
const path = require('path');
const OTPModel = require('../model/OTP.js');

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
                email: "testmaybelene@gmail.com",
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
                email: "newfreelancer@gmail.com",
                password: "password",
                role: "freelancer",
                skills: ["679b4fe07dbeac15d47c7ce1", "679b4fe07dbeac15d47c7ce1"],
                experienceYears: 5,
                availability: "Full-time",
                portfolio: "A skilled MERN stack developer...",
                freelancerName: "Test User",
                profileImage: "images/1740118653468-photo.jpeg"
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.equals('OTP sent to your email');
                done();
            });
    });

    it('should verify OTP successfully', function (done) {
        OTPModel.findOne({ email: "newfreelancer@gmail.com" })
            .then(otpRecord => {
                if (!otpRecord) return done(new Error("OTP not found for the given email"));
                request(server)
                    .post('/api/auth/verify-otp')
                    .send({
                        email: "newfreelancer@gmail.com",
                        otp: otpRecord.otp
                    })
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property("message").that.equals("Registration successful");
                        done();
                    });
            })
            .catch(err => done(err));
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
