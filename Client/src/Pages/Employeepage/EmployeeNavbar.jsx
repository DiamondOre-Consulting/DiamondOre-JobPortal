import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import axios from "axios";



const EmployeeNavbar = () => {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isDropdownOpenERP, setIsDropdownOpenERP] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Token not found in local storage, handle the error or redirect to the login page
          console.error("No token found");
          navigate("/employee-login");
          return;
        }

        // Fetch associates data from the backend
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/employee/user-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          ;
          setUserData(response.data);
        } else {
          ;
          setUserData("Did not get any response!!!");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        // Handle error and show appropriate message
      }
    };

    fetchUserData();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // const toggleDropdownERP = () => {
  //   setIsDropdownOpenERP(!isDropdownOpenERP);
  // };

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
    window.location.href = "/employee-login";

  };
  return (
    <div>
      {/* Header and Nav Section Start */}
      <div className="bg-white pb-6 sm:pb-8 lg:pb-6">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="mb-8 flex items-center justify-between py-2 md:mb-12 md:py-2 xl:mb-8">
            <a href="/">
              <img className="w-full h-16" src={Logo} alt="DiamondOre Logo" />
            </a>
            <div className="flex justify-between items-center gap-8">
              <nav className="hidden sm:gap-10 md:gap-12 lg:gap-16 lg:flex">
                <Link
                  to={"/employee-dashboard"}
                  className="text-md font-semibold text-blue-950"
                >
                  Home
                </Link>
                <Link
                  to={"/employee-leaves"}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Leaves
                </Link>
                <Link
                  to={"/employee-performence"}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Perfomence
                </Link>

                <a href="https://referbiz.in/" target="_blank">
                  Refer & Earn
                </a>



              </nav>

              <div
                className="hidden lg:inline-block relative text-left"
                ref={dropdownRef}
              >
                <img
                  onClick={toggleDropdown}
                  className="cursor-pointer rounded-full w-12 h-12 hover:border-4 hover:border-blue-950"
                  src={userData?.profilePic}
                  alt="account"
                />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-8 top-6 mt-12 py-2 w-lg bg-gray-200 rounded-md shadow-lg">

                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            )}

            {/* {isDropdownOpenERP && (
            <div className="absolute right-24 top-6 mt-12 py-2 w-lg bg-gray-200 rounded-md shadow-lg">
              <Link
                className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                onClick={toggleDropdown}
              >
                Latest
              </Link>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Add New
              </a>
            </div>
          )} */}

            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center gap-2 rounded-lg  px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300  focus-visible:ring active:text-gray-700 md:text-base lg:hidden"
            >
              <img
                onClick={toggleDropdown}
                className="cursor-pointer rounded-full w-12 h-12 hover:border-4 hover:border-blue-950"
                src={userData?.profilePic}
                alt="account"
              />

            </button>
          </header>
          <ul
            className={`gap-10 ${menuOpen ? "block" : "hidden"
              } w-full flex flex-col items-center justify-center mb-14`}
          >
            <Link to={"/employee-dashboard"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } transition ease-in-out delay-150 px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Home
              </li>
            </Link>
            <Link to={"/employee-leaves"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Leaves
              </li>
            </Link>
            <Link href={"/employee-performence"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Performence
              </li>
            </Link>

            <a href="https://referbiz.in/" target="_blank">
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Refer & Earn
              </li>
            </a>
            <Link
              to="#"
              className="px-32 py-3 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </ul>
        </div>
      </div>
      {/* Header and Nav Section End */}
    </div>
  )
}

export default EmployeeNavbar