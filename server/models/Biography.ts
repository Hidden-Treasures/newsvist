import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBiography extends Document {
  realName: string;
  stageName?: string;
  aliasName?: string;
  dateOfBirth?: Date;
  hometown?: string;
  category: "Music Artist" | "Footballer" | "Influencer" | "Creator";
  label?: string;
  position?: string;
  niche?: string;
  genre?: string;
  club?: string;
  platform?: string;
  socialMedia?: Map<string, string>;
  bio: string;
  image: string;
  public_id: string;
  nationality?: string;
  gender?: string;
  occupations?: string[];
  education?: string[];
  awards?: string[];
  notableWorks?: string[];
  deathDate?: Date;
  spouse?: string;
  children?: string[];
  website?: string;
  wikipedia?: string;
  activeYears?: string;
  placeOfBirth?: string;
  placeOfDeath?: string;
  quotes?: string[];
  references?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BiographySchema: Schema = new Schema(
  {
    realName: { type: String, required: true, unique: true },
    stageName: { type: String },
    aliasName: { type: String },
    dateOfBirth: { type: Date },
    hometown: { type: String },
    category: {
      type: String,
      enum: ["Music Artist", "Footballer", "Influencer", "Creator"],
      required: true,
    },
    label: { type: String },
    position: { type: String },
    niche: { type: String },
    genre: { type: String },
    club: { type: String },
    platform: { type: String },
    socialMedia: {
      type: Map,
      of: String,
    },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    public_id: { type: String, required: true },
    nationality: { type: String },
    gender: { type: String },
    occupations: [{ type: String }],
    education: [{ type: String }],
    awards: [{ type: String }],
    notableWorks: [{ type: String }],
    deathDate: { type: Date },
    spouse: { type: String },
    children: [{ type: String }],
    website: { type: String },
    wikipedia: { type: String },
    activeYears: { type: String },
    placeOfBirth: { type: String },
    placeOfDeath: { type: String },
    quotes: [{ type: String }],
    references: [{ type: String }],
  },
  { timestamps: true }
);

const Biography: Model<IBiography> = mongoose.model<IBiography>(
  "Biography",
  BiographySchema
);

export default Biography;
