const express = require("express");
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/User');
const paymentsRoutes = require('./routes/Payments');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');
const contactUsRoute = require("./routes/Contact");

const { cloudinaryConnect } = require('./config/cloudinary');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const database = require("./config/database");

const PORT = process.env.PORT || 4000;

// Connecting to database
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(
    fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp",
	})
);

// connecting to cloudinary
cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentsRoutes);
app.use("/api/v1/reach", contactUsRoute);


// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
