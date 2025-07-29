import { Request, Response } from "express";
import Biography, { IBiography } from "../models/Biography";
import { FileObject } from "../types";
import { sendError } from "../utils/helper";
import { cloudinary } from "../cloud";
import mongoose from "mongoose";
import News from "../models/News";

export const createBiography = async (req: Request, res: Response) => {
  try {
    const existingPerson = await Biography.findOne({
      realName: req.body.realName,
    });

    if (existingPerson) {
      return res.status(400).json({ message: "Person already exists" });
    }

    let socialMediaObject = {};
    if (req.body.socialMedia) {
      socialMediaObject = JSON.parse(req.body.socialMedia);
    }

    // Check for uploaded image
    const cloudinaryUrls: FileObject[] = req.body.cloudinaryUrls || [];
    if (cloudinaryUrls.length !== 1) {
      return res
        .status(400)
        .json({ message: "Exactly one image file is required" });
    }

    const imageFile = cloudinaryUrls[0];

    const person = new Biography({
      ...req.body,
      socialMedia: socialMediaObject,
      image: imageFile.url,
      public_id: imageFile.public_id,
    });

    await person.save();
    res.status(201).json(person);
  } catch (error) {
    console.error("Error fetching creating biography:", error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllBiography = async (req: Request, res: Response) => {
  try {
    const persons = await Biography.find();
    res.status(200).json(persons);
  } catch (error) {
    sendError(res, "Internal server error");
  }
};

export const getBiographies = async (req: Request, res: Response) => {
  try {
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const limit =
      parseInt(typeof req.query.limit === "string" ? req.query.limit : "10") ||
      10;
    const skip = (page - 1) * limit;
    const persons = await Biography.find().skip(skip).limit(limit);
    const total = await Biography.countDocuments();
    res.status(200).json({
      data: persons,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getBiographyById = async (req: Request, res: Response) => {
  try {
    const person = await Biography.findById(req.params.id);
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.status(200).json(person);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateBiography = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Person ID" });
    }

    const person = await Biography.findById(id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const {
      realName,
      stageName,
      aliasName,
      dateOfBirth,
      hometown,
      category,
      label,
      position,
      niche,
      genre,
      club,
      platform,
      socialMedia,
      bio,
    } = req.body;

    const updatedData: Partial<IBiography> = {};

    if (realName) updatedData.realName = realName;
    if (stageName) updatedData.stageName = stageName;
    if (aliasName) updatedData.aliasName = aliasName;
    if (dateOfBirth) updatedData.dateOfBirth = dateOfBirth;
    if (hometown) updatedData.hometown = hometown;
    if (category) updatedData.category = category;
    if (label) updatedData.label = label;
    if (position) updatedData.position = position;
    if (niche) updatedData.niche = niche;
    if (genre) updatedData.genre = genre;
    if (club) updatedData.club = club;
    if (platform) updatedData.platform = platform;
    if (bio) updatedData.bio = bio;

    if (socialMedia) {
      try {
        updatedData.socialMedia =
          typeof socialMedia === "string"
            ? JSON.parse(socialMedia)
            : socialMedia;
      } catch (error) {
        return res.status(400).json({ message: "Invalid socialMedia format" });
      }
    }

    if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
      const cloudinaryUrls: FileObject[] = req.body.cloudinaryUrls;
      if (cloudinaryUrls.length !== 1) {
        return res
          .status(400)
          .json({ message: "Exactly one image file is required" });
      }

      const imageFile = cloudinaryUrls[0];

      if (person.public_id) {
        const { result } = await cloudinary.uploader.destroy(person.public_id);
        if (result !== "ok") {
          return res
            .status(400)
            .json({ message: "Could not delete existing image" });
        }
      }

      updatedData.image = imageFile.url;
      updatedData.public_id = imageFile.public_id;
    }

    const updatedPerson = await Biography.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPerson) {
      return res.status(404).json({ message: "Person not found after update" });
    }

    res.status(200).json(updatedPerson);
  } catch (error) {
    console.error("Error updating biography:", error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteBiography = async (req: Request, res: Response) => {
  try {
    const person = await Biography.findById(req.params.id);

    if (!person) return res.status(404).json({ message: "Person not found" });

    await cloudinary.uploader.destroy(person.public_id);

    await Biography.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBioByName = async (req: Request, res: Response) => {
  try {
    const { bioId } = req.params;
    const biography = await Biography.findById(bioId);
    if (!biography) {
      return res.status(404).json({ message: "Biography not found" });
    }

    res.json(biography);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getArticlesByBiography = async (req: Request, res: Response) => {
  try {
    const { person } = req.query;
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const limit =
      parseInt(typeof req.query.limit === "string" ? req.query.limit : "5") ||
      5;
    const skip = (page - 1) * limit;

    const bio = await Biography.findOne({
      $or: [
        { realName: new RegExp(`^${person}$`, "i") },
        { stageName: new RegExp(`^${person}$`, "i") },
      ],
    });
    if (!bio) {
      return res.status(404).json({ message: "Person not found" });
    }
    const articles = await News.find({ name: bio._id }).skip(skip).limit(limit);

    const totalArticles = await News.countDocuments({ name: bio._id });

    res.json({
      articles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
