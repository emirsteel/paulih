// backend/src/server.ts
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import app from "./app";
import { initializeWebSocket } from "./socket";

import postRoutes from "./routes/post.routes";
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/company.routes";
import groupRoutes from "./routes/group.routes";
import venueRoutes from "./routes/venues.routes";
import productRoutes from "./routes/products.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import promoRoutes from "./routes/promo.routes";
import supplierRoutes from "./routes/supplier.routes";
import orderRoutes from "./routes/order.routes";
import requestRoutes from "./routes/requests.routes";
import orderAddressRoutes from "./routes/orderadress.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import notificationRoutes from "./routes/notifications.routes";
import friendRoutes from "./routes/friend.routes";
import courierRoutes from "./routes/courier.routes";
import reportPostRoutes from "./routes/reportpost.routes";
import pagesRoutes from "./routes/pages.routes";
import eventsRouter from "./routes/events.routes";
import reportRoutes from "./routes/report.routes";
import blockRoutes from "./routes/block.routes";

const PORT = process.env.PORT || 5001;

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Change if deployed to a domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// JSON parsing
app.use(express.json());

// Serve uploads statically
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Serve frontend build statically
const frontendPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(frontendPath));

// API Routes
app.use("/api/posts", postRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/order-address", orderAddressRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/reportposts", reportPostRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/events", eventsRouter);
app.use("/api/report", reportRoutes);
app.use("/api/blocks", blockRoutes);

// ✅ Test API endpoint
app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is working ✅" });
});

// ✅ Fallback: Serve React frontend for non-API routes
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Start HTTP server & WebSocket
const server = http.createServer(app);
initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
