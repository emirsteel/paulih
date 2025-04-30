import { Response } from "express";
import Company from "../models/company.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createCompany = async (
  req: AuthenticatedRequest, // Use AuthenticatedRequest for correct typing
  res: Response
) => {
  try {
    const username = req.user?.username;

    if (!username) {
      return res
        .status(400)
        .json({ message: "User's username is required to create a company." });
    }

    const companyData = {
      ...req.body,
      username,
    };

    const newCompany = new Company(companyData);
    await newCompany.save();

    res
      .status(201)
      .json({ message: "Company created successfully", newCompany });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Error creating company", error });
  }
};
