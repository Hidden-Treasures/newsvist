"use client";

import React, { FC, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useCreateBiography, useUpdateBiography } from "@/hooks/useAuth";
import { Biography } from "@/services/types";
import { biographySchema } from "./biography.schema";
import Modal from "../modals/Modal";
import DynamicListInput from "./inputs/DynamicListInput";
import DynamicSocialMediaInput from "./inputs/DynamicSocialMediaInput";
import z from "zod";
import { formatDateForInput } from "@/helper/helper";

const extendedBiographySchema = biographySchema.extend({
  image: z.instanceof(FileList).optional().nullable(),
});

type FormData = z.infer<typeof extendedBiographySchema>;

interface BiographyFormProps {
  biographyData?: Biography | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BiographyForm: FC<BiographyFormProps> = ({
  biographyData,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(extendedBiographySchema),
    defaultValues: {
      realName: "",
      stageName: "",
      aliasName: "",
      dateOfBirth: "",
      hometown: "",
      category: undefined,
      label: "",
      position: "",
      niche: "",
      genre: "",
      club: "",
      platform: "",
      socialMedia: [{ platform: "", handle: "" }],
      bio: "",
      nationality: "",
      gender: "",
      occupation: [""],
      education: [""],
      awards: [""],
      notableWorks: [""],
      spouse: "",
      children: [""],
      activeYears: "",
      placeOfBirth: "",
      placeOfDeath: "",
      quotes: [""],
      references: [""],
      image: null,
    },
  });

  const { control, register, handleSubmit, reset, formState, watch, setValue } =
    methods;

  const { errors, isSubmitting } = formState;

  const { mutate: createBio } = useCreateBiography();
  const { mutate: updateBiography } = useUpdateBiography();

  // Sync biographyData to form default values + image preview
  useEffect(() => {
    if (biographyData) {
      reset({
        realName: biographyData.realName || "",
        stageName: biographyData.stageName || "",
        aliasName: biographyData.aliasName || "",
        dateOfBirth: biographyData.dateOfBirth
          ? formatDateForInput(biographyData.dateOfBirth)
          : "",
        hometown: biographyData.hometown || "",
        category: biographyData.category,
        label: biographyData.label || "",
        position: biographyData.position || "",
        niche: biographyData.niche || "",
        genre: biographyData.genre || "",
        club: biographyData.club || "",
        platform: biographyData.platform || "",
        socialMedia:
          biographyData.socialMedia &&
          Object.entries(biographyData.socialMedia).length > 0
            ? Object.entries(biographyData.socialMedia).map(
                ([platform, handle]) => ({
                  platform,
                  handle,
                })
              )
            : [{ platform: "", handle: "" }],
        bio: biographyData.bio || "",
        nationality: biographyData.nationality || "",
        gender: biographyData.gender || "",
        occupation: biographyData.occupations?.length
          ? biographyData.occupations
          : [""],
        education: biographyData.education?.length
          ? biographyData.education
          : [""],
        awards: biographyData.awards?.length ? biographyData.awards : [""],
        notableWorks: biographyData.notableWorks?.length
          ? biographyData.notableWorks
          : [""],
        spouse: biographyData.spouse || "",
        children: biographyData.children?.length
          ? biographyData.children
          : [""],
        activeYears: biographyData.activeYears || "",
        placeOfBirth: biographyData.placeOfBirth || "",
        placeOfDeath: biographyData.placeOfDeath || "",
        quotes: biographyData.quotes?.length ? biographyData.quotes : [""],
        references: biographyData.references?.length
          ? biographyData.references
          : [""],
        image: undefined as unknown as FileList,
      });
      if (biographyData.image) setImagePreview(biographyData.image);
    } else {
      reset();
      setImagePreview(null);
    }
  }, [biographyData, reset]);

