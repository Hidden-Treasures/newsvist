"use client";

import React, { useEffect, useState, ChangeEvent, FC } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import socket from "@/app/lib/socket";
import { commonInputClasses } from "@/utils/Theme";
import ImageSelector from "@/utils/ImageSelector";
import Submit from "./Submit";
import TextEditor from "@/utils/TextEditor";
import {
  useLiveUpdateHeadline,
  useLiveUpdateTypes,
  useNewsTypes,
} from "@/hooks/useNews";
import { cities } from "@/utils/Cities";
import { Colors } from "@/utils/Colors";
import { useCategories, useSubCategories } from "@/hooks/useCategories";
import { Select } from "../ui/select";
import { Label } from "../ui/label";

interface TagOption {
  label: string;
  value: string;
}

interface InitialState {
  editorText?: string;
  title?: string;
  city?: string;
  type?: string;
  isLiveUpdate?: boolean;
  liveUpdateType?: string;
  isAdvertisement?: boolean;
  liveUpdateHeadline?: string;
  newsCategory?: string;
  subCategory?: string;
  tags?: Array<string | { name: string; _id: string }>;
  name?: { stageName: string };
  file?: string;
}

interface NewsFormProps {
  busy: boolean;
  btnTitle: string;
  initialState?: InitialState;
  onSubmit: (formData: FormData, reset: () => void) => void;
  videoUploaded?: boolean;
  isAdvertisement?: boolean;
  setIsAdvertisement?: (value: boolean) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
}

