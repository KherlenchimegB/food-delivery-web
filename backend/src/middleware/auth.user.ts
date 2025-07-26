/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from "express";
import { decodeToken } from "../util/generateToken.js";

export const authentication = (req: any, res: any, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ message: "You must be logged in" });
  }

  const token = req.headers.authorization.split(" ")[1];
  const user = decodeToken(token);
  req.user = user;

  next();
};
