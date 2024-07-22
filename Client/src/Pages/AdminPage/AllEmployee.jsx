import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../../Components/AdminPagesComponents/AdminNav';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AllEmployee = () => {
    
    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const [employees, setEmployees] = useState([]);
    
    const navigate = useNavigate();

    // Fetch all employees on component mount
    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    "https://api.diamondore.in/api/admin-confi/all-employees",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    setEmployees(response.data);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Handle error appropriately
            }
        };

        fetchAllEmployee();
    }, [navigate]);



    return (
        <>
            {/* <AdminNav /> */}
            <div className='px-4'>
                <div className='mx-auto text-center mb-10 '>
                    <h1 className='text-4xl font-bold'>All Employee</h1>
                    <div className='w-20 h-1 bg-blue-900 mx-auto mt-2'></div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
                    {employees.map((emp) => (
                        <Link to={`/admin-dashboard/goal-sheet/${emp?._id}`}
                            className="bg-white flex justify-between dark:bg-gray-700 relative shadow-xl overflow-hidden hover:shadow-2xl cursor-pointer group rounded-xl p-5 transition-all duration-500 transform"
                            key={emp._id}
                        >
                            <div className='flex'>
                                <div className='w-1 h-full bg-blue-900 rounded-full'></div>
                                <div className="flex ml-4 items-center gap-4">
                                    <div className="w-fit transition-all transform duration-500">
                                        <h1 className="text-gray-900 dark:text-gray-200 font-bold">
                                            {emp.name}
                                        </h1>
                                        <p className="text-gray-400">{emp?.empType}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-200 transform transition-all delay-300 duration-500">
                                            Email: {emp?.email}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-200 transform transition-all delay-300 duration-500">
                                            DOJ: {emp?.doj}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className=' flex flex-col'>
                                <div className="bg-blue-900 w-20 h-20 -mr-14 rounded-full"></div>
                                <div className="bg-blue-900 w-5 h-5 -mr-10 rounded-full z-10"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

           

          
        </>
    );
};

export default AllEmployee;
