import { User } from "./interface";
import jwt from "jsonwebtoken";

export function generateTokenForUser(user: User) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token;
}

export function validateTokenForUser(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded !== "object" || !decoded.user) {
      throw new Error("Invalid or expired token");
    }
    return decoded;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Authentication failed");
    } else {
      throw new Error("Authentication failed");
    }
  }
}
