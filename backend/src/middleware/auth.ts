import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyToken = async (request: any, response: any, next: any) => {
  const authHeader = request.header("Authorization");
  
  console.log("=== AUTH DEBUG ===");
  console.log("Auth header:", authHeader);
  console.log("Auth header type:", typeof authHeader);
  console.log("Auth header length:", authHeader?.length);
  
  if (!authHeader) {
    console.log("No Authorization header");
    return response.status(401).json({ error: "Access denied - No token" });
  }

  // Bearer token-ийг салгах
  const token = authHeader.replace("Bearer ", "");
  console.log("Token after Bearer removal:", token);
  console.log("Token type:", typeof token);
  console.log("Token length:", token?.length);
  console.log("Token starts with:", token?.substring(0, 20));

  try {
    const decoded: any = jwt.verify(token, "pinecone-test");
    console.log("Decoded token:", decoded);
    console.log("Decoded userId:", decoded.userId);
    request.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.log("Token verification error:", error);
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    console.log("JWT_SECRET used:", "pinecone-test");
    response.status(401).json({ 
      error: "Token verification failed",
      message: error.message,
      name: error.name 
    });
  }
};

export default verifyToken;
