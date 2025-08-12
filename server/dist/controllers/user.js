"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.initiatePasswordReset = exports.bulkUpdateUserStatus = exports.getUserAnalytics = exports.updateAccountStatus = exports.getUserDetails = exports.updateUser = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const cloud_1 = require("../cloud");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ResetToken_1 = __importDefault(require("../models/ResetToken"));
const email_1 = require("../utils/email");
const helper_1 = require("../utils/helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special  character, and be at least 8 character long",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ email, password: hashedPassword });
        yield newUser.save();
        res
            .status(201)
            .json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const { _id, role, username } = user;
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
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
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("authToken");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.logout = logout;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.params;
        const { username, phone, email, bio, folder } = req.body;
        // Find the user by ID
        const user = yield User_1.default.findById(userId);
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
            if (user.profilePhoto &&
                !user.profilePhoto.includes("default-profile_photos")) {
                const publicId = (_a = user.profilePhoto.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
                if (publicId) {
                    yield cloud_1.cloudinary.uploader.destroy(publicId);
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
        yield user.save();
        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateUser = updateUser;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Find the user by ID
        const user = yield User_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getUserDetails = getUserDetails;
const updateAccountStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, status } = req.body;
        // const userId = (req.user as any)?._id;
        // Ensure the admin cannot update their own status
        if (req.userId && req.userId.toString() === userId) {
            return res
                .status(403)
                .json({ error: "Admins cannot update their own account status" });
        }
        const user = yield User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        user.status = status;
        yield user.save();
        res.status(200).json({ message: "Account status updated successfully" });
    }
    catch (error) {
        console.error("Error updating account status:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.updateAccountStatus = updateAccountStatus;
const getUserAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeUsers = yield User_1.default.countDocuments({ status: "active" });
        const suspendedUsers = yield User_1.default.countDocuments({ status: "suspended" });
        const totalUsers = yield User_1.default.countDocuments();
        res.status(200).json({
            activeUsers,
            suspendedUsers,
            totalUsers,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserAnalytics = getUserAnalytics;
const bulkUpdateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds, status } = req.body;
        yield User_1.default.updateMany({ _id: { $in: userIds } }, { status });
        res.status(200).json({ message: "User statuses updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.bulkUpdateUserStatus = bulkUpdateUserStatus;
const initiatePasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const resetToken = (0, helper_1.generateResetToken)();
        // Create a new token document
        const token = new ResetToken_1.default({
            userId: user._id,
            token: resetToken,
        });
        yield token.save();
        // Send the reset token to the user's email
        const baseUrl = "https://www.newsvist.com";
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
        const message = `You requested a password reset. Please use the following link to reset your password: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;
        yield (0, email_1.sendEmail)(user.email, "Password Reset Request", message);
        res.status(200).json({ message: "Password reset initiated" });
    }
    catch (error) {
        console.error("Error in initiatePasswordReset:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});
exports.initiatePasswordReset = initiatePasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one digit, and one special character.",
            });
        }
        // Find the token
        const passwordResetToken = yield ResetToken_1.default.findOne({ token });
        if (!passwordResetToken) {
            return res.status(400).json({
                success: false,
                message: "The password reset link is either invalid or has expired.",
            });
        }
        // Find the user by ID
        const user = yield User_1.default.findById(passwordResetToken.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User associated with this reset link was not found.",
            });
        }
        // Compare the new password with the current password
        const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "The new password must be different from the current password.",
            });
        }
        // Hash the new password before saving
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        // Delete the token after successful password reset
        yield ResetToken_1.default.deleteOne({ _id: passwordResetToken._id });
        res.status(200).json({
            success: true,
            message: "Your password has been successfully reset.",
        });
    }
    catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while resetting the password. Please try again later.",
        });
    }
});
exports.resetPassword = resetPassword;
