import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";
const PORT = process.env.PORT || 8000;

connectDB()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Server is running at port ${PORT}`);
      }),
         app.on("error", (error) => {
            console.error("ERROR: ", error);
            throw error;
         });
   })
   .catch((err) => {
      console.log("MONGO DB connection error: " + err);
      process.exit(1);
   });
