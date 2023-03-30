const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require('cors');

dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const hospitals = require('./routes/hospitals');
const appointments=require('./routes/appointments');
const auth= require('./routes/auth');

const app=express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());
app.use(cors());

//Mount routers
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/appointments',appointments);
app.use('/api/v1/auth',auth);

const PORT=process.env.PORT || 500;

const server = app.listen(PORT, () => {console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1));
  });