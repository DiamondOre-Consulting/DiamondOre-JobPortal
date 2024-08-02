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
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

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
          ;
          setUserData(response.data);
        } else {
          ;
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
    
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.to = "/admin-login";
    
  };


  const closePopup = () => {
    setShowPopup(false);
    setName("");
    setEmail("");
    setError(null)
  };



  //  POP UP

 const AddingRecruiter = async (e) => {
  setError(null);
  e.preventDefault();
  setShowLoader(true);

  try {
    const response = await axios.post("https://api.diamondore.in/api/admin-confi/register-recruiter-kam", {
      name,
      email,
    });

    if (response.status === 201) {
      setShowPopup(false);
      setShowLoader(false);
      setName("");
      setEmail("");
      setError(null); 
    }
  } catch (error) {
    console.error("Error Registering:", error);
    if (error.response) {
      const status = error.response.status;
      if (status === 402) {
        setError("Filling all the fields is required!");
      } else if (status === 401) {
        setError("This recruiter or KAM has already been registered!");
      }
    } else {
      setError("An error occurred while registering.");
    }
  } finally {
    setShowLoader(false); 
  }
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

                <Link
                  to={'/admin/all-reviews'}
                  className="cursor-pointer text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  All Reviews
                </Link>


                <Link
                  to={'/admin/all-employee'}
                  className="cursor-pointer text-md font-semibold text-gray-600 transition duration-100 hover:text-blue-950 active:text-blue-900"
                >
                  Goal Sheet
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
                <a
                  onClick={() => { setShowPopup(true) }}
                  className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100 cursor-pointer"

                >
                  Add Recruiter/KAM
                </a>
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
            <Link to={"/admin/all-reviews"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-24 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                All Reviews
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


            <a>
              <li
              onClick={()=>{setShowPopup(true)}}
                className={`${menuOpen ? "block" : "hidden"
                  } px-18 py-1 text-gray-600 text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                 Add Recruiter/KAM
              </li>
            </a>


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





      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-md md:w-full mx-10 md:mx-0">
            <button className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-3xl hover:bg-gray-100 px-2" onClick={closePopup}>
              &times;
            </button>
            <h2 className="text-2xl mb-4"> Add Recruiter/KAM </h2>
            <form onSubmit={AddingRecruiter}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name:</label>
                <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg" value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email:</label>
                <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>



              <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950" disabled={showLoader}>
                {showLoader ? (
                  <svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                ) : (<span class="relative z-10">Submit</span>
                )}</button>
            </form>
            {error && (
              <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
                <p className="text-center text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>



  );
};

export default AdminNav;
