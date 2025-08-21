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
import { Card, CardHeader, CardTitle } from "../ui/card";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

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
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });
      // Append socialMedia as JSON string
      formData.append("socialMedia", JSON.stringify(socialMediaObj));

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto hide-scrollbar bg-slate-950 border border-slate-800 rounded-xl p-5 md:p-8 shadow-lg flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-white">
            {biographyData ? "Update Biography" : "Add New Biography"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Info */}
            <Card className="p-6 shadow-sm rounded-2xl border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold text-slate-200">
                  Basic Information
                </CardTitle>
              </CardHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  label="Real Name"
                  name="realName"
                  register={register}
                  error={errors.realName}
                  required
                  placeholder="Enter real name"
                />
                <FormField
                  label="Stage Name"
                  name="stageName"
                  register={register}
                />
                <FormField
                  label="Alias Name"
                  name="aliasName"
                  register={register}
                />
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  register={register}
                  type="date"
                />
                <FormField
                  label="Place of Birth"
                  name="placeOfBirth"
                  register={register}
                />
                <FormField
                  label="Hometown"
                  name="hometown"
                  register={register}
                />
                <FormField
                  label="Nationality"
                  name="nationality"
                  register={register}
                />
                <FormField label="Gender" name="gender" register={register} />
              </div>
            </Card>

            {/* Career Info */}
            <Card className="p-6 shadow-sm rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">
                Career Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormSelect
                  label="Category"
                  name="category"
                  register={register}
                  error={errors.category}
                  options={[
                    "Music Artist",
                    "Footballer",
                    "Influencer",
                    "Creator",
                    "Politician",
                    "Scientist",
                    "Actor",
                    "Entrepreneur",
                    "Author",
                  ]}
                  required
                />
                <FormField label="Label" name="label" register={register} />
                <FormField
                  label="Position"
                  name="position"
                  register={register}
                />
                <FormField label="Niche" name="niche" register={register} />
                <FormField label="Genre" name="genre" register={register} />
                <FormField label="Club" name="club" register={register} />
                <FormField
                  label="Platform"
                  name="platform"
                  register={register}
                />
                <FormField
                  label="Active Years"
                  name="activeYears"
                  register={register}
                />
              </div>
              <DynamicListInput
                name="occupations"
                label="Occupations"
                control={control}
              />
            </Card>

            {/* Repeat same structure for Education, Personal Life, Online Presence, Biography & Media */}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-md"
            >
              {isSubmitting
                ? "Saving..."
                : biographyData
                ? "Update Biography"
                : "Save Biography"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default BiographyForm;
