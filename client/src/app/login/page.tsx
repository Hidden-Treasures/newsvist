"use client";

import { useAuth } from "@/context/AuthContext";
import { useLogin, useProfile } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Eye, EyeOff, Loader } from "react-feather";
import { toast } from "react-toastify";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { refetch: refetchProfile } = useProfile();

  const { mutate, isPending, isSuccess, isError, error } = useLogin();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: async () => {
          const profile = await refetchProfile();
          const role = profile.data
            ? profile.data?.user?.role
            : profile.data?.role;

          toast.success("Login successful!");

          switch (role) {
            case "admin":
              router.push("/admin/dashboard");
              break;
            case "editor":
              router.push("/editor/dashboard");
              break;
            default:
              router.push("/");
              break;
          }
        },
        onError: () => {
          toast.error("Invalid credentials");
        },
      }
    );
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f8fa] via-[#e4e7ec] to-[#dde1e7] px-4">
        <div className="max-w-lg w-full p-10 bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="flex flex-col items-center">
            <img
              src={
                "https://res.cloudinary.com/dqxcyhqvx/image/upload/v1753022225/Newsvistlogo_agfbuq.png"
              }
              className="w-auto h-12"
              alt=""
            />
            <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
              Create your NV account
            </h2>
            <div className="text-sm mt-2">
              <Link
                href="/register"
                className="font-medium text-black hover:text-gray-700"
              >
                Don't have an account? <span>Sign Up</span>
              </Link>
            </div>
          </div>
          <form className="mt-8" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                {/* <label htmlFor="email-address sr-only"> Email Address</label> */}
                <input
                  type="email"
                  id="email-address"
                  name="email"
                  autoComplete="email"
                  required
                  className="text-gray-900 border border-gray-800 rounded block w-full p-3 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-4 relative">
                {/* <label htmlFor="email-address sr-only"> Email Address</label> */}
                <input
                  type={showPassword ? "text" : "password"}
                  id="Password"
                  name="Password"
                  autoComplete="password"
                  required
                  className="text-gray-900 border border-gray-800 rounded block w-full p-3 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-20"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <Eye size={20} color="#000" />
                  ) : (
                    <EyeOff size={20} color="#000" />
                  )}
                </span>
              </div>
            </div>
            {isError && (
              <p className="text-red-600 mt-2">
                {(error as any)?.response?.data?.message ||
                  "Something went wrong"}
              </p>
            )}
            <div>
              <button
                type="submit"
                className=" w-full flex justify-center py-3 px-4 border border-transparent text-md font-bold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none cursor-pointer"
              >
                {isPending ? <Loader className="animate-spin" /> : " Login"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 mb-2">
              <div className="flex text-sm items-center">
                <p className="text-xs text-black-600 hover:text-black-500">
                  {/* To opt-out at any time, see options available here. */}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
