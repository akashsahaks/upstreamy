import { mongoose } from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
   try {
      const URI = process.env.MONGODB_URI;
      const connectionInstance = await mongoose.connect(`${URI}/${DB_NAME}`);

      console.log(
         `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
      );
   } catch (error) {
      console.log("MONGODB connection FAILED : ", error);
      process.exit(1);
   }
};

export default connectDB;
