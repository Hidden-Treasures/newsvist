"use client";

import { useProfileByUsername } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FC } from "react";

const ProfilePage: FC = () => {
  const params = useParams();
  const usernameParam = params?.username;

  const username = Array.isArray(usernameParam)
    ? usernameParam[0]
    : usernameParam;

  const { data: user, isLoading, isError } = useProfileByUsername(username);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (isError || !user) {
    return <div className="p-6">Profile not found.</div>;
  }

  return (
    <div className="bg-gray-100 p-4">
      <div className="border-1 shadow-lg shadow-gray-700 rounded-lg">
        {/* top content */}
        <div className="flex rounded-t-lg bg-top-color sm:px-2 w-full">
          <div className="h-40 w-40 overflow-hidden sm:rounded-full sm:relative sm:p-0 top-10 left-5 p-3">
            <Image
              src={user?.profilePhoto || ""}
              alt="Profile Photo"
              fill
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="w-2/3 sm:text-center pl-5 mt-10 text-start">
            <p className="font-poppins font-bold text-heading sm:text-4xl text-2xl">
              {user?.username}
            </p>
            <p className="text-heading">{user?.username}</p>
          </div>
        </div>
        {/* main content */}
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:mt-10">
            <div className="flex flex-col sm:w-1/3">
              {/* My contact */}
              <div className="py-3 sm:order-none order-3">
                <h2 className="text-lg font-poppins font-bold text-top-color">
                  My Contact
                </h2>
                <div className="border-2 w-20 border-top-color my-3" />
                <div>
                  <div className="flex items-center my-1">
                    <a
                      className="w-6 text-gray-700 hover:text-orange-600"
                      aria-label="Visit NewsVist YouTube"
                      href="#"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        className="h-4"
                      >
                        <path
                          fill="currentColor"
                          d="M320 0H64C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zM192 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-96H64V64h256v320z"
                        />
                      </svg>
                    </a>
                    <div>{user?.phone}</div>
                  </div>
                  <div className="flex items-center my-1">
                    <a
                      className="w-6 text-gray-700 hover:text-orange-600"
                      aria-label="Visit NewsVist Facebook"
                      href="#"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-4"
                      >
                        <path
                          fill="currentColor"
                          d="M502.3 190.8L327.4 308.3c-14.7 9.8-33.4 9.8-48.1 0L9.7 190.8C3.8 186.8 0 180.1 0 173c0-19.6 16-35.6 35.6-35.6h440.9c19.6 0 35.6 16 35.6 35.6 0 7.1-3.8 13.8-9.7 17.8zM35.6 112c-19.6 0-35.6 16-35.6 35.6v256.7c0 19.6 16 35.6 35.6 35.6h440.9c19.6 0 35.6-16 35.6-35.6V147.6c0-19.6-16-35.6-35.6-35.6H35.6zM64 300.4V147.6l216 143.5 216-143.5v152.8L327.4 386.4c-14.7 9.8-33.4 9.8-48.1 0L64 300.4z"
                        />
                      </svg>
                    </a>
                    <div className="truncate">{user?.email}</div>
                  </div>
                </div>
              </div>
              {/* status */}
              <div className="py-3 sm:order-none order-2">
                <h2 className="text-lg font-poppins font-bold text-top-color">
                  Status
                </h2>
                <div className="border-2 w-20 border-top-color my-3" />
                <div>
                  <div className="flex items-center my-1">
                    <a className="w-6 text-gray-700 hover:text-orange-600">
                      <svg
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width={15}
                        height={15}
                      >
                        {/* Outer circle for the border */}
                        <circle
                          cx="7.5"
                          cy="7.5"
                          r={7}
                          stroke="currentColor"
                          strokeWidth={1}
                        />
                        {/* Inner circle for the status indicator */}
                        <circle cx="7.5" cy="7.5" r={5} fill="currentColor" />
                      </svg>
                    </a>
                    <div className="ml-2">{user?.status}</div>
                  </div>
                  <div className="flex items-center my-1">
                    <a
                      className="w-6 text-gray-700 hover:text-orange-600"
                      aria-label="Visit NewsVist Youtube"
                      href="#"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4"
                      >
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M5.5 21c0-2.5 3.5-4.5 6.5-4.5s6.5 2 6.5 4.5v1H5.5v-1z"></path>
                        <path d="M16.5 4.5l3.5 3.5m-3.5 0l3.5-3.5"></path>
                      </svg>
                    </a>
                    <div className="ml-2">{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:w-2/3 order-first sm:order-none sm:-mt-10">
              {/* About me */}
              <div className="py-3">
                <h2 className="text-lg font-poppins font-bold text-top-color">
                  About Me
                </h2>
                <div className="border-2 w-20 border-top-color my-3" />
                <p>{user?.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
