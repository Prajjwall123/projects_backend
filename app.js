const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const companyRoutes = require('../backend/routes/companyRoutes');
const projectsRoutes = require('../backend/routes/projectRoutes');
const AuthRouter = require('../backend/routes/AuthRoute');
const SkillsRouter = require('../backend/routes/skillsRoutes');
const BiddingRouter = require('../backend/routes/biddingRoutes');

const app = express();

connectDb();

require("dotenv").config();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/auth", AuthRouter);
app.use("/api/skills", SkillsRouter);
app.use("/api/biddings", BiddingRouter);

app.use('/images', express.static(path.join(__dirname, 'images')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});
