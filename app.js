const express = require("express");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const companyRoutes = require('../backend/routes/companyRoutes');
const projectsRoutes = require('../backend/routes/projectRoutes');

const app = express();

// Database connection
connectDb();
//.env
require("dotenv").config();


app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/companys", companyRoutes);
app.use("/api/projects", projectsRoutes);

const port = 3000;
app.listen(port, () => {
    console.log('Server Running at http://localhost:3000');
});
