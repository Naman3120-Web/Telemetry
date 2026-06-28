import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export default async function ConnectToMGDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("successful connection to DB")
  } catch (err) {
    console.error(`Connection To MGDB Failed ${err}`);
  }
}

