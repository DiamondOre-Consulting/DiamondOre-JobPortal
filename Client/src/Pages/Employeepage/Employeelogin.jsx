import { React, useState } from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import simg from '../../assets/loginimg.svg';
import {z} from 'zod'


const passcodeSchema = z.object({
    passcode:z.string()
})

const loginSchema = z.object({
    email:z.string().email(),
    password:z.string()
})




const Employeelogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passcode, setPasscode] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!email || !password){
            alert("Please fill all the fields")
            return
        }

        const {success,error} = loginSchema.safeParse({password,email})
           if (!success) {
              error.errors.forEach((err) => {
                alert(err.message);
              });
              return;
          }
        
        setLoading(true);
        setError(null);

        try {

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/employee/login`,
                {
                    email,
                    password
                });
            // 

            if (response.status === 200) {
                const token = response.data.token;

                // Store the token in local storage
                localStorage.setItem("token", token);

                // Redirect to dashboard page
                setTimeout(() => {
                    navigate("/employee-dashboard");
                }, 1000);
            } else {

                setError("Login Details Are Wrong!!");
                setLoading(false)
                // Handle login error
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Login Details Are Wrong!!");
            setLoading(false)
            // Handle error
        } finally {
        }
    };

    const handleLoginWithPasscode = async () => {
     
        if(!passcode){
            alert("Please fill passcode field")
            return
        }

        const {success} = passcodeSchema.safeParse({passcode})
     
        if(!success){
            alert('Please enter a valid passcode')
            return 
        }
        
        if (!passcode) {
            alert("please enter the passcode")
            return
        }

        try {

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/employee/rnr-Leaderborad/${passcode}`)


            navigate(`/employee-rnrboard/${passcode}`)


        }
        catch (err) {

            if (err?.response?.data?.message === "passcode is incorrect") {
                alert("Please enter a correct password");
            }
        }



    }

    const handlesetPasscode = (e) => {
        setPasscode(e.target.value)
    }
     
    





    const handleShowPassword = () => {
        return setShowPass(!showPass);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="grid w-full max-w-screen-xl grid-cols-1 px-4 py-16 m-8 bg-white rounded-md shadow-lg sm:max-w-screen-lg md:max-w-screen-md lg:max-w-screen-xl sm:px-6 lg:px-8 md:grid-cols-2 sm:w-full lg:min-w-screen ">
                <div className="space-y-4 ">

                    <form onSubmit={handleLogin} noValidate className="max-w-md mx-auto mt-8 mb-0 space-y-4">

                        <h1 className="text-2xl font-bold  sm:text-3xl text-blue-950">
                            Employee Login
                        </h1>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>

                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full p-4 text-sm rounded-lg border-1 pe-12"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) =>{
                                        
                                        setEmail(e.target.value)
                                    }}
                                />

                                <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 text-gray-400"
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
                            <label htmlFor="password" className="sr-only">Password</label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full p-4 text-sm rounded-lg border-1 pe-12"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => {
                                        
                                        setPassword(e.target.value)
                                    }}
                                />

                                <span className="absolute inset-y-0 grid px-4 end-0 place-content-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 text-gray-400"
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
                            <label htmlFor="check">Show Password</label>
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

                        <div className="flex items-center">
                            {/* <p className="text-sm text-gray-500">
                                No account?
                                <Link to={'/employee-signup'} className="underline" href="">Sign up</Link>
                            </p> */}

                            <button
                                type="submit"
                                className="inline-block w-full px-5 py-3 text-sm font-medium text-white rounded-lg shadow-xl hover:bg-blue-700 bg-blue-950 "

                            >
                                Login
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="flex items-center justify-center p-4 bg-red-300 rounded-md">
                            <p className="text-sm text-center text-red-500">{error}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-8 rounded-lg">
                    <div className='w-[80%]'>

                        <div className='mb-3 text-3xl font-semibold text-center'>Enter the passcode</div>
                        <input onChange={handlesetPasscode} value={passcode} className='w-full p-4 text-sm rounded-lg border-1 pe-12' placeholder='Passcode' type="text" />

                        <button onClick={handleLoginWithPasscode} className='w-full p-3 mt-6 text-white rounded-md hover:bg-blue-700 bg-blue-950'>Login</button>
                    </div>
                </div>

            </div>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-gray-300 bg-gray-800 opacity-75">
                    <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    {/* <p>Loading</p> */}
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </div>
    )
}

export default Employeelogin