"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = exports.parseData = exports.sendError = void 0;
const crypto = require("crypto");
const sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({ error });
};
exports.sendError = sendError;
const parseData = (req, res, next) => {
    const { video, tags } = req.body;
    if (video)
        req.body.video = JSON.parse(video);
    if (tags)
        req.body.tags = JSON.parse(tags);
    next();
};
exports.parseData = parseData;
// Function to generate the reset token
const generateResetToken = () => {
    const buffer = crypto.randomBytes(32);
    return buffer.toString("hex");
};
exports.generateResetToken = generateResetToken;
