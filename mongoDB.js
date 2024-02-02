// mongodb.js

const { MongoClient } = require('mongodb');

async function connectToMongoDB() {
    // Retrieve MongoDB connection URI from environment variable
    const uri = process.env.MONGODB_URI;

    // Create a new MongoClient
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        console.log("Connected to MongoDB");

        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Rethrow the error for handling in the calling code
    }
}

async function closeMongoDBConnection(client) {
    try {
        // Close the connection
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        throw error; // Rethrow the error for handling in the calling code
    }
}

module.exports = { connectToMongoDB, closeMongoDBConnection };