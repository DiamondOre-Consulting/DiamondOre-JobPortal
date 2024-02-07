import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import axios from "axios";

const CandidateNav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

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
            "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/user-data",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if(response.status==200) {
            console.log(response.data);
            setUserData(response.data);
          } else {
            console.log(response.data);
            setUserData("Did not get any response!!!")
          }
        } catch (error) {
          console.error("Error fetching associates:", error);
          // Handle error and show appropriate message
        }
      };
  
      fetchUserData();
    }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");;
    window.location.href = "/login";
    console.log("Logging out");
  };

  const profilePicUrl = userData?.profilePic ? `${userData.profilePic}?${userData.profilePic}` : 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=';
  return (
    <div>
      {/* Header and Nav Section Start */}
      <div className="bg-white pb-6 sm:pb-8 lg:pb-6">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="mb-8 flex items-center justify-between py-2 md:mb-12 md:py-2 xl:mb-8">
          <img className='w-3/6 sm:w-2/6 md:w-1/6 h-auto z-40' src={Logo} alt="DiamondOre Logo" />

            <div className="flex justify-between items-center gap-8">
              <nav className="hidden gap-16 lg:flex">
                <Link to={'/dashboard'} className="text-md font-semibold text-blue-950 ">
                  Home
                </Link>
                <Link
                  to={'/all-jobs'}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  All Jobs
                </Link>
                <Link
                  to={'/all-applied-jobs'}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Applied Jobs
                </Link>
                <Link
                  href="#"
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Specialized
                </Link>
              </nav>

              <div className="hidden lg:inline-block relative text-left" ref={dropdownRef}>
                <img onClick={toggleDropdown} className="border-2 border-blue-900 cursor-pointer rounded-full w-12 h-12 hover:border-2 hover:border-blue-900" src={profilePicUrl} alt="account" />
              </div>
            </div>

            {isDropdownOpen && (
                  <div className="absolute right-8 top-6 mt-12 py-2 w-lg bg-white shadow-gray-300 rounded-md shadow-lg">
                    <Link
                      to={'/candidate/profile'}
                      className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                      onClick={toggleDropdown}
                    >
                      Edit Profile
                    </Link>
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
              className="inline-flex items-center gap-2 rounded-lg bg-blue-950 px-2.5 py-2 text-sm font-semibold text-gray-100 z-40  md:text-base lg:hidden"
            >
              <svg
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
              </svg>
              
            </button>
          </header>
          <ul
            className={`gap-10 ${
              menuOpen ? "block" : "hidden"
            } w-full flex flex-col items-center justify-center mb-14`}
          >
            <a href={"/dashboard"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } transition ease-in-out delay-150 px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Home
              </li>
            </a>
            <a href={"/all-jobs"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                All jobs
              </li>
            </a>
            <a href={"/all-applied-jobs"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-24 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Applied jobs
              </li>
            </a>
            <a href={"/"}>
              <li
                className={`${
                  menuOpen ? "block" : "hidden"
                } px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                specilised
              </li>
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
      {/* Header and Nav Section End */}
    </div>
  );
};

export default CandidateNav;
