import { React, useState } from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import simg from '../../assets/loginimg.svg';


const Employeelogin = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        // Perform login logic here
        try {
            console.log(email, password)
            const response = await axios.post("https://api.diamondore.in/api/employee/login",
                {
                    email,
                    password
                });
            // console.log("complete response ",response.data)

            if (response.status === 200) {
                const token = response.data.token;
                console.log(token)
                // Store the token in local storage
                localStorage.setItem("token", token);
                console.log("Logged in successfully as Employee");
                // Redirect to dashboard page
                setTimeout(() => {
                    navigate("/employee-dashboard");
                }, 1000);
            } else {
                console.log("Login failed");
                setError("Login Details Are Wrong!!");
                // Handle login error
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Login Details Are Wrong!!");
            // Handle error
        } finally {
        }
    };

    const handleShowPassword = () => {
        return setShowPass(!showPass);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-screen-xl sm:max-w-screen-lg md:max-w-screen-md lg:max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-md w-full sm:w-full lg:min-w-screen m-8 ">
                <div className="space-y-4 ">

                    <form onSubmit={handleLogin} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                        <h1 className=" text-2xl font-bold sm:text-3xl text-blue-950">
                            Employee Login
                        </h1>
                        <div>
                            <label for="email" className="sr-only">Email</label>

                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full rounded-lg border-1 p-4 pe-12 text-sm"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label for="password" className="sr-only">Password</label>

                            <div className="relative">
                                <input
                                     type={showPassword ? 'text' : 'password'}
                                    className="w-full rounded-lg border-1 p-4 pe-12 text-sm"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-400"
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

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                No account?
                                <Link to={'/employee-signup'} className="underline" href="">Sign up</Link>
                            </p>

                            <button
                                type="submit"
                                className="inline-block rounded-lg bg-blue-950 px-5 py-3 text-sm font-medium text-white shadow-xl "

                            >
                                Login
                            </button>
                        </div>
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
    )
}

export default Employeelogin