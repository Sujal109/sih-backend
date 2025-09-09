import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // adjust for frontend
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));
