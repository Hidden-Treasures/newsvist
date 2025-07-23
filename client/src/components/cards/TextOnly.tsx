import TextLoader from "@/helper/TextLoader";
import Link from "next/link";
import React, { FC } from "react";

interface TextOnlyProps {
  link: string;
  text: string;
  color?: boolean;
  loading?: boolean;
}

const TextOnly: FC<TextOnlyProps> = ({
  link,
  text,
  color = false,
  loading = false,
}) => {
  return (
    <div className="flex flex-col justify-start mb-4">
      {loading ? (
        <TextLoader className="mx-auto text-center !bg-transparent" />
      ) : (
        <>
          <div className="w-full h-[1px] bg-gray-300 mb-2" />
          <Link href={link}>
            <p
              className={`${
                color ? "text-white" : ""
              } self-start hover:text-gray-700 hover:underline text-base`}
            >
              {text}
            </p>
          </Link>
        </>
      )}
    </div>
  );
};

export default TextOnly;
