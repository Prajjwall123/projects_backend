const express = require("express")
const connectDB = require("./config/db")
const app = express()

connectDB();
const port = 3000;

app.listen(port, () => {
    console.log("app is running at port 3000")
})