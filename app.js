const express = require("express")
const connectDb = require("./config/db")
const UserRoute = require("./routes/userRoute")
const app = express();


connectDb();

app.use(express.json());
app.use("/api/users", UserRoute);


const port = 3000;
app.listen(port, () => {
    console.log('Server Running at http://localhost:3000')
})