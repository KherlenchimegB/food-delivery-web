import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyToken = async (request: any, response: any, next: any) => {
  const authHeader = request.header("Authorization");
  
  if (!authHeader) {
    return response.status(401).json({ error: "Access denied - No token" });
  }

  // Bearer token-ийг салгах
  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded: any = jwt.verify(token, "pinecone-test");
    request.userId = decoded.userId;
    next();
  } catch (error: any) {
    response.status(401).json({ 
      error: "Token verification failed",
      message: error.message,
      name: error.name 
    });
  }
};

export default verifyToken;
