import { log } from "console";
import mongoose from "mongoose";

if (!process.env.DB_URL) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI  = process.env.DB_URL;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let globalWithMongoose =  {mongoose};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {


  if (cached.conn) {
    console.log("here 2");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };


    console.log("here 4");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }

  console.log("here 5",MONGODB_URI);
  console.log("Connected to MongoDB");
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;