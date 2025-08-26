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
exports.markAsRead = exports.getNotifications = void 0;
const Notifications_1 = __importDefault(require("../models/Notifications"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notifications_1.default.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        const unreadCount = yield Notifications_1.default.countDocuments({
            user: req.user._id,
            isRead: false,
        });
        res.json({ success: true, notifications, unreadCount });
    }
    catch (err) {
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch notifications" });
    }
});
exports.getNotifications = getNotifications;
// Mark a notification as read
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notifications_1.default.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    }
    catch (err) {
        res
            .status(500)
            .json({ success: false, message: "Failed to update notification" });
    }
});
exports.markAsRead = markAsRead;