  // Preview image on upload
  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [watchImage]);

  const onSubmit = async (data: FormData) => {
    try {
      // Convert socialMedia array to object
      const socialMediaObj: Record<string, string> = {};
      if (data.socialMedia) {
        data.socialMedia.forEach(({ platform, handle }) => {
          if (platform.trim() && handle.trim()) {
            socialMediaObj[platform] = handle;
          }
        });
      }

      // Build FormData to send file + fields
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value instanceof FileList && value.length > 0) {
          formData.append("image", value[0]);
        } else if (
          [
            "occupations",
            "education",
            "awards",
            "notableWorks",
            "children",
            "quotes",
            "references",
          ].includes(key)
        ) {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "socialMedia") {
          // Append all other fields normally
          // formData.append(key, value as any);
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });
      // Append socialMedia as JSON string
      formData.append("socialMedia", JSON.stringify(socialMediaObj));

      // if (data.dateOfBirth) {
      //   formData.append(
      //     "dateOfBirth",
      //     new Date(data.dateOfBirth).toISOString()
      //   );
      // }

      // Determine if we're creating or updating
      if (biographyData && biographyData._id) {
        await updateBiography(
          { id: biographyData._id, formData },
          {
            onSuccess: () => {
              toast.success("Biography updated successfully!");
              onSuccess();
              onClose();
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to update biography"
              );
            },
          }
        );
      } else {
        await createBio(formData, {
          onSuccess: () => {
            toast.success("Biography saved successfully!");
            reset();
            setImagePreview(null);
            onSuccess();
            onClose();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Failed to create biography"
            );
          },
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={biographyData ? "Update Biography" : "Add New Biography"}
      maxWidth="max-w-4xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Real Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("realName")}
                  aria-invalid={errors.realName ? "true" : "false"}
                  type="text"
                  placeholder="Enter real name"
                  className={`w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm ${
                    errors.realName ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.realName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.realName.message?.toString()}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Stage Name</label>
                <input
                  {...register("stageName")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Alias Name</label>
                <input
                  {...register("aliasName")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Date of Birth</label>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Place of Birth</label>
                <input
                  {...register("placeOfBirth")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Hometown</label>
                <input
                  {...register("hometown")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Nationality</label>
                <input
                  {...register("nationality")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <input
                  {...register("gender")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
            </div>
          </section>

          {/* Career Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">
              Career Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block font-semibold mb-1 text-gray-700"
                >
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  id="category"
                  {...register("category")}
                  aria-invalid={errors.category ? "true" : "false"}
                  className={` w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
                    errors.category ? "border-red-500 ring-red-500" : ""
                  } appearance-none cursor-pointer`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Music Artist">Music Artist</option>
                  <option value="Footballer">Footballer</option>
                  <option value="Influencer">Influencer</option>
                  <option value="Creator">Creator</option>
                  <option value="Politician">Politician</option>
                  <option value="Scientist">Scientist</option>
                  <option value="Actor">Actor</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Author">Author</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.category.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Label</label>
                <input
                  {...register("label")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Position</label>
                <input
                  {...register("position")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Niche</label>
                <input
                  {...register("niche")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Genre</label>
                <input
                  {...register("genre")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Club</label>
                <input
                  {...register("club")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Platform</label>
                <input
                  {...register("platform")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Active Years</label>
                <input
                  {...register("activeYears")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
            </div>

            <DynamicListInput
              name="occupations"
              label="Occupations"
              control={control}
              placeholder="Enter occupation"
            />
          </section>

          {/* Education & Achievements */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">
              Education & Achievements
            </h3>
            <DynamicListInput
              name="education"
              label="Education"
              control={control}
              placeholder="Enter education"
            />
            <DynamicListInput
              name="awards"
              label="Awards"
              control={control}
              placeholder="Enter award"
            />
            <DynamicListInput
              name="notableWorks"
              label="Notable Works"
              control={control}
              placeholder="Enter notable work"
            />
          </section>

          {/* Personal Life */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">
              Personal Life
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Spouse</label>
                <input
                  {...register("spouse")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Place of Death</label>
                <input
                  {...register("placeOfDeath")}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
                  type="text"
                />
              </div>
            </div>
            <DynamicListInput
              name="children"
              label="Children"
              control={control}
              placeholder="Enter child’s name"
            />
          </section>

          {/* Online Presence */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">
              Online Presence
            </h3>
            <DynamicSocialMediaInput
              name="socialMedia"
              label="Social Media"
              control={control}
            />
          </section>

          {/* Biography & Media */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">
              Biography & Media
            </h3>
            <div>
              <label className="block font-medium mb-1">
                Biography <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("bio")}
                rows={5}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bio ? "border-red-500" : ""
                }`}
              />
              {errors.bio && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.bio.message?.toString()}
                </p>
              )}
            </div>

            <DynamicListInput
              name="quotes"
              label="Quotes"
              control={control}
              placeholder="Enter quote"
            />
            <DynamicListInput
              name="references"
              label="References"
              control={control}
              placeholder="Enter reference"
            />

            <div>
              <label className="block font-medium mb-1">
                Profile Image <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 h-32 w-32 object-cover rounded-md border"
                />
              )}
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.image.message as string}
                </p>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : biographyData
              ? "Update Biography"
              : "Save Biography"}
          </button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default BiographyForm;
