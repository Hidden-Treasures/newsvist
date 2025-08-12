import { z } from "zod";

export const biographySchema = z.object({
  realName: z.string().min(1, "Real name is required"),
  stageName: z.string().optional(),
  aliasName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  hometown: z.string().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  label: z.string().optional(),
  position: z.string().optional(),
  activeYears: z.string().optional(),
  niche: z.string().optional(),
  genre: z.string().optional(),
  club: z.string().optional(),
  platform: z.string().optional(),
  occupation: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  notableWorks: z.array(z.string()).optional(),
  spouse: z.string().optional(),
  children: z.array(z.string()).optional(),

  socialMedia: z
    .array(
      z.object({
        platform: z.string().min(1, "Platform is required"),
        handle: z.string().min(1, "Handle is required"),
      })
    )
    .optional(),
  bio: z.string().min(1, "Biography is required"),
  image: z.string().optional(),
  quotes: z.array(z.string()).optional(),
  references: z.array(z.string()).optional(),
  placeOfDeath: z.string().optional(),
});

export type BiographyFormData = z.infer<typeof biographySchema>;
