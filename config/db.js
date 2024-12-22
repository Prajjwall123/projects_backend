const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/db_projectsyeti", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Error connecting to MongoDB:", e.message);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = connectDB;
