import mongoose from "mongoose";

let isConnected = false;
export async function MongoDBConnection() {
  const URI = process.env.MONGODB_URI;
  if (!URI) {
    console.log("❌ Please set MONGODB_URI in environment variables.");
    return;
  }
  if (isConnected) {
    console.log("✅ MongoDB is already connected.");
    return;
  }
  try {
    await mongoose.connect(URI);
    isConnected = true;
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("❌ MongoDB Connection Error:", error);
    }
  }
}

MongoDBConnection();
