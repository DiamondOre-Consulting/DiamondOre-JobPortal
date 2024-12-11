import React, { useState } from 'react'
import axios from "axios";
import simg from '../../assets/signupimg.svg';
import { Link } from "react-router-dom";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            alert("enter you Email id")
            return;
        }

        try {

            const response = await axios.post("https://api.diamondore.in/api/candidates/forgot-password", {
                email
            })

            setTimeout(() => {
                if (response.status === 201) {
                    setOtpSent(true);

                }
            }, 1000);
        } catch (error) {
            console.error("Error sending OTP:", error);

        }
    };

    const updatePassword = async (e) => {

        e.preventDefault();
        if (!password || !otp || !email) {
            alert("Filling all the feild are compulsory")
            return;
        }

        try {

            const response = await axios.put("https://api.diamondore.in/api/candidates/update-password",
                {
                    otp,
                    password,
                    email,
                })


            if (response.status === 200) {
                alert("Password has been Updated Sucessfully...");

                setEmail("");
                setPassword("");
                setOtp("");
            }
        }
        catch (error) {

            if (error.response) {
                const status = error.response.status;
                if (status === 404) {
                    alert("User not found");
                } else {
                    alert("An error occurred while in updating password. Please try again later.");
                }
            } else {
                alert("An error occurred while updating password.");
            }
        }


    }


    return (
        <>

            <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
                <div className="max-w-screen-xl sm:max-w-screen-lg md:max-w-screen-md lg:max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-md  w-full sm:w-full lg:min-w-screen m-8">
                    <div className="space-y-4 ">
                        <form
                            onSubmit={updatePassword}
                            className="mb-0 mt-6 space-y-4 rounded-lg p-4  sm:p-6 lg:p-8 "
                        >
                            <h1 className=" text-2xl font-bold sm:text-3xl">
                                Forgot Password ?
                            </h1>

                            <p className="text-lg font-medium text-gray-400 !mt-0">
                            </p>

                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>

                                <div className="relative">
                                    <input
                                        className="w-8/12 lg:w-9/12 sm:8/12 md:5/12  bg-white rounded-lg border-2 p-4 pe-12 text-sm shadow-sm"
                                        type="email"
                                        placeholder="Useremail@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    {/* <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                        <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="3" y="5" width="18" height="14" rx="2" />  <polyline points="3 7 12 13 21 7" /></svg>
                                    </span> */}
                                    <button
                                        onClick={handleSendOtp}
                                        className={`ml-2 rounded-lg bg-blue-900 hover:bg-blue-950 px-3 py-3 text-sm font-medium text-white  mt-2 mb-2`}

                                    >
                                        Send OTP
                                    </button>
                                </div>
                            </div>



                            <div>
                                <label htmlFor="otp" className="sr-only">
                                    Otp
                                </label>

                                <div className="relative">
                                    <input
                                        className="w-full bg-white rounded-lg border-gray-500 border-2 p-4 pe-12 text-sm shadow-sm"
                                        type="opt"
                                        placeholder=" Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="w-full rounded-lg border-2 p-4 pe-12 text-sm shadow-sm"

                                        placeholder="Enter your Updated Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                </div>

                                <label for="check">Show Password</label>
                                <input
                                    className='ml-2'
                                    id="check"
                                    type="checkbox"
                                    value={showPassword}
                                    onChange={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                />

                            </div>

                            <button
                                type="submit"
                                onClick={updatePassword}
                                className="block w-full rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white"
                            >
                                Update Password
                            </button>

                            <p className="text-center text-gray-500 my-10">
                                No account?
                                <Link to={'/signup'} className="underline cursor-pointer">
                                    Sign up
                                </Link>
                            </p>
                            <Link
                                to={"/login"}
                                className="text-center text-sm text-gray-500 cursor-pointer"
                            >
                                Login
                            </Link>
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
        </>
    )
}

export default ForgotPassword