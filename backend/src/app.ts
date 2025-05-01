// backend/src/app.ts

import express from "express";
import cors from "cors";
import connectDB from "./config/db.config";

// Route imports
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import chatRoutes from "./routes/chat.routes";

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // ✅ Change in production
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Basic API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);

// Export app instance
export default app;
