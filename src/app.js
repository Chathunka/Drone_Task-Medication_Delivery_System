const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const os = require('os');
const DB = require('./utils/databse');
const droneRoutes = require('./routes/droneRoutes');
const medicationRoutes = require('./routes/medicationRoutes');

dotenv.config();

//Initialise Express app
const app = express();

//Set Mongoose options
mongoose.set('strictQuery', false);

//Connect to MongoDB
DB.connectDB()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log("Failed to connect to MongoDB", error);
    process.exit(1);
})

//Parse JSON request bodies
app.use(express.json());

//Routes
app.use('/drones', droneRoutes);
app.use('/medications', medicationRoutes);

//Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal Server Error'});
});

module.exports = app;