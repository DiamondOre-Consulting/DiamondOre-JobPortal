import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const Employeesignup = () => {
    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login"); // Redirect to login page if not authenticated
      return;
    }
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [added, setadded] = useState(null);
    

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          // No token found, redirect to login page
          navigate("/admin-login");
        } else {
          const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds
    
          if (tokenExpiration && tokenExpiration < Date.now()) {
            // Token expired, remove from local storage and redirect to login page
            localStorage.removeItem("token");
            navigate("/admin-login");
          }
        }

      }, [decodedToken]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setadded(null)
        console.log(name,email,password)
        try {
          const response = await axios.post(
            "https://diamond-ore-job-portal-backend.vercel.app/api/employee/add-emp",
            {
              name,
              email,
              password,
             
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
          );
          console.log("fetching response ",response)
        
          if (response.status === 201) {
            console.log("User Registered Successfully!!!");
            setadded("Employee Added Sucessfully!!!")
            navigate('/employee-login')
          } else {
            console.log("Signup failed");
            setError("Some details are wrong!!");
            // Handle signup error
          }
        } catch (error) {
          console.error("Error signing up:", error);
          setError("Some details are wrong!!");
          // Handle error
        }
      };
    
      const handleShowPassword = () => {
        return setShowPass(!showPass);
      };
    
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">
                <h1 className="text-center text-2xl font-bold text-blue-950 sm:text-3xl font-serif">
                    Get Started Today
                </h1>
                <div className="mx-auto h-0.5 w-24 bg-blue-950 border-rounded"></div>

                <form
                    onSubmit={handleSignup}
                    className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white shadow-gray-300"
                >
                    <p className="text-center text-lg font-medium font-serif">
                        Add Employee
                    </p>

                    <div>
                        <label htmlFor="name" className="sr-only">
                            Full Name
                        </label>

                        <div className="relative">
                            <input
                                className="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                            </span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>

                        <div className="relative">
                            <input
                                className="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm"
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                <svg class="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="3" y="5" width="18" height="14" rx="2" />  <polyline points="3 7 12 13 21 7" /></svg>
                            </span>
                        </div>
                       
                    </div>

                   

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                className="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm"
                                type={showPass ? "password" : "text"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {showPass ? (
                                <span
                                    onClick={handleShowPassword}
                                    className="text-gray-500 cursor-pointer absolute inset-y-0 end-0 grid place-content-center px-4"
                                >
                                    <svg
                                        width="16px"
                                        height="16px"
                                        className="mt-8"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="#aea3a3"
                                    >
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g
                                            id="SVGRepo_tracerCarrier"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                            {" "}
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L12.3421 9.22069C13.615 9.37575 14.6243 10.385 14.7793 11.6579L15.9202 12.7988ZM9.54012 10.6614C9.32325 11.059 9.2 11.5151 9.2 12C9.2 13.5464 10.4536 14.8 12 14.8C12.4849 14.8 12.941 14.6768 13.3386 14.4599L14.212 15.3332C13.5784 15.7545 12.8179 16 12 16C9.79086 16 8 14.2091 8 12C8 11.1821 8.24547 10.4216 8.66676 9.78799L9.54012 10.6614Z"
                                                fill="#222222"
                                            ></path>{" "}
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L12.3421 9.22069C13.615 9.37575 14.6243 10.385 14.7793 11.6579L15.9202 12.7988ZM9.54012 10.6614C9.32325 11.059 9.2 11.5151 9.2 12C9.2 13.5464 10.4536 14.8 12 14.8C12.4849 14.8 12.941 14.6768 13.3386 14.4599L14.212 15.3332C13.5784 15.7545 12.8179 16 12 16C9.79086 16 8 14.2091 8 12C8 11.1821 8.24547 10.4216 8.66676 9.78799L9.54012 10.6614Z"
                                                fill="#222222"
                                            ></path>{" "}
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M16.2269 17.3482L15.3456 16.4669C14.2995 17.032 13.1682 17.4 12 17.4C10.3574 17.4 8.78776 16.6724 7.42553 15.6924C6.06805 14.7157 4.96726 13.5246 4.2751 12.6842C4.07002 12.4353 3.95903 12.298 3.89057 12.1833C3.83749 12.0943 3.82973 12.0508 3.82973 12C3.82973 11.9492 3.83749 11.9057 3.89057 11.8167C3.95903 11.7019 4.07002 11.5647 4.2751 11.3157C4.94359 10.5041 5.99326 9.36531 7.28721 8.40853L6.43 7.55132C5.09517 8.56383 4.02754 9.72881 3.34884 10.5528L3.28531 10.6296C2.95969 11.0225 2.62973 11.4206 2.62973 12C2.62973 12.5794 2.95969 12.9775 3.28531 13.3704L3.34884 13.4472C4.07678 14.331 5.25214 15.607 6.72471 16.6665C8.19255 17.7225 10.0069 18.6 12 18.6C13.5418 18.6 14.9767 18.0749 16.2269 17.3482ZM9.11302 5.9917C10.0141 5.62811 10.9838 5.39999 12 5.39999C13.9931 5.39999 15.8075 6.27749 17.2753 7.33354C18.7479 8.39299 19.9232 9.66903 20.6512 10.5528L20.7147 10.6296C21.0403 11.0225 21.3703 11.4206 21.3703 12C21.3703 12.5794 21.0403 12.9775 20.7147 13.3704L20.6512 13.4472C20.1695 14.032 19.4919 14.7886 18.6618 15.5405L17.8122 14.6909C18.6047 13.9781 19.2578 13.2513 19.7249 12.6842C19.93 12.4353 20.041 12.298 20.1094 12.1833C20.1625 12.0943 20.1703 12.0508 20.1703 12C20.1703 11.9492 20.1625 11.9057 20.1094 11.8167C20.041 11.7019 19.93 11.5647 19.7249 11.3157C19.0328 10.4754 17.932 9.28428 16.5745 8.30763C15.2123 7.32757 13.6426 6.59999 12 6.59999C11.3344 6.59999 10.6808 6.71946 10.0481 6.92677L9.11302 5.9917Z"
                                                fill="#2A4157"
                                                fillOpacity="0.24"
                                            ></path>{" "}
                                            <path
                                                d="M5 2L21 18"
                                                stroke="#222222"
                                                strokeWidth="1.2"
                                            ></path>{" "}
                                        </g>
                                    </svg>
                                </span>
                            ) : (
                                <span
                                    onClick={handleShowPassword}
                                    className="text-gray-500 cursor-pointer absolute inset-y-0 end-0 grid place-content-center px-4"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 text-center mt-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Sign up button  */}

                    <button
                        type="submit"
                        className={`block w-full rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white ${!name || !email || !password
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                            }`}
                        disabled={!name || !email || !password}
                    >
                        Sign up
                    </button>

                    {/* Sign up button ends  */}

                    <p className="text-center text-sm text-gray-500">
                        Have account already?
                        <Link to={"/employee-login"} className="underline cursor-pointer text-blue-900">
                            Sign in
                        </Link>
                    </p>
                </form>

                {/* {error && (
                    <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
                        <p className="text-center text-sm text-red-500">{error}</p>
                    </div>
                )} */}
                
                {added && (
                    <div className="flex items-center justify-center bg-green-400 p-4 rounded-md">
                        <p className="text-center text-sm text-white">{added}</p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Employeesignup