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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRole = exports.canCreateRead = exports.isJournalist = exports.isEditor = exports.isAdmin = exports.checkAuth = exports.isAuth = void 0;
const helper_1 = require("../utils/helper");
const jwt = require("jsonwebtoken");
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token)
        return (0, helper_1.sendError)(res, "Unauthorized!");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Error in isAuth middleware:", error);
        return (0, helper_1.sendError)(res, "Internal server error");
    }
});
exports.isAuth = isAuth;
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const userId = user._id;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized User" });
        }
        res.status(200).json({
            user: {
                _id: userId,
                token: req.cookies.authToken,
                role: user.role,
                username: user.username,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.error("Error in checkAuth middleware:", error);
        return (0, helper_1.sendError)(res, "Internal server error");
    }
});
exports.checkAuth = checkAuth;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (user.role !== "admin")
        return (0, helper_1.sendError)(res, "unauthorized access!");
    next();
});
exports.isAdmin = isAdmin;
const isEditor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (user.role !== "editor")
        return (0, helper_1.sendError)(res, "unauthorized access!");
    next();
});
exports.isEditor = isEditor;
const isJournalist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (user.role !== "journalist")
        return (0, helper_1.sendError)(res, "unauthorized access!");
    next();
});
exports.isJournalist = isJournalist;
const canCreateRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        switch (user.role) {
            case "admin":
                next();
                break;
            case "journalist":
                next();
                break;
            default:
                return res.status(403).send("Unauthorized");
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.canCreateRead = canCreateRead;
const isRole = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            next();
        }
        else {
            res.status(403).json({ message: "Forbidden" });
        }
    };
};
exports.isRole = isRole;
