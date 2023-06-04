const mongoose =require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongoServer;

//Connect to in-memory database.
const connect = async () => {
    if(mongoose.connection.readyState !==0){
        await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

//Drop database, Close connection, Strop MongoDB instance
const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

//Remove all data from collections
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

module.exports = {
    connect,
    closeDatabase,
    clearDatabase,
};