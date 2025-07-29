"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidation = exports.validate = exports.validateVideo = exports.validateNews = void 0;
const express_validator_1 = require("express-validator");
exports.validateNews = [
    (0, express_validator_1.check)("title").trim().not().isEmpty().withMessage("News title is missing!"),
];
exports.validateVideo = (0, express_validator_1.check)("video")
    .isObject()
    .withMessage("Video must be an object with url and public_id")
    .custom(({ url, public_id }) => {
    try {
        const result = new URL(url);
        if (!result.protocol.includes("http"))
            throw Error("Video url is invalid!");
        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];
        if (public_id !== publicId)
            throw Error("Video public_id is invalid!");
        return true;
    }
    catch (error) {
        throw Error("Video url is invalid!");
    }
});
const validate = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req).array();
    if (error.length) {
        return res.json({ error: error[0].msg });
    }
    next();
};
exports.validate = validate;
exports.commentValidation = [
    (0, express_validator_1.check)("articleId").notEmpty().withMessage("Article ID is required"),
    (0, express_validator_1.check)("commentText").notEmpty().withMessage("Comment text is required"),
    (0, express_validator_1.check)("parentCommentId")
        .optional()
        .isMongoId()
        .withMessage("Invalid parent comment ID"),
];
