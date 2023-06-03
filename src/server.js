const app = require('./app');
const os = require('os');
const batteryChecker = require('./utils/batteryCheck');
let server;

const startServer= () => {
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
    // Start the battery checker
    batteryChecker.start();
};

const closeServer = () => {
    if(server) {
        server.close();
        console.log('Server closed');
    }
};

startServer();