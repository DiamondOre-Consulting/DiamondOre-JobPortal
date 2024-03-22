import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo2.png';
import { useJwt } from 'react-jwt';

const Navbar = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const { decodedToken } = useJwt(localStorage.getItem("token"));
  const { decodedToken } = useJwt(token || "No decoded Token Found yet"); 

  const handleSignup = () => {
    if (token && decodedToken && decodedToken.exp * 1000 > Date.now()) {
      if (decodedToken.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (decodedToken.role === 'candidate') {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(menuOpen);
  };
  return (
    <div className=''>
      {/* Header and Nav Section Start */}
      <div className="fixed top-0 z-50 w-full bg-gray-900 backdrop-blur-md bg-opacity-65">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="flex items-center justify-between py-2 md:mb-2 md:py-2 xl:mb-2 sm:mb-2">

            <img className='w-3/6 sm:w-2/6 md:w-1/6 h-auto z-40 py-2' src={Logo} alt="DiamondOre Logo" />

            <nav className="hidden gap-12 lg:flex cursor-pointer z-40">
              <Link to={'/'} href="#" className="text-lg font-semibold text-white">
                Home
              </Link>
              <Link to={'/about'}
                className="text-lg font-semibold text-white transition duration-100 hover:text-blue-950 active:text-blue-900"
              >
                About Us
              </Link>
              <Link to={'/services'}

                className="text-lg font-semibold text-white transition duration-100 hover:text-blue-950 active:text-blue-900"
              >
                Services
              </Link>
              <Link to={'/contact'}

                className="text-lg font-semibold text-white transition duration-100 hover:text-blue-950 active:text-blue-900"
              >
                Contact Us
              </Link>
            </nav>

            <div className="hidden lg:inline-block relative text-left">
              <button
                type="button"
                onClick={handleSignup}
                className="rounded-lg bg-blue-950 backdrop-blur-md bg-opacity-50 px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-blue-950 focus-visible:ring active:text-gray-700 md:text-base inline-flex items-center z-40"
              >
                <svg
                  className="w-4 h-4 text-white "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 14 18">
                  <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="ml-2 text-white z-40">Sign in</span>
              </button>
            </div>

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
            className={`gap-10 ${menuOpen ? "block" : "hidden"
              } w-full flex flex-col items-center justify-center mb-14`}
          >
            <Link to={"/"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } transition ease-in-out delay-150 px-32 py-3 text-white text-lg font-semibold hover:bg-blue-950 hover:text-white hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Home
              </li>
            </Link>
            <Link to={"/about"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-3 text-white text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                About Us
              </li>
            </Link>
            <Link to={"/services"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-3 text-white text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Services
              </li>
            </Link>
            <Link to={"/contact"}>
              <li
                className={`${menuOpen ? "block" : "hidden"
                  } px-32 py-3 text-white text-lg font-semibold hover:bg-blue-950 hover:text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-250`}
              >
                Contact Us
              </li>
            </Link>
            <a href='#'>
              <li
                onClick={handleSignup}
                className={`${menuOpen ? "block" : "hidden"
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
  )
}

export default Navbar
