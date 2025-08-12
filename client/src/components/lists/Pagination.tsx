import React, { FC } from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import "@tailwindcss/forms";

interface PaginationProps {
  pageCount: number;
  onPageChange: ReactPaginateProps["onPageChange"];
}

const Pagination: FC<PaginationProps> = ({ pageCount, onPageChange }) => {
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
      containerClassName="flex justify-center mt-4 overflow-x-hidden text-gray-300"
      pageClassName="mx-2 transition duration-300 ease-in-out hover:border-b-2 focus:outline-none border-transparent cursor-pointer"
      previousClassName="mx-2 transition duration-300 ease-in-out hover:border-b-2 focus:outline-none border-transparent cursor-pointer"
      nextClassName="mx-2 transition duration-300 ease-in-out hover:border-b-2 focus:outline-none border-transparent cursor-pointer"
      activeClassName="border-b-2 border-b-blue-500 font-bold "
    />
  );
};

export default Pagination;
