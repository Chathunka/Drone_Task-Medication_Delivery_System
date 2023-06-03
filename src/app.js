const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const os = require('os');

dotenv.config();

//Initialise Express app
const app = express();

//Parse JSON request bodies
app.use(express.json());

//Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal Server Error'});
});

//Start the Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const networkInterfaces = os.networkInterfaces();
    const addresses = networkInterfaces['Ethernet'] || networkInterfaces['Wi-Fi'] || [];
    const ipAddress = addresses.find((address) => address.family === 'IPv4')?.address;
  
    if (ipAddress) {
      console.log(`Server running at http://${ipAddress}:${port}`);
    } else {
      console.log(`Server running at http://localhost:${port}`);
    }
});

module.exports = server;