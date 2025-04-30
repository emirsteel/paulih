import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Venue } from "../models/venues.model"; // Adjust the path if necessary

dotenv.config();

async function hashExistingPasswords() {
  await mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb+srv://lyntria:52152364edi@lyntria.2u01n.mongodb.net/"
  );

  const venues = await Venue.find();

  for (const venue of venues) {
    // Skip venues without a password field
    if (!venue.password || typeof venue.password !== "string") {
      console.warn(
        `Skipping venue: ${venue.name} - Password field is missing.`
      );
      continue;
    }

    // Ensure password is hashed
    if (!venue.password.startsWith("$2b$")) {
      console.log(`Hashing password for venue: ${venue.name}`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(venue.password, salt);

      // Update the venue document directly
      await Venue.updateOne(
        { _id: venue._id },
        { $set: { password: hashedPassword } }
      );
    }
  }

  console.log("All passwords updated!");
  mongoose.connection.close();
}

hashExistingPasswords().catch(console.error);
