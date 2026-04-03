import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import "./config/redis.js"; // Initialize checking if Redis is available

const PORT = env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
