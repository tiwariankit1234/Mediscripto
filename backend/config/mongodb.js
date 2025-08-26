import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  }
};

export default connectDB;
