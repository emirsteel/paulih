import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  tagline: String,
  industry: String,
  employees: Number,
  businessEmail: String,
  businessPhone: String,
  headquarters: String,
  yearEstablished: Number,
  pageName: String,
  description: String,
  category: String,
  tags: [String],
  email: String,
  phoneNumber: String,
  address: String,
  websiteURL: String,
  socialMediaProfiles: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  businessHours: {
    openingTime: String,
    closingTime: String,
  },
  servicesOffered: String,
  username: { type: String, required: true }, // Add username if required
});

export default mongoose.model("Company", CompanySchema);
