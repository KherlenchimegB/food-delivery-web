import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

const port = process.env.PORT || 8000;

// Routes
server.use("/auth", authRoutes);
server.use("/projects", projectRoutes);
server.use("/tasks", taskRoutes);

// Health check endpoint
server.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Task Manager API is running" });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
