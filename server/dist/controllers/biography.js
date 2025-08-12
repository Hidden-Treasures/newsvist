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
exports.getArticlesByBiography = exports.getBioByName = exports.deleteBiography = exports.updateBiography = exports.getBiographyById = exports.getBiographies = exports.getAllBiography = exports.createBiography = void 0;
const Biography_1 = __importDefault(require("../models/Biography"));
const helper_1 = require("../utils/helper");
const cloud_1 = require("../cloud");
const mongoose_1 = __importDefault(require("mongoose"));
const News_1 = __importDefault(require("../models/News"));
const createBiography = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingBiography = yield Biography_1.default.findOne({
            realName: req.body.realName,
        });
        if (existingBiography) {
            return res.status(400).json({ message: "Biography already exists" });
        }
        let socialMediaObject = {};
        if (req.body.socialMedia) {
            socialMediaObject = JSON.parse(req.body.socialMedia);
        }
        // Check for uploaded image
        const cloudinaryUrls = req.body.cloudinaryUrls || [];
        if (cloudinaryUrls.length !== 1) {
            return res
                .status(400)
                .json({ message: "Exactly one image file is required" });
        }
        const imageFile = cloudinaryUrls[0];
        const person = new Biography_1.default(Object.assign(Object.assign({}, req.body), { socialMedia: socialMediaObject, image: imageFile.url, public_id: imageFile.public_id }));
        yield person.save();
        res.status(201).json(person);
    }
    catch (error) {
        console.error("Error fetching creating biography:", error);
        res.status(400).json({ message: error.message });
    }
});
exports.createBiography = createBiography;
const getAllBiography = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const persons = yield Biography_1.default.find();
        res.status(200).json(persons);
    }
    catch (error) {
        (0, helper_1.sendError)(res, "Internal server error");
    }
});
exports.getAllBiography = getAllBiography;
const getBiographies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
        const limit = parseInt(typeof req.query.limit === "string" ? req.query.limit : "10") ||
            10;
        const skip = (page - 1) * limit;
        const persons = yield Biography_1.default.find().skip(skip).limit(limit);
        const total = yield Biography_1.default.countDocuments();
        res.status(200).json({
            data: persons,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        (0, helper_1.sendError)(res, error.message);
    }
});
exports.getBiographies = getBiographies;
const getBiographyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const person = yield Biography_1.default.findById(req.params.id);
        if (!person)
            return res.status(404).json({ message: "Biography not found" });
        res.status(200).json(person);
    }
    catch (error) {
        (0, helper_1.sendError)(res, error.message);
    }
});
exports.getBiographyById = getBiographyById;
const updateBiography = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Person ID" });
        }
        const person = yield Biography_1.default.findById(id);
        if (!person) {
            return res.status(404).json({ message: "Person not found" });
        }
        const { realName, stageName, aliasName, dateOfBirth, hometown, category, label, position, niche, genre, club, platform, socialMedia, bio, nationality, gender, occupations, education, awards, notableWorks, spouse, children, activeYears, placeOfBirth, placeOfDeath, quotes, references, } = req.body;
        const updatedData = {};
        // Basic Information
        if (realName)
            updatedData.realName = realName;
        if (stageName)
            updatedData.stageName = stageName;
        if (aliasName)
            updatedData.aliasName = aliasName;
        if (dateOfBirth)
            updatedData.dateOfBirth = new Date(dateOfBirth);
        if (hometown)
            updatedData.hometown = hometown;
        if (nationality)
            updatedData.nationality = nationality;
        if (gender)
            updatedData.gender = gender;
        if (placeOfBirth)
            updatedData.placeOfBirth = placeOfBirth;
        if (placeOfDeath)
            updatedData.placeOfDeath = placeOfDeath;
        // Career Information
        if (category)
            updatedData.category = category;
        if (label)
            updatedData.label = label;
        if (position)
            updatedData.position = position;
        if (niche)
            updatedData.niche = niche;
        if (genre)
            updatedData.genre = genre;
        if (club)
            updatedData.club = club;
        if (platform)
            updatedData.platform = platform;
        if (activeYears)
            updatedData.activeYears = activeYears;
        // Education & Achievements
        if (education) {
            try {
                updatedData.education =
                    typeof education === "string" ? JSON.parse(education) : education;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid education format" });
            }
        }
        if (awards) {
            try {
                updatedData.awards =
                    typeof awards === "string" ? JSON.parse(awards) : awards;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid awards format" });
            }
        }
        if (notableWorks) {
            try {
                updatedData.notableWorks =
                    typeof notableWorks === "string"
                        ? JSON.parse(notableWorks)
                        : notableWorks;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid notableWorks format" });
            }
        }
        // Personal Life
        if (spouse)
            updatedData.spouse = spouse;
        if (children) {
            try {
                updatedData.children =
                    typeof children === "string" ? JSON.parse(children) : children;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid children format" });
            }
        }
        // Online Presence
        if (socialMedia) {
            try {
                updatedData.socialMedia =
                    typeof socialMedia === "string"
                        ? JSON.parse(socialMedia)
                        : socialMedia;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid socialMedia format" });
            }
        }
        // Biography & Media
        if (bio)
            updatedData.bio = bio;
        if (quotes) {
            try {
                updatedData.quotes =
                    typeof quotes === "string" ? JSON.parse(quotes) : quotes;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid quotes format" });
            }
        }
        if (references) {
            try {
                updatedData.references =
                    typeof references === "string" ? JSON.parse(references) : references;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid references format" });
            }
        }
        // Occupations (special case since frontend uses 'occupation' but model uses 'occupations')
        if (occupations) {
            try {
                updatedData.occupations =
                    typeof occupations === "string"
                        ? JSON.parse(occupations)
                        : occupations;
            }
            catch (error) {
                return res.status(400).json({ message: "Invalid occupations format" });
            }
        }
        // Handle image upload if present
        if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
            const cloudinaryUrls = req.body.cloudinaryUrls;
            if (cloudinaryUrls.length !== 1) {
                return res
                    .status(400)
                    .json({ message: "Exactly one image file is required" });
            }
            const imageFile = cloudinaryUrls[0];
            // Delete old image if it exists
            if (person.public_id) {
                const { result } = yield cloud_1.cloudinary.uploader.destroy(person.public_id);
                if (result !== "ok") {
                    return res
                        .status(400)
                        .json({ message: "Could not delete existing image" });
                }
            }
            updatedData.image = imageFile.url;
            updatedData.public_id = imageFile.public_id;
        }
        const updatedPerson = yield Biography_1.default.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });
        if (!updatedPerson) {
            return res.status(404).json({ message: "Person not found after update" });
        }
        res.status(200).json(updatedPerson);
    }
    catch (error) {
        console.error("Error updating biography:", error);
        res.status(400).json({ message: error.message });
    }
});
exports.updateBiography = updateBiography;
const deleteBiography = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const person = yield Biography_1.default.findById(req.params.id);
        if (!person)
            return res.status(404).json({ message: "Person not found" });
        yield cloud_1.cloudinary.uploader.destroy(person.public_id);
        yield Biography_1.default.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteBiography = deleteBiography;
const getBioByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bioName } = req.params;
        const safePattern = bioName.replace(/\s+/g, "").split("").join("\\s*");
        const biography = yield Biography_1.default.findOne({
            $or: [
                {
                    stageName: {
                        $regex: new RegExp(`^${safePattern}$`, "i"),
                    },
                },
                {
                    realName: {
                        $regex: new RegExp(`^${safePattern}$`, "i"),
                    },
                },
            ],
        });
        if (!biography) {
            return res.status(404).json({ message: "Biography not found" });
        }
        res.json(biography);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getBioByName = getBioByName;
const getArticlesByBiography = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { person } = req.query;
        const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
        const limit = parseInt(typeof req.query.limit === "string" ? req.query.limit : "5") ||
            5;
        const skip = (page - 1) * limit;
        const bio = yield Biography_1.default.findOne({
            $or: [
                { realName: new RegExp(`^${person}$`, "i") },
                { stageName: new RegExp(`^${person}$`, "i") },
            ],
        });
        if (!bio) {
            return res.status(404).json({ message: "Person not found" });
        }
        const articles = yield News_1.default.find({ name: bio._id }).skip(skip).limit(limit);
        const totalArticles = yield News_1.default.countDocuments({ name: bio._id });
        res.json({
            articles,
            totalPages: Math.ceil(totalArticles / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getArticlesByBiography = getArticlesByBiography;
