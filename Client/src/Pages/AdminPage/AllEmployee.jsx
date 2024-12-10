import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../../Components/AdminPagesComponents/AdminNav';
import Snackbar from '@mui/material/Snackbar';
import { MdDelete } from 'react-icons/md'
import PropagateLoader from "react-spinners/PropagateLoader"; import Alert from '@mui/material/Alert';

const AllEmployee = () => {

    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const [employees, setEmployees] = useState([])
    let [loading, setLoading] = useState(true);
    const [deleteActive, setDeleteActive] = useState(false)

    const navigate = useNavigate();
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
                setLoading(false)

            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            // Handle error appropriately
        }
    };
    // Fetch all employees on component mount
    useEffect(() => {


        fetchAllEmployee();
    }, [navigate]);


    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    };

    const deleteClick = async (cancelId) => {
        setDeleteActive(true)
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `https://api.diamondore.in/api/admin-confi/delete/employee/${cancelId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 201) {
            fetchAllEmployee()
        }

        setDeleteActive(false)
    };


    return (
        <>
            {/* <AdminNav /> */}
            <div className='px-4'>
                <div className='mx-auto mb-10 text-center '>
                    <h1 className='text-4xl font-bold'>All Employees</h1>
                    <div className='w-20 h-1 mx-auto mt-2 bg-blue-900'></div>
                </div>


                {
                    loading ?
                        <div style={override}>
                            <PropagateLoader
                                color={'#023E8A'}
                                loading={loading}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div> :
                        <div className='grid grid-cols-1 gap-8 mb-10 md:grid-cols-4'>
                            {employees.map((emp) => (
                                <Link to={`/admin-dashboard/employee/${emp?._id}`}
                                    className="relative flex justify-between p-5 overflow-hidden transition-all duration-500 transform bg-white shadow-xl cursor-pointer hover:shadow-2xl group rounded-xl"
                                    key={emp._id}
                                >
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            if (window.confirm('Are you sure you want to cancel?')) {
                                                deleteClick(emp?._id)
                                            }
                                        }}
                                        className='absolute top-0 left-0 z-10 p-1 text-[1.5rem] text-red-800 bg-red-200 shadow-md rounded-tl-xl'><MdDelete /></div>
                                    <div className='flex'>
                                        <div className='w-1 h-full bg-blue-900 rounded-full'></div>
                                        <div className="flex items-center gap-4 ml-4">
                                            <div className="transition-all duration-500 transform w-fit">
                                                <h1 className="font-bold text-gray-900">
                                                    {emp.name}
                                                </h1>
                                                <p className="text-gray-400">{emp?.empType}</p>
                                                <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                                                    Email: {emp?.email}
                                                </p>
                                                <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                                                    DOJ: {emp?.doj}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col '>
                                        <div className="w-20 h-20 bg-blue-900 rounded-full -mr-14"></div>
                                        <div className="z-10 w-5 h-5 -mr-10 bg-blue-900 rounded-full"></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                }
            </div>




        </>
    );
};

export default AllEmployee;
