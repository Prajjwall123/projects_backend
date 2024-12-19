const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/db_projectsyeti");
        console.log("Connected to mongodb")
    } catch (e) {
        console.log(e)
    }
}

module.exports = connectDB;