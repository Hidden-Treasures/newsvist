"use client";

import React, { useState, useEffect, FC } from "react";
import Header from "@/common/header";
import Footer from "@/common/Footer";
import SearchResults from "@/common/SearchResults";
import SearchPagination from "@/common/SearchPagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useNews";

interface PageChangeEvent {
  selected: number;
}

const Search: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromURL = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(queryFromURL);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showFooterSearch, setShowFooterSearch] = useState<boolean>(false);
  const itemsPerPage = 5;

  useEffect(() => {
    setSearchInput(queryFromURL);
  }, [queryFromURL]);

  const { data, isLoading, error } = useSearch({
    searchText: queryFromURL,
    page: currentPage + 1,
    pageSize: itemsPerPage,
  });

  const handlePageChange = ({ selected }: PageChangeEvent) => {
    setCurrentPage(selected);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setCurrentPage(0);
    }
  };

  const handleClear = () => {
    setSearchInput("");
  };

  const handleSearchButtonClick = () => {
    setShowFooterSearch(!showFooterSearch);
  };

  return (
    <>
      <Header onSearchButtonClick={handleSearchButtonClick} />
      {!showFooterSearch && (
        <div className="container mx-auto mt-8 px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative mb-6 w-full max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-gray-300 py-2 pl-8 pr-20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 text-sm cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 text-sm cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Results */}
          <div className="App">
            {isLoading && <p className="text-black">Loading...</p>}
            {error && (
              <p className="text-red-500">Failed to fetch search results.</p>
            )}
            {data && (
              <>
                <SearchResults
                  data={data?.news}
                  onPageChange={handlePageChange}
                  setData={() => {}}
                  newsCount={data?.news?.length}
                  searchText={queryFromURL}
                />
                <SearchPagination
                  pageCount={data?.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Search;
