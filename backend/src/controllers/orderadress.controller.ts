import { Request, Response } from "express";
import OrderAddress from "../models/orderadress.model";

/**
 * Save a new order address
 */
export const saveOrderAddress = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      addressTitle,
      apartment,
      flat,
      floor,
      phoneNumber,
      addressDescription,
      noteToCourier,
      latitude,
      longitude,
      selectedTag,
    } = req.body;

    const newAddress = new OrderAddress({
      userId,
      addressTitle,
      apartment,
      flat,
      floor,
      phoneNumber,
      addressDescription,
      noteToCourier,
      latitude,
      longitude,
      selectedTag,
      isSelected: false, // Default to false
    });

    await newAddress.save();
    res
      .status(201)
      .json({ message: "Address saved successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Error saving address", error });
  }
};

/**
 * Get saved addresses for a user
 */
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const addresses = await OrderAddress.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
};

/**
 * Set the selected address for a user
 */
export const updateSelectedAddress = async (req: Request, res: Response) => {
  try {
    const { userId, addressId } = req.body;

    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ message: "User ID and Address ID are required" });
    }

    // Unselect all addresses of the user
    await OrderAddress.updateMany({ userId }, { $set: { isSelected: false } });

    // Select the new address
    const updatedAddress = await OrderAddress.findByIdAndUpdate(
      addressId,
      { isSelected: true },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Selected address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating selected address", error });
  }
};

export const updateOrderAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    const updatedData = req.body;
    const updatedAddress = await OrderAddress.findByIdAndUpdate(
      addressId,
      updatedData,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
};

export const deleteOrderAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    const deletedAddress = await OrderAddress.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error });
  }
};
