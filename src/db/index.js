// Import the Mongoose library to interact with MongoDB.
import mongoose from "mongoose";

// Import the database name constant from the constants.js file.
import { DB_NAME } from "../constants.js";

// Define an asynchronous function to connect to the MongoDB database.
const connectDB = async () => {
    try {
        // Attempt to establish a connection to the MongoDB database.
        // The connection URI is built using the environment variable MONGODB_URI and the database name DB_NAME.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // If the connection is successful, log the MongoDB host to the console.
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // If the connection fails, log an error message to the console.
        console.log("MONGODB connection FAILED ", error);
        
        // Exit the process with a failure code (1), indicating that the application should terminate due to the error.
        process.exit(1);
    }
}

// Export the connectDB function as the default export of this module,
// making it available for use in other parts of the application.
export default connectDB;
