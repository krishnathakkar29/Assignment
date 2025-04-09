import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    console.log(
      `Connected to database successfully ${connection.connection.host}`
    );
  } catch (error: unknown) {
    console.log(`Error while connecting to DB!!`, error);
    throw error;
  }
};
