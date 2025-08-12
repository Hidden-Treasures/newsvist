"use client";

import { useBiographies } from "@/hooks/useBiography";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { ArrowRight } from "react-feather";

type Biography = {
  realName?: string;
  stageName?: string;
  image?: string;
};

export default function BiographiesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useBiographies(page, limit);

  const [selectedLetter, setSelectedLetter] = useState("#");
  const [filteredPersons, setFilteredPersons] = useState<Biography[]>([]);

  useEffect(() => {
    if (data?.data) {
      setFilteredPersons(data.data);
    }
  }, [data]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);

    if (letter === "#") {
      setFilteredPersons((data?.data as Biography[]) || []);
    } else {
      const filtered = ((data?.data as Biography[]) || []).filter(
        (person: Biography) =>
          (person.stageName || person.realName || "")
            .toUpperCase()
            .startsWith(letter)
      );
      setFilteredPersons(filtered);
    }
  };

  if (isLoading) return <p className="p-4">Loading biographies...</p>;

  return (
    <div>
      {/* Header Section */}
      <section className="bg-black text-white py-8">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold capitalize">biographies</h1>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <nav className="bg-black text-white py-4">
        <div className="container mx-auto">
          <ul className="flex flex-wrap justify-center md:space-x-4 space-x-3">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ#"?.split("")?.map((letter, index) => (
              <li key={index}>
                <button
                  onClick={() => handleLetterClick(letter)}
                  className={`hover:underline ${
                    selectedLetter === letter ? "text-yellow-500" : ""
                  }`}
                >
                  {letter}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Persons Section */}
      <section className="container mx-auto py-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map through filteredPersons */}
            {filteredPersons?.map((person, index) => (
              <div
                key={index}
                className="relative group text-center shadow-lg rounded-lg overflow-hidden"
              >
                <div>
                  <Image
                    src={person?.image || ""}
                    alt={
                      person?.stageName || person?.realName || "Biography image"
                    }
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Stage Name on top of the image */}
                <div className="absolute bottom-0 left-8 right-0 bg-black bg-opacity-50 text-white p-4 md:text-xl text-base font-bold transition-all duration-300 ease-in-out group-hover:translate-y-[-100%]">
                  {person.stageName || person.realName}
                </div>

                {/* Hover modal that slides in */}
                <div className="absolute top-8 left-8 right-0 bottom-2 bg-red-500 bg-opacity-80 text-white p-6 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transform translate-x-full transition-all duration-300 ease-in-out">
                  <>
                    <Link
                      href={`/biography/${(
                        person?.stageName ||
                        person?.realName ||
                        ""
                      )
                        .replace(/\s+/g, "")
                        .toLowerCase()}`}
                      className="md:text-xl text-base font-bold mb-4 hover:underline cursor-pointer"
                    >
                      {person?.stageName || person?.realName}
                    </Link>
                  </>

                  <div className="!border-b !border-dashed !border-white" />

                  <>
                    <Link
                      href={`/biography/${(
                        person?.stageName ||
                        person?.realName ||
                        ""
                      )
                        .replace(/\s+/g, "")
                        .toLowerCase()}`}
                      className="flex items-center px-4 py-2 text-white font-bold hover:underline"
                    >
                      View <ArrowRight size={15} />
                    </Link>
                  </>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Prev Button */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
               shadow-sm transition-all duration-200"
          >
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: data?.totalPages || 0 }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === data?.totalPages || Math.abs(p - page) <= 2
              )
              .map((p, index, arr) => (
                <Fragment key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-lg border transition-all duration-200
              ${
                p === page
                  ? "bg-yellow-500 text-white border-yellow-500 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
                  >
                    {p}
                  </button>
                  {/* Ellipsis */}
                  {index < arr.length - 1 && arr[index + 1] !== p + 1 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </Fragment>
              ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, data?.totalPages))
            }
            disabled={page === data?.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
               shadow-sm transition-all duration-200"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
