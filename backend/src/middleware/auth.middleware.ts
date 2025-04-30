import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "52152364Edi";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "52152364Edi_refresh";

// Extend Request to include the user property
export interface AuthenticatedRequest extends Request {
  user?: IUser; // TypeScript now recognizes `req.user`
}

// 🛡️ Middleware for handling authentication
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from `Bearer <token>`

  try {
    // Decode token and verify with the secret
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Find the user in the database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to the next middleware
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired. Please log in again.",
        expired: true,
      });
    } else if (err instanceof JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token. Authorization denied." });
    } else {
      console.error("Auth Middleware Error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

// 🔒 Middleware for chat authentication
export const chatAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated." });
    }
    next(); // Proceed to chat-related functionality
  } catch (error) {
    console.error("Chat Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// 🔄 Middleware to update user's last active timestamp
export const updateLastActive = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(); // If no user, skip

  try {
    await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });
  } catch (error) {
    console.error("Error updating lastActive:", error);
  }
  next();
};

// 🔄 Endpoint for refreshing tokens
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken; // Expect refresh token in cookies

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided." });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      id: string;
    };

    // Find the user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res
        .status(403)
        .json({ message: "Refresh token expired. Please log in again." });
    } else if (err instanceof JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid refresh token." });
    } else {
      console.error("Refresh Token Error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    // Replace 'your_jwt_secret' with your actual secret or use process.env.JWT_SECRET
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    // Attach user to request; you'll need to adjust as per your payload
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
