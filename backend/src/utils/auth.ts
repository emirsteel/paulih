import jwt from "jsonwebtoken";

export const validateToken = (token: string): { id: string; [key: string]: any } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; [key: string]: any };
    return decoded; // Decoded token with user info
  } catch (error) {
    throw new Error("Invalid token");
  }
};
