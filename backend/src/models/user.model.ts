// backend/src/models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";

// Define interfaces for additional info
export interface IPersonalInfo {
  salutations?: string; // Formerly "hitaplar"
  work?: string;
  education?: {
    highSchool?: string;
    college?: string;
  };
  city?: string;
  birthplace?: string;
  relationship?: string;
  phoneNumber?: string;
}

export interface IUniversityInfo {
  classes?: string[];
  lessons?: string[];
  year?: string;
  major?: string;
}

// Define an interface for the User model
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  isDeactivated: boolean;
  isVerified: boolean;
  profileImage: string;
  verificationCode: string;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  bio?: string;
  bannerImage?: string;
  friendRequests: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
    }
  ];
  friends: mongoose.Types.ObjectId[];
  lastActive?: Date;
  badges: string[];

  // New fields for personal and university information
  personalInfo?: IPersonalInfo;
  universityInfo?: IUniversityInfo;
  blockedUsers: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDeactivated: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String, default: "/images/defaultimage.jpeg" },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  bio: { type: String },
  bannerImage: { type: String, default: "/images/defaultimage.jpeg" },
  friendRequests: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  lastActive: { type: Date, default: Date.now },
  badges: { type: [String], default: [] },
  // New personal info subdocument
  personalInfo: {
    salutations: { type: String },
    work: { type: String },
    education: {
      highSchool: { type: String },
      college: { type: String },
    },
    city: { type: String },
    birthplace: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String },
  },
  // New university info subdocument
  universityInfo: {
    classes: [{ type: String }],
    lessons: [{ type: String }],
    year: { type: String },
    major: { type: String },
  },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Create unique indexes for `username` and `email`
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>("User", UserSchema);
