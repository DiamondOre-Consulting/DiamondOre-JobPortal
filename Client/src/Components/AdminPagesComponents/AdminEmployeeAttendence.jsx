import React, { useEffect, useState } from 'react'
import { useJwt } from 'react-jwt';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import Footer from '../../Pages/HomePage/Footer';
import axios from 'axios';


const AdminEmployeeAttendence = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const Month = ["details", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const handleOpen = (employee) => {
        setSelectedEmployee(employee);
        setOpen(true);
    };

    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);

    const { decodedToken } = useJwt(localStorage.getItem("token"));
    useEffect(() => {
        const fetchAllEmployee = async () => {
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
                    "https://diamond-ore-job-portal-backend.vercel.app/api/admin-confi/all-employees",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status == 200) {
                    console.log(response.data);
                    console.log(response.data.name);
                    setEmployees(response.data)
                }
            } catch (error) {
                console.error("Error fetching associates:", error);
                // Handle error and show appropriate message
            }
        };

        fetchAllEmployee();
    }, []);

    return (

        <div>
            <h1 className='text-bold font-serif text-center text-3xl my-8'> Employee Details</h1>
            <div class="overflow-x-auto px-12 py-8 border border-1">
                <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead class="ltr:text-left rtl:text-right bg-blue-950 text-white">
                        <tr>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-white">UserImage</th>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-white">Name</th>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-white">Email</th>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-white">EditAttendece</th>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-white">EditPerfomence</th>
                            <th class="px-4 py-2"></th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-200 text-center">
                        {employees.map((emp) => {
                            return (
                                <tr>
                                    <td class="whitespace-nowrap px-4 py-2 text-gray-700 object-cover w-4 cursor-pointer"><img onClick={() => handleOpen(emp)} src={emp.profilePic} /></td>
                                    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{emp.name}</td>
                                    <td class="whitespace-nowrap px-4 py-2 text-gray-700">{emp.email}</td>
                                    {/* <td class="whitespace-nowrap px-4 py-2 text-gray-700"><Link to={'/'} className="bg-blue-950 text-white p-2">EditAttendence</Link></td> */}
                                    <td class="whitespace-nowrap px-4 py-2">
                                        <Link to={`/admin-all-employee/attendence/${emp._id}`}
                                            href="#"
                                            class="inline-block rounded bg-blue-900 px-4 py-4 text-xs font-medium text-white hover:bg-blue-950"
                                        >
                                            EditAttendence
                                        </Link>
                                    </td>
                                    <td class="whitespace-nowrap px-4 py-2">
                                        <Link to={`/admin-all-employee/performence/s${emp._id}`}
                                            href="#"
                                            class="inline-block rounded bg-blue-900 px-4 py-4 text-xs font-medium text-white hover:bg-blue-950"
                                        >
                                            EditPerformence
                                        </Link>
                                    </td>
                                </tr>

                            )
                        })}

                    </tbody>
                </table>
                {/* Dialog component */}
                {selectedEmployee && (
                    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg shadow-gray-500 p-6 overflow-scroll h-4/6 ${open ? 'block' : 'hidden'}`}>
                        <svg class="h-8 w-8 text-red-600 float-right" onClick={() => setOpen(false)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="15" y1="9" x2="9" y2="15" />  <line x1="9" y1="9" x2="15" y2="15" /></svg>
                        <div className='flex items-center justify-center text-center flex-col'>
                            <img src={selectedEmployee.profilePic} alt={selectedEmployee.name} className='w-24 flex  justify-center' />
                            <h1>
                                <p>Name: {selectedEmployee.name}</p>
                                <p>Email: {selectedEmployee.email}</p>
                                {/* Add more details as needed */}
                            </h1>
                        </div>
                        <div class="grid grid-cols-1 gap-4 ">
                            <div>
                                <h2 className='text-center font-bold font-serif mb-1 text-2xl mt-2 text-blue-950'>Attendence</h2>
                                <div class="relative overflow-x-auto">
                                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">

                                            <tr>
                                                {Month.map((month, index) => (
                                                    <th key={index} scope="col" className="px-6 py-3 rounded-s-lg mr-4">
                                                        {month}
                                                    </th>
                                                ))}


                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Absent
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Late
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    HalfDay
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Adjctment
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr class="font-semibold text-gray-900 dark:text-white">
                                                <th scope="row" class="px-6 py-3 text-base">Total</th>
                                                <td class="px-6 py-3">3</td>
                                                <td class="px-6 py-3">21,000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                            </div>

                            <div>
                                <h2 className='text-center font-bold font-serif mb-1 mb-1 text-2xl mt-2 text-blue-950'>Performence</h2>
                                <div class="relative overflow-x-auto">
                                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">

                                            <tr>
                                                {Month.map((month, index) => (
                                                    <th key={index} scope="col" className="px-6 py-3 rounded-s-lg">
                                                        {month}
                                                    </th>
                                                ))}


                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Absent
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Late
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    HalfDay
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                            <tr class="bg-white dark:bg-gray-800">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Adjctment
                                                </th>
                                                <td class="px-6 py-4">
                                                    1
                                                </td>

                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr class="font-semibold text-gray-900 dark:text-white">
                                                <th scope="row" class="px-6 py-3 text-base">Total</th>
                                                <td class="px-6 py-3">3</td>
                                                <td class="px-6 py-3">21,000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <p>
                            <button className="border bg-blue-950 rounded-md py-2 px-8 flex justify-center items-center float-right text-white mt-2" onClick={() => setOpen(false)}>
                                <span>okk</span>
                            </button>
                        </p>
                    </div>
                )}
            </div>

        </div>

    )
}

export default AdminEmployeeAttendence