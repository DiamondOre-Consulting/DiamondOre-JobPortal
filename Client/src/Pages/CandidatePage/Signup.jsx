import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import simg from '../../assets/signupimg.svg';

const Signup = ({ toggleForm }) => {
  let [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showLoaderResume , setShowLoaderResume] = useState(false);


  const handleUploadImage = async (e) => {
    try {
      setShowLoader(true);
      e.preventDefault();
      setError(null);
      const formData = new FormData();
      formData.append("myFileImage", profilePic);
      const response = await axios.post(
        "https://api.diamondore.in/api/candidates/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        ;
        setProfilePicUrl(response.data);  
        setShowLoader(false);
      }
      else if (response.status === 500) {
        setError("Please Upload your profile image Correctly")
        setShowLoader(false);
      }
      else {

        

      }
    } catch (error) {
      
    }
  };

  const handleUploadResume = async (e) => {
    try {
      setShowLoaderResume(true);
      e.preventDefault();
      setError(null);

      const formData = new FormData();
      formData.append("myFileResume", resume);
      const response = await axios.post(
        "https://api.diamondore.in/api/candidates/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // ;
        setResumeUrl(response.data);
        ;
        setShowLoaderResume(false);
      }
      else if (response.status === 500) {
        setError("Please Upload your resume Correctly")
        setShowLoaderResume(false);
      }
      else {

        

        setShowLoaderResume(false);
      }
    } catch (error) {
      
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);

    // Simulate sending OTP logic here
    try {
      // Simulate OTP sent successfully
      // For demonstration purposes, setting OTP sent to true after a delay
      const response = await axios.post("https://api.diamondore.in/api/candidates/send-otp", {
        email
      })

      setTimeout(() => {
        if (response.status === 201) {
          setOtpSent(true);
          
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Error sending OTP. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "https://api.diamondore.in/api/candidates/signup",
        {
          name,
          email,
          password,
          otp,
          phone,
          resume: resumeUrl,
          profilePic: profilePicUrl,
        }
      );

      if (response.status === 201) {
        
        navigate('/dashboard')
      }

    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 409) {
          setError("User already Exist");
        } else {
          setError("An error occurred while in signup. Please try again later.");
        }
      } else {
        setError("An error occurred while signup. Please try again later.");
      }
    }
  };

  const handleShowPassword = () => {
    return setShowPass(!showPass);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 bg-white rounded-md ">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 space-y-4">
            <form onSubmit=
              {handleSignup}
              className="space-y-4"


            >
              <h1 className=" text-3xl font-bold sm:text-3xl">
                Create Your Account
              </h1>
              <p className="text-lg font-medium !mt-0">
                Sign up to your account
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
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    className="w-8/12 lg:w-9/12 sm:8/12 md:5/12  rounded-lg border p-4 pe-12 text-sm shadow-sm"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={handleSendOtp}
                    className={` rounded-lg bg-blue-900 hover:bg-blue-950 px-3 py-3 ml-4 text-sm font-medium text-white  mt-2 mb-2`}

                  >
                    Send OTP
                  </button>

                </div>



              </div>

              {/* OTP input field starts */}
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="sr-only">
                    OTP
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm"
                      type="text"
                      id="otp"
                      name="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
              )}

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
                        className=""
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
                        className="h-6 w-6 text-gray-500 text-center "
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

              {/* Phone number feild starts */}

              <div className="flex items-center">
                <div className="w-full relative">
                  <input
                    className="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm"
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>

                  </span>

                </div>
              </div>

              {/* Profile Image upload feild starts  */}

              <div className="mt-1 ">
              <label className="block mb-2 text-md font-medium text-gray-900  font-bold text-2xl mb-4" for="file_input">Upload File</label>
                <div className="flex mb-8">
                  <input
                    className="w-full rounded-md border-0 pe-12 text-sm shadow-sm "
                    type="file"
                    name="profilePic"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />

                  <button
                    onClick={handleUploadImage}
                    className=" w-1/2 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                  >  {showLoader ? (
                    <svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                ) : (
                  <span>{profilePicUrl ? "Uploaded" : "Upload Image"}</span>   )}
                  </button>
                </div>


              </div>

              {/* Profile image upload feild ends  */}

              {/* Resume feild starts */}

              <div className="mt-1">
                <div className=" flex ">
                  <input
                    className="w-full rounded-lg border-gray-200 pe-12 text-sm shadow-sm"
                    type="file"
                    name="resume"
                    onChange={(e) => setResume(e.target.files[0])}
                  />

                  <button
                    onClick={handleUploadResume}
                    className=" w-1/2 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                     {showLoaderResume ? (
                    <svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                ) :(
                  <span>{resumeUrl ?  'Uploaded' : 'Upload Resume'}</span>)}
                  </button>
                </div>


              </div>

              {/* Resume feild ends */}

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
                <Link to={"/login"} className="underline cursor-pointer text-blue-900">
                  Sign in
                </Link>
              </p>
            </form>

            {error && (
              <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
                <p className="text-center text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center  rounded-lg  ">
            <div className="hidden md:block">
              <img src={simg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
