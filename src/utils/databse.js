const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

//get DB URI from the .env file
const uri = process.env.DB_URI;

// Connect to the database
const connectDB = async() =>{
    try{
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
    }catch(error){
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
}

// Disconnect from the database
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from the database');
    } catch (error) {
        console.error('Failed to disconnect from the database', error);
        process.exit(1);
    }
};

module.exports = { connectDB, disconnectDB };