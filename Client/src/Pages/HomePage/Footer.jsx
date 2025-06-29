import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logoblue.png";
import instalogo from "../../assets/instaicon.png";
import { FaInstagram } from "react-icons/fa6";
import { LuYoutube } from "react-icons/lu";
import instaicon from "../../assets/instaicon.png";
import youtubeicon from "../../assets/youtubeicon.png";

const Footer = () => {
  return (
    <div>
      <footer className="bg-white">
        <div className="pb-16 pt-4 sm:pt-10 lg:pt-12">
          <div className="mx-auto max-w-screen-2xl lg:px-4 px-10 md:px-8 sm:px-16">
            <div className="grid grid-cols-2 gap-12 border-t pt-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-8 lg:pt-12">
              <div className="col-span-full lg:col-span-2">
                <div className="mb-4 w-2/4">
                  <img src={Logo} alt="" />
                </div>

                <p className="text-gray-500 sm:pr-8">
                  Empowering Success, Enriching Lives. Your journey starts here
                  with <b>Diamond Ore Consulting Pvt Ltd,</b> your trusted
                  placement consulting company.
                </p>
                <div className="my-4 md:p-6   space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                      Our Socials
                    </h2>
                    <div className="flex gap-10 items-center">
                      <div className="flex flex-col items-center hover:scale-105 transition">
                        <a
                          href="https://www.instagram.com/diamondoreconsulting?igsh=ZXpwZWxpc2t0YTIz"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={instaicon} alt="" className="w-8" />
                          <instaicon className="text-pink-600 text-3xl mb-1" />
                        </a>
                        <p className="text-sm text-gray-700">DiamondOre</p>
                      </div>

                      <div className="flex flex-col items-center hover:scale-105 transition">
                        <a
                          href="https://youtube.com/@diamondore-career?si=FTT-w0fUn63CuPX3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={youtubeicon} alt="" className="w-9" />
                        </a>
                        <p className="text-sm text-gray-700">YouTube</p>
                      </div>
                    </div>
                  </div>

                  {/* Our Other Properties */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                      Our Other Properties
                    </h2>
                    <div className="flex flex-wrap gap-10 items-center">
                      <div className="flex flex-col items-center hover:scale-105 transition">
                        <a
                          href="https://www.instagram.com/profile_genie_1?igsh=MW01amE5aHVwMTVpaw=="
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={instaicon} alt="" className="w-8" />
                        </a>
                        <p className="text-sm text-gray-700 text-center">
                          Profile Genie
                        </p>
                      </div>

                      <div className="flex flex-col items-center hover:scale-105 transition">
                        <a
                          href="https://www.instagram.com/cv_genie_?igsh=bzIwdGQ1aHp6a3Vz"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={instaicon} alt="" className="w-8" />
                        </a>
                        <p className="text-sm text-gray-700 text-center">
                          CV Genie
                        </p>
                      </div>

                      <div className="flex flex-col items-center hover:scale-105 transition">
                        <a
                          href="https://www.instagram.com/doc_labz?igsh=YzBsY25wZWM1aXNp"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={instaicon} alt="" className="w-8" />
                        </a>
                        <p className="text-sm text-gray-700 text-center">
                          DOC LABZ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
                  Products
                </div>

                <nav className="flex flex-col gap-4">
                  <div>
                    <Link
                      to={"/all-jobs-page"}
                      href="#"
                      className="text-gray-500 transition duration-100 hover:text-blue-950 active:text-bg blue-950 "
                    >
                      Jobs
                    </Link>
                  </div>

                  {/* <div>
                    <a
                      href="https://www.cvgenie.in/"
                      target="_blank"
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      CV-Genie
                    </a>
                  </div>

                  <div>
                    <a
                      href="https://www.doclabz.com/"
                      target="_blank"
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      DOC-Labz
                    </a>
                  </div> */}

                  <div>
                    <Link
                      to={"/be-our-client"}
                      href="#"
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Be Our Client
                    </Link>
                  </div>
                </nav>

                <div className="mb-4 mt-4 font-bold uppercase tracking-widest text-gray-800">
                  Other Products
                </div>

                <nav className="flex flex-col gap-4">
                  <div>
                    <a
                      href="https://www.cvgenie.in/"
                      target="_blank"
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      CV-Genie
                    </a>
                  </div>

                  <div>
                    <a
                      href="https://www.doclabz.com/"
                      target="_blank"
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      DOC-Labz
                    </a>
                  </div>
                </nav>
              </div>

              <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
                  Company
                </div>

                <nav className="flex flex-col gap-4">
                  <div>
                    <Link
                      to={"/about"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      About
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={"/about#ourteam"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Team
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={"/admin-login"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Admin login
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={"/employee-login"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Doc login
                    </Link>
                  </div>
                </nav>
              </div>

              <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
                  Support
                </div>

                <nav className="flex flex-col gap-4">
                  <div>
                    <Link
                      to={"/contact"}
                      href="#"
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Contact Us
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={"/fAQ"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      FAQ
                    </Link>
                  </div>
                </nav>
              </div>

              <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
                  Legal
                </div>

                <nav className="flex flex-col gap-4">
                  <div>
                    <Link
                      to={"/terms-and-conditions"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Terms of Service
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={"/privacy-policy"}
                      className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 py-4">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex items-center align-center justify-between gap-4 ">
              <span className="text-sm text-gray-400">
                {" "}
                © 2024 - Diamond Ore Pvt Ltd . All rights reserved.{" "}
              </span>

              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/diamondoreconsultingpvtltd?igsh=ZG0zeW42Ynk5OTk5"
                  target="_blank"
                  className="text-gray-400 transition duration-100 hover:text-blue-950 active:text-gray-600"
                >
                  <svg
                    className="h-5 w-5 hover:text-blue-950"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://www.youtube.com/@DiamondOre-Career"
                  target="_blank"
                  className="text-gray-400 transition duration-100 hover:text-blue-950 active:text-gray-600"
                >
                  <svg
                    className="h-6 w-6 text-gray-500 hover:text-blue-950"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />{" "}
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61555444963500&mibextid=ZbWKwL"
                  target="_blank"
                  className="text-gray-400 transition duration-100 hover:text-blue-950 active:text-gray-600"
                >
                  <svg
                    className="h-6 w-6 text-gray-400 hover:text-blue-950"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
