import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import axios from "axios";

const AdminNav = () => {
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
          navigate("/admin-login");
          return;
        }

        // Fetch associates data from the backend
        const response = await axios.get(
          "https://api.diamondore.in/api/admin-confi/user-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          console.log(response.data);
          setUserData(response.data);
        } else {
          console.log(response.data);
          setUserData("Did not get any response!!!");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
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
    console.log(menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.to = "/admin-login";
    console.log("Logging out");
  };
  return (
    <div>
      {/* Header and Nav Section Start */}
      <div className="bg-white pb-6 sm:pb-8 lg:pb-6">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="mb-8 flex items-center justify-between py-2 md:mb-12 md:py-2 xl:mb-8">
            <Link to="/">
              <img className="w-full h-16" src={Logo} alt="DiamondOre Logo" />
            </Link>
            <div className="flex justify-between items-center gap-8">
              <nav className="hidden sm:gap-10 md:gap-12 lg:gap-16 lg:flex">
                <Link
                  to={"/admin-dashboard"}
                  className="text-md font-semibold text-blue-950"
                >
                  Home
                </Link>
                <Link
                  to={"/admin/all-jobs"}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  All Jobs
                </Link>
                <Link
                  to={"/admin/all-candidates"}
                  className="text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  All Candidates
                </Link>
                <Link
                  to={'/admin/erp-dashboard'}
                  className="cursor-pointer text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  ERP
                </Link>

                <Link
                  to={'/admin/add-jobs'}
                  className="cursor-pointer text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  AddJobs
                </Link>

                <Link
                  to={'/admin/prompt'}
                  className="cursor-pointer text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Prompt
                </Link>
              </nav>

              <div
                className="hidden lg:inline-block relative text-left"
                ref={dropdownRef}
              >
                <img
                  onClick={toggleDropdown}
                  className="cursor-pointer rounded-full w-12 h-12 hover:border-4 hover:border-blue-950 object-cover object-position-center"
                  src={userData?.profilePic}
                  alt="account"
                />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-8 top-6 mt-12 py-2 w-lg bg-white shadow-gray-200 rounded-md shadow-lg">
                <Link
                  to={'/employee-signup'}
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"

                >
                  AddEmployee
                </Link>

                <Link
                  to={'/admin-all-employee'}
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"

                >
                  All Employee
                </Link>
                <Link to={'/admin/edit-profile'}
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={toggleDropdown}
                >
                  Edit Profile
                </Link>

                
                <Link to={'/admin-signup'} 
                className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                onClick={toggleDropdown}
                >
                  Make An Admin
                </Link>

                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
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
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Add New
                </Link>
              </div>
            )} */}

            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center gap-2 rounded-lg  px-2.5 py-2 text-sm font-semibold text-white ring-indigo-300  active:text-gray-700 md:text-base lg:hidden"
            >
               <img
                  onClick={toggleDropdown}
                  className="cursor-pointer rounded-full w-12 h-12 border border-1 border-black object-cover object-position-center"
                  src={userData?.profilePic}
                  alt="account"
                />

            </button>
          </header>
          <ul
            className={`gap-10 ${menuOpen ? "block" : "hidden"
              } w-full flex flex-col items-center justify-center mb-14`}
          >
            <Link to={"/admin-dashboard"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } transition ease-in-out delay-150 px-22 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Home
              </li>
            </Link>
            <Link to={"/admin/all-jobs"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                All Jobs
              </li>
            </Link>
            <Link to={"/admin/all-candidates"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-12 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                All Candidates
              </li>
            </Link>
            <Link to={"/admin/erp-dashboard"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Erp
              </li>
            </Link>

            <Link to={"/employee-signup"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                AddEmployee
              </li>
            </Link>

            <Link to={"/admin/add-jobs"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Add Jobs
              </li>
            </Link>
            <Link to={"/admin-all-employee"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-24 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                All Employees
              </li>
            </Link>
            <Link to={"/admin/edit-profile"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-28 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Edit Profile
              </li>
            </Link>

            <Link to={"/admin/prompt"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-28 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Prompt
              </li>
            </Link>

            <Link
              to="#"
              className="px-32 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250"
              onClick={handleLogout}
            >
              Logout
            </Link>
            <Link to={"/admin-signup"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-1 text-lg font-semibold bg-blue-900 text-white hover:bg-blue-950 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Signin
              </li>
            </Link>


          </ul>
        </div>
      </div>
      {/* Header and Nav Section End */}
    </div>
  );
};

export default AdminNav;
