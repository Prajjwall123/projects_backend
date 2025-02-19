const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const companyRoutes = require("./routes/companyRoutes");
const projectsRoutes = require("./routes/projectRoutes");
const AuthRouter = require("./routes/AuthRoute");
const SkillsRouter = require("./routes/skillsRoutes");
const BiddingRouter = require("./routes/biddingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();
require("dotenv").config();

connectDb();

const corsOptions = {
    origin: "http://localhost:5174",
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
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);


app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});
