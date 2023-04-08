const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const helmet=require('helmet')
const xss=require('xss-clean')
const rateLimit=require('express-rate-limit')
const hpp=require('hpp')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const hospitals = require('./routes/hospitals');
const appointments=require('./routes/appointments');
const auth= require('./routes/auth');
const app=express();
const mongoSanitize = require('express-mongo-sanitize')
const limiter=rateLimit({
  windowMs:10*60*1000,
  max:100
})

const swaggerOptions={
  swaggerDefinition:{
      openapi: '3.0.0',
      info: {
          title: 'Library API',
          version: '1.0.0',
          description: 'A simple Express VacQ API'
      },
      servers:[
          {
              url: 'http://localhost:5000/api/v1'
          }
      ],
  },
  apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());
app.use(cors());

//Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());

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