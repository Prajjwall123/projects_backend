const express = require("express");
const connectDb = require("./config/db");
const UserRoute = require("./routes/userRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const app = express();

connectDb();

app.use(express.json());
app.use("/api/users", UserRoute);
app.use("/api/freelancers", freelancerRoutes);

const port = 3000;
app.listen(port, () => {
    console.log('Server Running at http://localhost:3000');
});
