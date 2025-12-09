import mongoose from "mongoose";

type connectionObj = {
    isConnected ?: number
}

const connection : connectionObj = {}


export async function dbConnect() : Promise <void> {
    if (connection.isConnected) {
        console.log("Already connected!!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {});
        
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connections: ",db.connections);
        
        console.log("DB : ",db);
        console.log("Database connected successfully!!");
    } catch (error) {

        console.log("DB Connection failed!!");
        console.log("Error is : ",error);
        process.exit(1);
    }
}