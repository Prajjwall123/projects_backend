const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const companyRoutes = require('../backend/routes/companyRoutes');
const projectsRoutes = require('../backend/routes/projectRoutes');
const AuthRouter = require('../backend/routes/AuthRoute');

const app = express();

connectDb();

require("dotenv").config();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/companys", companyRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/auth", AuthRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});
