import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import axios from "axios";
import Banner from "./Banner";

const CandidateNav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Token not found in local storage, handle the error or redirect to the login page
          console.error("No token found");
          navigate("/login");
          return;
        }

        // Fetch associates data from the backend
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/candidates/user-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          setUserData(response.data);
        } else {
          setUserData("Did not get any response!!!");
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            alert("User Not Found");
          } else {
          }
        } else {
        }
      }
    };
    fetchUserData();
  }, []);

  //delete account

  const deleteAccount = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/candidates/remove-account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setShowPopup(true);
        window.alert("Your account has been deleted");
        navigate("/login");
      }
    } catch (error) {}
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const profilePicUrl = userData?.profilePic
    ? `${userData.profilePic}?${userData.profilePic}`
    : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
  return (
    <div>
      {/* Header and Nav Section Start */}
      <div className="bg-white pb-2 sm:pb-2 lg:pb-2">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="mb-8 flex items-center justify-between py-2 md:mb-12 md:py-2 xl:mb-8">
            <img
              className="w-3/6 sm:w-2/6 md:w-1/6 h-auto z-40"
              src={Logo}
              alt="DiamondOre Logo"
            />

            <div className="flex justify-between items-center gap-8">
              <nav className="hidden gap-16 lg:flex">
                <Link
                  to={"/dashboard"}
                  className="text-md font-semibold text-blue-950 "
                >
                  Home
                </Link>
                <Link
                  to={"/all-jobs"}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  All Jobs
                </Link>
                <Link
                  to={"/all-applied-jobs"}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Applied Jobs
                </Link>
                {/* <Link
                  to={'/portfolio'}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Create Portfolio
                </Link> */}
                <a
                  href="https://referbiz.in/"
                  target="_blank"
                  className=" text-md font-semibold text-gray-6000 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Refer & Earn
                </a>
              </nav>

              <div
                className="hidden lg:inline-block relative text-left"
                ref={dropdownRef}
              >
                <img
                  onClick={toggleDropdown}
                  className="border-2 border-blue-900 cursor-pointer rounded-full w-12 h-12 hover:border-2 hover:border-blue-900"
                  src={profilePicUrl}
                  alt="account"
                />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-8 top-6 mt-12 py-2 w-lg bg-white shadow-gray-300 rounded-md shadow-lg z-50">
                <Link
                  to={"/edit/profile-page"}
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={toggleDropdown}
                >
                  Edit Profile
                </Link>

                <Link
                  to={"/edit-prefrence-form"}
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={toggleDropdown}
                >
                  Edit Prefrence form
                </Link>

                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowPopup(true);
                  }}
                >
                  Delete Account
                </a>

                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center gap-2 rounded-lg  px-2.5 py-2 text-sm font-semibold text-gray-100 z-40  md:text-base lg:hidden"
            >
              <img
                onClick={toggleDropdown}
                className="border border-1 border-black cursor-pointer rounded-full w-14 h-14"
                src={profilePicUrl}
                alt="account"
              />
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg> */}
            </button>
          </header>
          <ul
            className={`gap-10 ${
              menuOpen ? "block" : "hidden"
            } w-full flex flex-col items-center justify-center mb-14`}
          >
            <Link to={"/dashboard"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } transition ease-in-out delay-150 px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Home
              </li>
            </Link>
            <Link to={"/all-jobs"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                All jobs
              </li>
            </Link>
            <Link to={"/all-applied-jobs"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-24 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Applied jobs
              </li>
            </Link>

            {/* <Link to={"/portfolio"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-24 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Create Portfolio
              </li>
            </Link> */}

            <a href="https://referbiz.in/" target="_blank">
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-16 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Reffer & Earn
              </li>
            </a>
            <Link to={"/edit/profile-page"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-24 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Edit Profile
              </li>
            </Link>

            <Link to={"/edit-prefrence-form"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-24 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Edit Prefrence
              </li>
            </Link>

            <a
              href="#"
              className="block px-4 py-2 text-lg text-center text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setShowPopup(true);
              }}
            >
              Delete Account
            </a>

            <a
              href="#"
              className="px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250"
              onClick={handleLogout}
            >
              Logout
            </a>
            <a href={"/signup"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-32 py-3 text-lg font-semibold bg-blue-900 text-white hover:bg-blue-950 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Signin
              </li>
            </a>
          </ul>
        </div>
      </div>

      {showPopup ? (
        <div
          className={`fixed inset-0 flex items-center z-10 justify-center ${
            showPopup ? "visible" : "hidden"
          }`}
        >
          <section className="rounded-3xl shadow-xl bg-white">
            <div className="p-4 text-center sm:p-12">
              <svg
                class="w-20 h-20 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="mt-6 text-gray-700 text-xs te lg:text-xl md:xl sm:text-sm font-bold">
                Are you sure you want to delete this Account?
              </h2>
              <div className="flex justify-center align-center ">
                <button
                  className="mt-8 inline-block w-1/2 rounded-md bg-red-600 py-4 text-sm font-bold text-white shadow-md hover:bg-red-700"
                  onClick={deleteAccount}
                >
                  Yes, I'm Sure
                </button>

                <button
                  className="ml-4  mt-8 inline-block w-1/2 rounded-md border-1 bg-gray-100 py-4 text-sm font-bold text-gray-600 shadow-md  "
                  onClick={handleClose}
                >
                  No , cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        ""
      )}

      {/* {
        (userData?.
          preferredFormStatus === false) ?
          (
            <>
              <div className="bg-white pb-6 sm:pb-8 lg:pb-12">

                <div className="relative flex flex-wrap bg-blue-950 px-4 py-3 sm:flex-nowrap sm:items-center sm:justify-center sm:gap-3 sm:pr-8 md:px-8">
                  <div className="order-1 mb-2 inline-block w-11/12 max-w-screen-sm text-sm text-white sm:order-none sm:mb-0 sm:w-auto md:text-base"><Link to={'/prefrence-form'}><span className='underline'>Click here</span></Link> to Fill the form to get your Job according to your Prefrences</div>
                </div>
              </div>
            </>

          ) :
          (
            <>

            </>
          )
      } */}
    </div>
  );
};

export default CandidateNav;
