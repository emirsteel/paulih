// backend/src/app.ts
import express from "express";
import cors from "cors";
import connectDB from "./config/db.config";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes); // Post routes
app.use("/api/chat", chatRoutes);

export default app;
