import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  name: string; // Sayfa başlığı (örn. işletme adı)
  username: string; // Benzersiz kullanıcı adı
  password: string; // Sayfa şifresi
  description: string; // Sayfa hakkında
  category: string; // Sayfa kategorisi (İşletme, Topluluk, vs.)
  website?: string; // Resmi web sitesi
  profileImage?: string; // Profil resmi URL'si
  bannerImage?: string; // Banner resmi URL'si
  followers: mongoose.Types.ObjectId[]; // Takipçi listesi
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  phone?: string; // İletişim telefonu
  establishedDate?: Date; // Kuruluş tarihi
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
  };
  additionalInfo?: string; // Ek bilgiler (misyon, slogan, vb.)
  createdBy: mongoose.Types.ObjectId; // ID of the user who creates the page
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    website: { type: String },
    profileImage: { type: String },
    bannerImage: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    phone: { type: String },
    establishedDate: { type: Date },
    businessHours: {
      monday: { type: String },
      tuesday: { type: String },
      wednesday: { type: String },
      thursday: { type: String },
      friday: { type: String },
      saturday: { type: String },
      sunday: { type: String },
    },
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      tiktok: { type: String },
      linkedin: { type: String },
    },
    additionalInfo: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPage>("Page", PageSchema);
