import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
const PORT = process.env.PORT || 8000;
dotenv.config({
   path: "./.env",
});

connectDB()
   .then(() => {
      const server = app.listen(PORT, () => {
         console.log(`⚙️ Server is running at port ${PORT}`);
      });
      server.on("error", (error) => {
         console.error("ERROR: ", error);
         throw error;
      });
   })
   .catch((err) => {
      console.log("MONGO DB connection failed !!! " + err);
      process.exit(1);
   });
