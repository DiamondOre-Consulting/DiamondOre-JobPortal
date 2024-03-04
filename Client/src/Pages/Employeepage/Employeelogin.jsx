import { React, useState } from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import simg  from '../../assets/loginimg.svg';


const Employeelogin = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        // Perform login logic here
        try {
            console.log(email, password)
            const response = await axios.post("https://diamond-ore-job-portal-backend.vercel.app/api/employee/login",
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-screen-xl sm:max-w-screen-lg md:max-w-screen-md lg:max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-md w-full sm:w-full lg:min-w-screen m-8 ">
                <div className="space-y-4 ">

                    <form onSubmit={handleLogin} class="mx-auto mb-0 mt-8 max-w-md space-y-4">
                        <h1 className=" text-2xl font-bold sm:text-3xl text-blue-950">
                           Employee Login
                        </h1>
                        <div>
                            <label for="email" class="sr-only">Email</label>

                            <div class="relative">
                                <input
                                    type="email"
                                    class="w-full rounded-lg border-1 p-4 pe-12 text-sm"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <span class="absolute inset-y-0 end-0 grid place-content-center px-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label for="password" class="sr-only">Password</label>

                            <div class="relative">
                                <input
                                    type="password"
                                    class="w-full rounded-lg border-1 p-4 pe-12 text-sm"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span class="absolute inset-y-0 end-0 grid place-content-center px-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <p class="text-sm text-gray-500">
                                No account?
                                <Link to={'/employee-signup'} class="underline" href="">Sign up</Link>
                            </p>

                            <button
                                type="submit"
                                class="inline-block rounded-lg bg-blue-950 px-5 py-3 text-sm font-medium text-white shadow-xl "

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