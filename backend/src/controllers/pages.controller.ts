import { Request, Response } from "express";
import Page from "../models/pages.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; 

export const createPage = async (req: Request, res: Response) => {
  const {
    name,
    username,
    password,
    description,
    category,
    website,
    location,
    phone,
    establishedDate,
    businessHours,
    socialLinks,
    additionalInfo,
    userId, // expect the frontend to send the userId here
  } = req.body;

  // Ensure required fields are present
  if (!name || !username || !password || !description || !category || !userId) {
    return res.status(400).json({ message: "Gerekli alanlar eksik." });
  }

  try {
    // 1) Check if a page with the same username already exists
    const existingPage = await Page.findOne({ username });
    if (existingPage) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
    }

    // 2) Parse any JSON fields if needed
    let parsedLocation, parsedBusinessHours, parsedSocialLinks;
    try {
      parsedLocation = location ? JSON.parse(location) : undefined;
      parsedBusinessHours = businessHours
        ? JSON.parse(businessHours)
        : undefined;
      parsedSocialLinks = socialLinks ? JSON.parse(socialLinks) : undefined;
    } catch (err) {
      return res.status(400).json({
        message: "JSON parse error in location/businessHours/socialLinks.",
      });
    }

    // 3) Handle uploaded files from req.files
    let profileImageName: string | undefined;
    let bannerImageName: string | undefined;

    if (req.files && "profileImage" in req.files) {
      profileImageName = (req.files["profileImage"] as Express.Multer.File[])[0]
        .filename;
    }
    if (req.files && "bannerImage" in req.files) {
      bannerImageName = (req.files["bannerImage"] as Express.Multer.File[])[0]
        .filename;
    }

    // 4) Create new page document, associating it with the userId
    const newPage = new Page({
      name,
      username,
      password,
      description,
      category,
      website,
      location: parsedLocation,
      phone,
      establishedDate: establishedDate ? new Date(establishedDate) : undefined,
      businessHours: parsedBusinessHours,
      socialLinks: parsedSocialLinks,
      additionalInfo,
      profileImage: profileImageName,
      bannerImage: bannerImageName,
      createdBy: userId, // Connect the page with the user who creates it
    });

    await newPage.save();

    res.status(201).json({
      message: "Sayfa başarıyla oluşturuldu.",
      page: newPage,
    });
  } catch (error) {
    console.error("Sayfa oluşturulurken hata:", error);
    res
      .status(500)
      .json({ message: "Sayfa oluşturulurken hata oluştu.", error });
  }
};

// Get Page by Username
export const getPageByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const page = await Page.findOne({ username });
    if (!page) {
      return res.status(404).json({ message: "Page not found." });
    }
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: "Error fetching page.", error });
  }
};

// In pages.controller.ts

export const getAllPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.find({});
    res.status(200).json({ pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Error fetching pages.", error });
  }
};

export const getMyPages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Now TS knows req.user exists
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user id." });
    }

    const pages = await Page.find({ createdBy: userId }).populate(
      "createdBy",
      "name username email profileImage"
    );

    res.status(200).json({ pages });
  } catch (error) {
    console.error("Error fetching user pages:", error);
    res.status(500).json({ message: "Error fetching your pages", error });
  }
};

export const loginPage = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 1) Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli." });
  }

  try {
    // 2) Find the page by username
    const page = await Page.findOne({ username });
    if (!page) {
      return res.status(404).json({ message: "Sayfa bulunamadı." });
    }

    // 3) Compare the password
    //    (In production, you'd store hashed passwords, so you'd compare with bcrypt.compare)
    if (page.password !== password) {
      return res.status(401).json({ message: "Geçersiz şifre." });
    }

    // 4) Create a JWT
    //    Replace process.env.JWT_SECRET with your actual secret key
    //    Also adjust expiresIn as desired
    const token = jwt.sign(
      { pageId: page._id, username: page.username },
      process.env.JWT_SECRET || "52152364Edi",
      { expiresIn: "30d" }
    );

    // 5) Return token + page info
    return res.status(200).json({
      message: "Sayfa girişi başarılı.",
      token,
      page: {
        _id: page._id,
        username: page.username,
        name: page.name,
        profileImage: page.profileImage,
        // ...any other fields you want to expose
      },
    });
  } catch (error) {
    console.error("Sayfa girişi sırasında hata:", error);
    return res.status(500).json({ message: "Sunucu hatası.", error });
  }
};

// Follow a page
export const followPage = async (req: AuthenticatedRequest, res: Response) => {
  const { pageId } = req.params;
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: no user id." });
  }
  try {
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found." });
    }
    // Check if the user already follows the page
// Check if the user already follows the page
if (page.followers.includes(userId as mongoose.Types.ObjectId)) {
  return res
    .status(400)
    .json({ message: "User already follows this page." });
}

// Add the user to followers
page.followers.push(userId as mongoose.Types.ObjectId);
    await page.save();
    return res
      .status(200)
      .json({ message: "Page followed successfully.", page });
  } catch (error) {
    console.error("Error following page:", error);
    return res
      .status(500)
      .json({ message: "Server error while following page.", error });
  }
};

// Unfollow a page
export const unfollowPage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { pageId } = req.params;
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: no user id." });
  }
  try {
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found." });
    }
    // Check if the user is actually following the page
// Check if the user is actually following the page
if (!page.followers.includes(userId as mongoose.Types.ObjectId)) {
  return res
    .status(400)
    .json({ message: "User is not following this page." });
}

// Remove the user from followers
page.followers = page.followers.filter(
  (follower) => follower.toString() !== userId.toString()
);
    await page.save();
    return res
      .status(200)
      .json({ message: "Page unfollowed successfully.", page });
  } catch (error) {
    console.error("Error unfollowing page:", error);
    return res
      .status(500)
      .json({ message: "Server error while unfollowing page.", error });
  }
};
