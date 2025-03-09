
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI) {
    throw new Error("MONGODB_URI must be defined");
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { connect: null, promise: null }
}

export async function connectToDatabase() {
    if(cached.connect){
        return cached.connect;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        cached.connect = await cached.promise;
        return cached.connect;
    }
    catch(error) {
        throw error;
    }
}


 