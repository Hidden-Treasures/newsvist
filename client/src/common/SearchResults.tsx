import React, { Dispatch, FC, SetStateAction, useState } from "react";
import moment from "moment";
import FileDisplay from "@/helper/FileDisplay";
import { News } from "@/services/types";

interface SearchResultsProps {
  data: News[];
  setData: Dispatch<SetStateAction<News[]>>;
  newsCount: number;
  searchText: string;
  onPageChange: ({ selected }: { selected: number }) => void;
}

interface FormattedDateProps {
  date: string;
}

const SearchResults: FC<SearchResultsProps> = ({
  data,
  setData,
  newsCount,
  searchText,
  onPageChange,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletedItemId, setDeletedItemId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newsData, setNewsData] = useState<News[]>(data);

  const itemsPerPage = 5;

  const filteredData = data?.filter(
    (item) =>
      item?.title &&
      item?.title?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const FormattedDate: FC<FormattedDateProps> = ({ date }) => {
    const formattedDate = moment(date).format("MMM D, YYYY");
    return <p>{formattedDate}</p>;
  };

  return (
    <div className="px-16">
      <p className="mt-1 text-gray-600">
        Displaying <span className="font-bold">{newsCount}</span> results for
        your search <span className="font-bold">{searchText}</span>
      </p>
      {paginatedData?.map((item, index) => (
        <div key={item._id || index}>
          <div className="flex items-center py-4 border-b border-b-gray-200">
            <div className="w-1/3 h-48 mr-5">
              <FileDisplay file={item?.file} />
            </div>
            <div className="w-2/3">
              <div className="font-bold text-2xl">{item?.title}</div>
              <div className="text-gray-500 text-sm py-2">
                <FormattedDate date={item?.createdAt} />
              </div>
              <div>
                {item?.editorText
                  ?.replace(/<[^>]*>/g, "")
                  .split(" ")
                  .slice(0, 36)
                  .join(" ")}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
