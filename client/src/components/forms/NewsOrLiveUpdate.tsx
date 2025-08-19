"use client";

import React, { FC, useState } from "react";
import LiveEvents from "./LiveEvent";
import NewsForm from "./News";

type NewsOrLiveUpdateProps = {
  busy: boolean;
  btnTitle: string;
  initialState?: any;
  onSubmit: (formData: FormData, reset: () => void) => void;
  videoUploaded?: boolean;
  isAdvertisement?: boolean;
  setIsAdvertisement?: (value: boolean) => void;
};

const NewsOrLiveUpdate: FC<NewsOrLiveUpdateProps> = (props) => {
  const [selectedType, setSelectedType] = useState("");

  (window as any).setNewsType = setSelectedType;

  return (
    <div>
      {selectedType === "LiveUpdate" ? (
        <LiveEvents />
      ) : (
        <NewsForm
          {...props}
          selectedType={selectedType}
          onTypeChange={(val: string) => setSelectedType(val)}
        />
      )}
    </div>
  );
};

export default NewsOrLiveUpdate;
