"use client";

import React, { useEffect, useState, ChangeEvent, FC } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import socket from "@/app/lib/socket";
import { commonInputClasses } from "@/utils/Theme";
import Label from "./Label";
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
  authorName?: string;
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
}

const NewsForm: FC<NewsFormProps> = ({
  busy,
  btnTitle,
  initialState,
  onSubmit,
  videoUploaded,
}) => {
  const [title, setTitle] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>("");
  const [selectedNewsSubCategory, setSelectedNewsSubCategory] =
    useState<string>("");
  const [selectedNewsTags, setSelectedNewsTags] = useState<TagOption[]>([]);
  const [editorText, setEditorText] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");
  const [bioName, setBioName] = useState<string>("");
  const [selectedLiveUpdateType, setSelectedLiveUpdateType] =
    useState<string>("");
  const [liveUpdateHeadline, setLiveUpdateHeadline] = useState<string>("");
  const [isLiveUpdate, setIsLiveUpdate] = useState<boolean>(false);
  const [showHeadLine, setShowHeadLine] = useState<string>("");
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
  const { data: liveUpdateTypes = [] } = useLiveUpdateTypes();
  const { data: liveUpdateHeadlineData } = useLiveUpdateHeadline(showHeadLine);

  const resetForm = () => {
    setTitle("");
    setCity("");
    setFile(null);
    if (selectedImageForUI) {
      URL.revokeObjectURL(selectedImageForUI);
    }
    setSelectedImageForUI("");
    setSelectedType("");
    setSelectedNewsCategory("");
    setSelectedNewsSubCategory("");
    setSelectedNewsTags([]);
    setEditorText("");
    setAuthorName("");
    setBioName("");
    setSelectedLiveUpdateType("");
    setLiveUpdateHeadline("");
    setIsLiveUpdate(false);
    setShowHeadLine("");
    setIsFocused(false);
    setIsAdvertisement(false);
  };

  const handleNewsTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
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

  const handleLiveUpdateTypeChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedLiveUpdateType(e.target.value);
    setShowHeadLine(e.target.value);
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
    if (!authorName) {
      toast.error("Please write the Author Name");
      return;
    }
    if (!selectedNewsTags || selectedNewsTags.length === 0) {
      toast.error("Please tag this article");
      return;
    }

    formData.append("title", title);
    formData.append("city", city);
    formData.append("type", selectedType);
    formData.append("isLiveUpdate", String(isLiveUpdate));
    formData.append("liveUpdateType", selectedLiveUpdateType);
    formData.append("isAdvertisement", String(isAdvertisement));
    formData.append("liveUpdateHeadline", liveUpdateHeadline);
    formData.append("newsCategory", selectedNewsCategory);
    formData.append("subCategory", selectedNewsSubCategory);
    formData.append("tags", JSON.stringify(tags));
    formData.append("editorText", editorText);
    formData.append("authorName", authorName);
    formData.append("name", bioName);
    formData.append("folder", "news_assets");

    onSubmit(formData, resetForm);
    socket.emit("liveUpdate", true);
  };

  useEffect(() => {
    if (liveUpdateHeadlineData) {
      setLiveUpdateHeadline(liveUpdateHeadlineData.data);
    }
  }, [liveUpdateHeadlineData]);

  useEffect(() => {
    if (selectedNewsCategory) {
      refetchSubCategories();
    }
  }, [selectedNewsCategory, refetchSubCategories]);

  useEffect(() => {
    if (selectedType === "LiveUpdate") {
      setIsLiveUpdate(true);
    } else {
      setIsLiveUpdate(false);
    }
  }, [selectedType]);
  useEffect(() => {
    if (isAdvertisement) {
      setIsAdvertisement(true);
    } else {
      setIsAdvertisement(false);
    }
  }, [isAdvertisement]);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const typeResponse = await getTypes();
  //         setTypes(typeResponse);

  //         const categoryResponse = await getCategories();
  //         setNewsCategory(categoryResponse);

  //         if (selectedType === "LiveUpdate") {
  //           setIsLiveUpdate(true);
  //           const liveUpdateResponse = await getLastFiveLiveUpdateNewsType();
  //           setLiveUpdateTypes(
  //             liveUpdateResponse?.map((item: any) => item?.liveUpdateType)
  //           );
  //           if (showHeadLine) {
  //             const liveUpdateHeadlineResponse = await getLiveUpdateHeadLine(
  //               showHeadLine
  //             );
  //             setLiveUpdateHeadline(liveUpdateHeadlineResponse.data);
  //           }
  //         } else {
  //           setIsLiveUpdate(false);
  //         }
  //         if (selectedLiveUpdateType) {
  //           const selectedLiveUpdateTypeResponse =
  //             await getLastFiveLiveUpdateNewsType(selectedLiveUpdateType);
  //           setLiveUpdateHeadline(selectedLiveUpdateTypeResponse);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchData();
  //   }, [selectedType, selectedLiveUpdateType]);

  //   useEffect(() => {
  //     const fetchSubcategories = async () => {
  //       try {
  //         if (selectedNewsCategory) {
  //           const subcategoryResponse = await getSubCat(selectedNewsCategory);
  //           setNewsSubCategory(subcategoryResponse);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //     fetchSubcategories();
  //   }, [selectedNewsCategory]);

  useEffect(() => {
    if (initialState) {
      setEditorText(initialState.editorText || "");
      setTitle(initialState.title || "");
      setCity(initialState.city || "");
      setSelectedType(initialState.type || "");
      setIsLiveUpdate(initialState.isLiveUpdate || false);
      setIsAdvertisement(initialState.isAdvertisement || false);
      setSelectedLiveUpdateType(initialState.liveUpdateType || "");
      setLiveUpdateHeadline(initialState.liveUpdateHeadline || "");
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
      setAuthorName(initialState.authorName || "");
      setBioName(initialState?.name?.stageName || "");
      setSelectedImageForUI(initialState.file || "");
      setFile(null);
    }
  }, [initialState]);

  // console.log("types::", types);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="md:flex space-x-3 md:mt-0 h-96 overflow-y-scroll hide-scrollbar mx-5"
      >
        <div className="md:w-[70%] space-y-5">
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
              placeholder="Titanic"
            />
          </div>
          <div>
            <Label htmlFor="type">News Type</Label>
            <select
              id="NewsType"
              name="NewsType"
              value={selectedType}
              onChange={handleNewsTypeChange}
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
            </select>
          </div>
          <div>
            {selectedType === "LiveUpdate" && (
              <>
                {liveUpdateTypes?.length !== 0 ? (
                  <div className=" bg-yellow-100 px-4 mb-10 rounded">
                    <div className="flex justify-between py-5">
                      <div className=" w-full">
                        <Label htmlFor="LiveUpdateType">
                          Live Update News Type
                        </Label>
                        <input
                          type="text"
                          id="LiveUpdateType"
                          name="LiveUpdateType"
                          placeholder="eg: ukraine-russia-war"
                          onChange={handleLiveUpdateTypeChange}
                          className="mt-2 p-3 mr-2 bg-gray-200 focus:outline-none w-full border rounded-md text-black placeholder-gray-500"
                          required
                        />
                      </div>
                      <p className=" font-medium text-xs flex items-center mb-2 ml-2 text-gray-600">
                        OR
                      </p>
                      <div className="w-full">
                        <Label htmlFor="LiveUpdateType">
                          Live Update News Type
                        </Label>
                        <select
                          id="LiveUpdateType"
                          name="LiveUpdateType"
                          value={selectedLiveUpdateType}
                          onChange={handleLiveUpdateTypeChange}
                          className="mt-2 p-[0.95rem] ml-2 bg-gray-200 focus:outline-none w-full border rounded-md text-black placeholder-gray-500"
                        >
                          <option value="" disabled>
                            Select Live News Type
                          </option>
                          {liveUpdateTypes?.map(
                            (type: string, index: number) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="pb-5">
                      <Label htmlFor="LiveUpdateType">
                        Live Update Main Headline
                      </Label>
                      <input
                        type="text"
                        id="LiveUpdateType"
                        name="LiveUpdateType"
                        value={liveUpdateHeadline}
                        onChange={(e) => {
                          setLiveUpdateHeadline(e.target.value);
                        }}
                        placeholder="Live Update Main Headline"
                        className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md text-black placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className=" bg-yellow-200 px-4 mb-10 rounded">
                    <div className="py-5">
                      <Label htmlFor="LiveUpdateType">
                        Live Update News Type
                      </Label>
                      <input
                        type="text"
                        id="LiveUpdateType"
                        name="LiveUpdateType"
                        placeholder="eg: ukraine-russia-war"
                        onChange={handleLiveUpdateTypeChange}
                        className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md text-black placeholder-gray-500"
                        required
                      />
                    </div>
                    <div className="pb-5">
                      <Label htmlFor="LiveUpdateType">
                        Live Update Main Headline
                      </Label>
                      <input
                        type="text"
                        id="LiveUpdateType"
                        name="LiveUpdateType"
                        value={liveUpdateHeadline}
                        onChange={(e) => {
                          setLiveUpdateHeadline(e.target.value);
                        }}
                        placeholder="Live Update Main Headline"
                        className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md text-black placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <Label htmlFor="">Content</Label>
            <TextEditor
              //   placeholder="Content Text..."
              // onChange={handleEditorChange}
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
          <div className="w-full ml-2">
            <Label htmlFor="author">Author</Label>
            <input
              type="text"
              id="author"
              name="author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
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

          <Submit
            busy={busy}
            value={"Publish"}
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
              <select
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
              </select>
            </div>
            <div>
              <Label htmlFor="NewsSubCategory">Sub Category</Label>
              <select
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
              </select>
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
        </div>
      </form>
    </>
  );
};

export default NewsForm;