const NewsForm: FC<NewsFormProps> = ({
  busy,
  btnTitle,
  initialState,
  onSubmit,
  videoUploaded,
  selectedType,
  onTypeChange,
}) => {
  const [title, setTitle] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>("");
  const [selectedNewsSubCategory, setSelectedNewsSubCategory] =
    useState<string>("");
  const [selectedNewsTags, setSelectedNewsTags] = useState<TagOption[]>([]);
  const [editorText, setEditorText] = useState<string>("");
  const [bioName, setBioName] = useState<string>("");
  const [selectedLiveUpdateType, setSelectedLiveUpdateType] =
    useState<string>("");
  const [selectedImageForUI, setSelectedImageForUI] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAdvertisement, setIsAdvertisement] = useState<boolean>(false);
  // Using TanStack Query hooks
  const { data: types = [] } = useNewsTypes();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const {
    data: subCategories = [],
    isLoading: subCategoriesLoading,
    refetch: refetchSubCategories,
  } = useSubCategories(selectedNewsCategory);
  const { data: liveUpdateHeadlineData } = useLiveUpdateHeadline(
    selectedLiveUpdateType
  );

  const resetForm = () => {
    setTitle("");
    setCity("");
    setFile(null);
    if (selectedImageForUI) {
      URL.revokeObjectURL(selectedImageForUI);
    }
    setSelectedImageForUI("");
    setSelectedNewsCategory("");
    setSelectedNewsSubCategory("");
    setSelectedNewsTags([]);
    setEditorText("");
    setBioName("");
    setIsFocused(false);
    setIsAdvertisement(false);
  };

  const handleNewsTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // setSelectedType(e.target.value);
  };

  const handleNewsCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedNewsCategory(e.target.value);
  };

  const handleNewsSubCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedNewsSubCategory(e.target.value);
  };

  const handleTagChange = (newValue: any) => {
    setSelectedNewsTags(newValue as TagOption[]);
  };

  const maxFileSizeinBytes = 100 * 1024 * 1024;

  const updateImageForUI = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImageForUI(url);
    setFile(file);
  };

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = target;
    if (name === "file" && files && files.length > 0) {
      const file = files[0];
      updateImageForUI(file);
      if (file.size > maxFileSizeinBytes) {
        toast.error("File Size exceeds the maximum allowed size.");
        return;
      }
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    const tags = selectedNewsTags?.map((tag) => tag?.value || tag?.label);
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    if (!selectedNewsCategory) {
      toast.error("Please select a news category");
      return;
    }
    if (!selectedType) {
      toast.error("Please select a news Type");
      return;
    }

    if (!selectedNewsTags || selectedNewsTags.length === 0) {
      toast.error("Please tag this article");
      return;
    }

    formData.append("title", title);
    formData.append("city", city);
    formData.append("type", selectedType);
    formData.append("isAdvertisement", String(isAdvertisement));
    formData.append("newsCategory", selectedNewsCategory);
    formData.append("subCategory", selectedNewsSubCategory);
    formData.append("tags", JSON.stringify(tags));
    formData.append("editorText", editorText);
    formData.append("name", bioName);
    formData.append("folder", "news_assets");

    onSubmit(formData, resetForm);
  };

  useEffect(() => {
    if (selectedNewsCategory) {
      refetchSubCategories();
    }
  }, [selectedNewsCategory, refetchSubCategories]);

  useEffect(() => {
    if (isAdvertisement) {
      setIsAdvertisement(true);
    } else {
      setIsAdvertisement(false);
    }
  }, [isAdvertisement]);

  useEffect(() => {
    if (initialState) {
      setEditorText(initialState.editorText || "");
      setTitle(initialState.title || "");
      setCity(initialState.city || "");
      setIsAdvertisement(initialState.isAdvertisement || false);
      setSelectedLiveUpdateType(initialState.liveUpdateType || "");
      setSelectedNewsCategory(initialState.newsCategory || "");
      setSelectedNewsSubCategory(initialState.subCategory || "");
      setSelectedNewsTags(
        Array.isArray(initialState?.tags)
          ? initialState?.tags?.map((tag) =>
              typeof tag === "string"
                ? { label: tag, value: tag }
                : { label: tag?.name, value: tag?._id || "" }
            )
          : []
      );
      setBioName(initialState?.name?.stageName || "");
      setSelectedImageForUI(initialState.file || "");
      setFile(null);
    } else {
      resetForm();
    }
  }, [initialState]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col md:flex-row gap-6 p-5 md:p-8 bg-slate-900 border-slate-700 rounded-xl shadow-lg max-w-6xl mx-auto"
    >
      {/* Left / Content */}
      <div className="flex-1 space-y-5">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAdvertisement}
            onChange={(e) => setIsAdvertisement(e.target.checked)}
            className="h-5 w-5 cursor-pointer"
          />
          <span className="text-gray-500">Post as Advertisement</span>
        </label>

        <div>
          <Label htmlFor="title" className="text-gray-300">
            Title
          </Label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${commonInputClasses} w-full border-b-2 font-semibold text-lg md:text-xl placeholder:text-gray-500`}
            placeholder="Enter headline"
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-gray-300">
            News Type
          </Label>
          <Select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full border-2 p-2 rounded bg-transparent text-gray-500"
          >
            <option value="" disabled>
              Select News Type
            </option>
            {types.map((t: any, i: number) => (
              <option key={i} value={t.name}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="text-gray-300">Content</Label>
          <TextEditor
            content={editorText}
            onChange={setEditorText}
            description={editorText}
          />
        </div>
        <div>
          <Label className="text-gray-300">Tags</Label>
          <CreatableSelect
            isMulti
            value={selectedNewsTags}
            onChange={handleTagChange}
            placeholder="Enter or select tags"
            className="border-2 rounded p-2"
            formatCreateLabel={(input) => `Create tag: "${input}"`}
          />
        </div>
      </div>

      {/* Right / Sidebar */}
      <div className="md:w-1/3 flex flex-col gap-5">
        <div>
          <Label className="text-gray-300">Upload Image</Label>
          <ImageSelector
            name="file"
            selectedImage={selectedImageForUI}
            onChange={handleFileChange}
            label="Select image"
            accept="image/*"
          />
        </div>
        <div>
          <Label className="text-gray-300">Category</Label>
          <Select
            value={selectedNewsCategory}
            onChange={(e) => setSelectedNewsCategory(e.target.value)}
            className="w-full border-2 p-2 rounded bg-transparent text-gray-500"
          >
            <option value="" disabled>
              {categoriesLoading ? "Loading..." : "Select Category"}
            </option>
            {categories.map((c: any, i: number) => (
              <option key={i} value={c.title}>
                {c.title}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="text-gray-300">Sub Category</Label>
          <Select
            value={selectedNewsSubCategory}
            onChange={(e) => setSelectedNewsSubCategory(e.target.value)}
            className="w-full border-2 p-2 rounded bg-transparent text-gray-500"
          >
            <option value="" disabled>
              {subCategoriesLoading ? "Loading..." : "Select Sub Category"}
            </option>
            {subCategories.map((sc: any, i: number) => (
              <option key={i} value={sc.name}>
                {sc.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="text-gray-300">City</Label>
          <CreatableSelect
            value={cities.find((c) => c.value === city)}
            onChange={(option) => option?.value && setCity(option.value)}
            options={cities}
            className="border-2 p-2 rounded bg-transparent text-gray-500"
            placeholder="Enter or select City"
          />
        </div>
        <div>
          <Label className="text-gray-300">Bio Name</Label>
          <input
            type="text"
            value={bioName}
            onChange={(e) => setBioName(e.target.value)}
            className="w-full border-b-2 font-semibold p-2 bg-transparent text-gray-500"
            placeholder="Artist / Celebrity / Player Name"
          />
        </div>
        <div className="mt-auto">
          <Submit
            busy={busy}
            value={btnTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
      </div>

      {/* <div className="md:w-[70%] space-y-5">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAdvertisement}
              onChange={(e) => setIsAdvertisement(e.target.checked)}
              className="h-5 w-5 text-gray-300 cursor-pointer"
            />
            <span className="text-gray-400">Post as Advertisement</span>
          </label>
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              name="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl w-full"
              }
              style={{
                borderColor: isFocused ? Colors.primary : Colors.lightSubtle,
                color: Colors.primary,
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              placeholder="rivers in the ocean"
            />
          </div>
          <div>
            <Label htmlFor="type">News Type</Label>
            <Select
              id="NewsType"
              name="NewsType"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full border-2 p-1 pr-10 outline-none transition rounded bg-transparent"
              style={{
                borderColor: isFocused ? Colors.primary : Colors.lightSubtle,
                color: Colors.primary,
              }}
            >
              <option value="" disabled>
                Select News Type
              </option>
              {types &&
                types?.map((type: any, index: number) => (
                  <option value={type?.name} key={index}>
                    {type?.name}
                  </option>
                ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="">Content</Label>
            <TextEditor
              content={editorText}
              onChange={(newContent) => setEditorText(newContent)}
              description={editorText}
            />
          </div>

          <div className="w-full mr-2">
            <Label htmlFor="tags">Tags</Label>
            <CreatableSelect
              id="tags"
              isMulti
              value={Array.isArray(selectedNewsTags) ? selectedNewsTags : []}
              onChange={handleTagChange}
              placeholder="Enter or select tags"
              className="border-2 p-1  outline-none transition rounded bg-transparent text-black"
              formatCreateLabel={(inputValue) => `Create tag: "${inputValue}"`}
            />
          </div>

          <Submit
            busy={busy}
            value={btnTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
        <div className="md:w-[30%] space-y-5">
          <div>
            <div>
              <Label htmlFor="">Upload Image</Label>
              <ImageSelector
                name="file"
                onChange={handleFileChange}
                selectedImage={selectedImageForUI}
                label="Select image"
                accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
              />
            </div>
          </div>
          <div className="w-full">
            <div>
              <Label htmlFor="NewsCategory">Category</Label>
              <Select
                id="NewsCategory"
                name="NewsCategory"
                value={selectedNewsCategory}
                onChange={handleNewsCategoryChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full border-2 p-1 pr-10 outline-none transition rounded bg-transparent"
                required
                style={{
                  borderColor: isFocused ? Colors.primary : Colors.lightSubtle,
                  color: Colors.primary,
                }}
              >
                <option value="" disabled>
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select News Category"}
                </option>
                {categories &&
                  categories?.map((category: any, index: number) => (
                    <option value={category?.title} key={index}>
                      {category?.title}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="NewsSubCategory">Sub Category</Label>
              <Select
                id="NewsSubCategory"
                name="NewsSubCategory"
                value={selectedNewsSubCategory}
                onChange={handleNewsSubCategoryChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full border-2 p-1 !pr-10 outline-none transition rounded bg-transparent"
                style={{
                  borderColor: isFocused ? Colors.primary : Colors.lightSubtle,
                  color: Colors.primary,
                }}
              >
                <option value="" disabled>
                  {subCategoriesLoading
                    ? "Loading subcategories..."
                    : "Select News Sub Category"}
                </option>
                {subCategories &&
                  subCategories?.map((subcategory: any, index: number) => (
                    <option value={subcategory?.name} key={index}>
                      {subcategory?.name}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <div>
                <Label htmlFor="city">
                  City{" "}
                  <span className="text-xs">
                    (Which city does the incident happen?)
                  </span>
                </Label>
                <CreatableSelect
                  value={cities?.find((c) => c?.value === city)}
                  onChange={(option) => {
                    if (option?.value) {
                      setCity(option.value);
                    }
                  }}
                  options={cities}
                  className="border-2 p-1  outline-none transition rounded bg-transparent text-black"
                  placeholder="Enter or select City or Country"
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-wrap">
                <Label htmlFor="bioName">Bio Name</Label>
                <span
                  className="text-[10px] font-bold italic"
                  style={{ color: Colors.lightSubtle }}
                >
                  (artist name, player name, celebrity name, e.t.c)
                </span>
              </div>
              <input
                type="text"
                id="bioName"
                name="bioName"
                value={bioName}
                onChange={(e) => setBioName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={
                  commonInputClasses + " border-b-2 font-semibold text-xl"
                }
                style={{
                  borderColor: isFocused ? Colors.primary : Colors.lightSubtle,
                  color: Colors.primary,
                }}
                required
              />
            </div>
          </div>
        </div> */}
    </form>
  );
};

export default NewsForm;
