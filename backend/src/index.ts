import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow requests from the frontend URL (change this to your frontend URL) or '*' for all origins,
  credentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api", routes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Quizly API is running");
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
