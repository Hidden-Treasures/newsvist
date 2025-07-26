import React, { FC } from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import "@tailwindcss/forms";

interface SearchPaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const SearchPagination: FC<SearchPaginationProps> = ({
  pageCount,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      breakLabel="..."
      breakClassName="break-me"
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName="flex justify-center mt-4 overflow-x-hidden"
      pageClassName="mx-2 transition duration-300 ease-in-out hover:border-b-2 focus:outline-none border-transparent"
      previousClassName="mx-2 transition duration-300 ease-in-out hover:border-b-2 focus:outline-none border-transparent"
      nextClassName="mx-2 transition duration-300 ease-in-out hover:border-b-2 focus:outline-none border-transparent"
      activeClassName="border-b-2 border-blue-500 font-bold underline"
    />
  );
};

export default SearchPagination;
