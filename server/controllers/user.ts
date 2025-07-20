import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { cloudinary } from "../cloud";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import ResetToken from "../models/ResetToken";
import { sendEmail } from "../utils/email";
import { generateResetToken } from "../utils/helper";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!%#*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special  character, and be at least 8 character long",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const { _id, role, username } = user;
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: _id,
        username: username,
        role: role,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, phone, email, bio, folder } = req.body;
    // const userId = (req.user as any)?._id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    // If a new profile photo is uploaded
    if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
      // Delete the old profile photo from Cloudinary if it exists
      if (
        user.profilePhoto &&
        !user.profilePhoto.includes("default-profile_photos")
      ) {
        const publicId = user.profilePhoto.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // // Upload the new profile photo to Cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path, {
      //   folder: "profile_photos",
      //   public_id: `${userId}_${Date.now()}`,
      // });

      // if (!result || !result.secure_url) {
      //   return res
      //     .status(500)
      //     .json({ message: "Failed to upload new profile photo" });
      // }
      user.profilePhoto = req.body.cloudinaryUrls[0];
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateAccountStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;
    // const userId = (req.user as any)?._id;
    // Ensure the admin cannot update their own status
    if ((req as any).userId && (req as any).userId.toString() === userId) {
      return res
        .status(403)
        .json({ error: "Admins cannot update their own account status" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = status;
    await user.save();

    res.status(200).json({ message: "Account status updated successfully" });
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const activeUsers = await User.countDocuments({ status: "active" });
    const suspendedUsers = await User.countDocuments({ status: "suspended" });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      activeUsers,
      suspendedUsers,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const bulkUpdateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userIds, status } = req.body;
    await User.updateMany({ _id: { $in: userIds } }, { status });
    res.status(200).json({ message: "User statuses updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const initiatePasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = generateResetToken();
    // Create a new token document
    const token = new ResetToken({
      userId: user._id,
      token: resetToken,
    });

    await token.save();

    // Send the reset token to the user's email
    const baseUrl = "https://www.newsvist.com";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    const message = `You requested a password reset. Please use the following link to reset your password: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({ message: "Password reset initiated" });
  } catch (error: any) {
    console.error("Error in initiatePasswordReset:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    // Find the token
    const passwordResetToken = await ResetToken.findOne({ token });
    if (!passwordResetToken) {
      return res.status(400).json({
        success: false,
        message: "The password reset link is either invalid or has expired.",
      });
    }

    // Find the user by ID
    const user = await User.findById(passwordResetToken.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User associated with this reset link was not found.",
      });
    }

    // Compare the new password with the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "The new password must be different from the current password.",
      });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the token after successful password reset
    await ResetToken.deleteOne({ _id: passwordResetToken._id });

    res.status(200).json({
      success: true,
      message: "Your password has been successfully reset.",
    });
  } catch (error: any) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while resetting the password. Please try again later.",
    });
  }
};
