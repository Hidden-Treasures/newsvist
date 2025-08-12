import NavLink from "@/app/NavLink";
import { usePathname } from "next/navigation";
import React, { Fragment, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  onAddNewsClick: () => void;
}

const Sidebar = ({ onAddNewsClick }: SidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  return (
    <>
      <div>
        <div className="lg:hidden flex items-center justify-between p-4">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-200 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div
          id="sidebar"
          ref={sidebar}
          className={`fixed inset-0 top-0 z-40 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-hidden no-scrollbar w-64 lg:w-20 2xl:!w-64 bg-slate-800 p-4 transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarExpanded ? "lg:w-64" : "lg:w-20"} flex flex-col`}
        >
          <div className="flex justify-between mb-10 pr-3 sm:px-2">
            <button
              ref={trigger}
              className="lg:hidden text-slate-500 hover:text-slate-400"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
              </svg>
            </button>
            <NavLink end={true} href="/" className="block">
              <svg width="32" height="32" viewBox="0 0 32 32">
                <defs>
                  <linearGradient
                    x1="28.538%"
                    y1="20.229%"
                    x2="100%"
                    y2="108.156%"
                    id="logo-a"
                  >
                    <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                    <stop stopColor="#A5B4FC" offset="100%" />
                  </linearGradient>
                  <linearGradient
                    x1="88.638%"
                    y1="29.267%"
                    x2="22.42%"
                    y2="100%"
                    id="logo-b"
                  >
                    <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                    <stop stopColor="#38BDF8" offset="100%" />
                  </linearGradient>
                </defs>
                <rect fill="#6366F1" width="32" height="32" rx="16" />
                <path
                  d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                  fill="#4F46E5"
                />
                <path
                  d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                  fill="url(#logo-a)"
                />
                <path
                  d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                  fill="url(#logo-b)"
                />
              </svg>
            </NavLink>
          </div>
          <div className="space-y-8 flex-grow overflow-hidden">
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className={`hidden lg:block lg:w-6 text-center ${
                  sidebarExpanded ? "lg:!hidden" : "lg:block"
                }`}
                aria-hidden="true"
              >
                •••
              </span>
              <span
                className={`lg:hidden ${
                  sidebarExpanded ? "lg:block" : "lg:hidden"
                }`}
              >
                Pages
              </span>
            </h3>

            <Fragment>
              <div className="">
                <div className={`pl-9 mt-1 `}>
                  <div className="mb-1 last:mb-0">
                    <NavLink
                      href="/admin/dashboard"
                      className={({ isActive }) =>
                        "block transition duration-150 truncate " +
                        (isActive
                          ? "text-indigo-100 bg-indigo-500 rounded-lg w-full px-5"
                          : "text-slate-400 hover:text-slate-200")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                            <path
                              className={`fill-current ${
                                pathname.includes("/admin/dashboard")
                                  ? "text-indigo-500"
                                  : "text-slate-400"
                              }`}
                              d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                            />
                            <path
                              className={`fill-current ${
                                pathname.includes("/admin/dashboard")
                                  ? "text-indigo-600"
                                  : "text-slate-600"
                              }`}
                              d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                            />
                            <path
                              className={`fill-current ${
                                pathname === "/" ||
                                pathname.includes("/admin/dashboard")
                                  ? "text-indigo-200"
                                  : "text-slate-400"
                              }`}
                              d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                            />
                          </svg>
                          <span
                            className={`text-sm font-medium lg:opacity-0 ${
                              sidebarExpanded
                                ? "lg:!opacity-100"
                                : "lg:!opacity-0"
                            } duration-200`}
                          >
                            Dashboard
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>
            </Fragment>
            <div>
              <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
                <span
                  className={`hidden lg:block ${
                    sidebarExpanded && "lg:hidden"
                  } lg:w-6 text-center`}
                  aria-hidden="true"
                >
                  •••
                </span>
                <span
                  className={`lg:hidden ${
                    sidebarExpanded ? "lg:block" : "lg:hidden"
                  }`}
                >
                  More
                </span>
              </h3>
              <SidebarLinkGroup
                activeCondition={pathname.includes("news-management")}
              >
                {(handleClick, open) => {
                  return (
                    <Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes("news-management")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                className={`fill-current ${
                                  pathname.includes("news-management")
                                    ? "text-indigo-500"
                                    : "text-slate-600"
                                }`}
                                d="M12 2c-1.101 0-2 .899-2 2s.899 2 2 2 2-.899 2-2-.899-2-2-2zM12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zM12 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes("news-management")
                                    ? "text-indigo-300"
                                    : "text-slate-400"
                                }`}
                                d="M0 0h24v24H0z"
                              />
                            </svg>
                            <span
                              className={`text-sm font-medium ml-3 lg:opacity-0 ${
                                sidebarExpanded && "lg:!opacity-100"
                              } duration-200`}
                            >
                              News Management
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div
                        className={`lg:hidden ${
                          sidebarExpanded && "lg:!block"
                        } 2xl:block`}
                      >
                        <ul
                          className={`pl-9 mt-1 cursor-pointer ${
                            !open && "hidden"
                          }`}
                        >
                          <li className="mb-1 last:mb-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                onAddNewsClick();
                              }}
                              className="block transition duration-150 truncate text-slate-400 hover:text-slate-200 w-full text-left cursor-pointer"
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Create
                              </span>
                            </button>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/image-upload"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                }  duration-200`}
                              >
                                Upload Photo
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/image-gallery"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                }  duration-200`}
                              >
                                Gallery
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/newsList"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                NewsList
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/allNews"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                All News
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/manage-categories"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Manage Categories
                              </span>
                            </NavLink>
                          </li>

                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/manage-type"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Manage Types
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/news-management/status-update"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Manage News
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/profile-management/biography"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Biography
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                activeCondition={pathname.includes("user-management")}
              >
                {(handleClick, open) => {
                  return (
                    <Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes("user-management")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
                              viewBox="0 0 24 24"
                            >
                              <path
                                className={`fill-current ${
                                  pathname.includes("user-management")
                                    ? "text-indigo-500"
                                    : "text-slate-600"
                                }`}
                                d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
                              />
                              <path
                                className={`fill-current ${
                                  pathname.includes("user-management")
                                    ? "text-indigo-300"
                                    : "text-slate-400"
                                }`}
                                d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
                              />
                            </svg>
                            <span
                              className={`text-sm font-medium ml-3 lg:opacity-0 ${
                                sidebarExpanded && "lg:!opacity-100"
                              } duration-200`}
                            >
                              Manage Users
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div
                        className={`lg:hidden ${
                          sidebarExpanded && "lg:!block"
                        } 2xl:block`}
                      >
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/user-management/manage-role"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                }  duration-200`}
                              >
                                Role
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/user-management/applications"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                }  duration-200`}
                              >
                                Applications
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/user-management/account-status-control"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                }  duration-200`}
                              >
                                Status Control
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/user-management/approve-reject"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                }  duration-200`}
                              >
                                Approve/Reject User
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/user-management/manage-user"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Manage User
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end={true}
                              href="/admin/user-management/logs"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-indigo-500"
                                  : "text-slate-400 hover:text-slate-200")
                              }
                            >
                              <span
                                className={`text-sm font-medium lg:opacity-0 ${
                                  sidebarExpanded && "lg:!opacity-100"
                                } duration-200`}
                              >
                                Activity Logs
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <div className="flex items-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 shrink-0"
                >
                  <path
                    className="fill-current text-slate-600"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2.25c-1.518 0-2.924.574-4 1.616A6.75 6.75 0 1 0 12 21.75a6.75 6.75 0 1 0 0-13.5c-.71 0-1.396.114-2.032.33m0 0a4.5 4.5 0 1 1 2.032-2.032m0 0a6.708 6.708 0 0 1 2.032-.33 6.75 6.75 0 0 1 0 13.5 6.75 6.75 0 0 1-4-12.034m0 0a4.5 4.5 0 1 1-2.032 2.032"
                  />
                </svg>

                <span
                  className={`text-sm font-medium ml-3 lg:opacity-0 ${
                    sidebarExpanded && "lg:!opacity-100"
                  }  duration-200`}
                >
                  <div className="mb-1 last:mb-0">
                    <NavLink
                      end={true}
                      href="/admin/user-profile"
                      className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                    >
                      <span
                        className={`text-sm font-medium lg:opacity-0 ${
                          sidebarExpanded && "lg:!opacity-100"
                        }  duration-200`}
                      >
                        Account
                      </span>
                    </NavLink>
                  </div>
                </span>
              </div>
              <div className="flex items-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 shrink-0"
                >
                  <path
                    className="fill-current text-slate-600"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v3m0 12v3m6-15-2.5 2.5m-6 0L6 6m12 6h3m-15 0H3m6 6-2.5-2.5m6 0L12 18m0-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                  />
                </svg>

                <span
                  className={`text-sm font-medium ml-3 lg:opacity-0 ${
                    sidebarExpanded && "lg:!opacity-100"
                  }  duration-200`}
                >
                  <div className="mb-1 last:mb-0">
                    <NavLink
                      end={true}
                      href="/admin/site-settings"
                      className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                    >
                      <span
                        className={`text-sm font-medium lg:opacity-0 ${
                          sidebarExpanded && "lg:!opacity-100"
                        }  duration-200`}
                      >
                        Settings
                      </span>
                    </NavLink>
                  </div>
                </span>
              </div>
            </div>
          </div>
          {/* logout */}
          <div className="pt-4 mt-auto border-t border-slate-700">
            <div
              className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer px-3 py-2 transition"
              onClick={logout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 shrink-0"
              >
                <path
                  className="fill-current text-slate-600"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>

              <span
                className={`text-sm font-medium ml-3 lg:opacity-0 ${
                  sidebarExpanded && "lg:!opacity-100"
                }  duration-200`}
              >
                <div className="mb-1 last:mb-0">
                  <span
                    className={`text-sm font-medium lg:opacity-0 cursor-pointer ${
                      sidebarExpanded && "lg:!opacity-100"
                    }  duration-200`}
                  >
                    Logout
                  </span>
                </div>
              </span>
            </div>
            <div className="flex justify-center mt-3 mb-10">
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                {sidebarExpanded ? (
                  <ArrowLeft width={50} size={35} />
                ) : (
                  <ArrowRight width={50} size={35} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
