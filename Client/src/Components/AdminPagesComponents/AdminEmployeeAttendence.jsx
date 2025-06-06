import React, { useEffect, useState } from 'react'
import { useJwt } from 'react-jwt';
import { Link, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import Footer from '../../Pages/HomePage/Footer';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const AdminEmployeeAttendence = () => {
    const { id } = useParams();
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [record, setRecord] = useState([]);
    const [performenceRecord, setPerformenceRecord] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];
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
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status == 200) {
                    setEmployees(response.data.allEmployees)
                }
            } catch (error) {
                console.error("Error fetching associates:", error);
                // Handle error and show appropriate message
            }
        };

        fetchAllEmployee();
    }, []);
    // fetch emp by id 
    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }

                if (selectedEmployee) {

                    const response = await axios.get(
                        `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees/${selectedEmployee._id}`,
                        {
                            headers:
                            {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 201) {

                        setEmployeeDetails(response.data);
                    }
                } else {

                }


            } catch (error) {


            }
        };

        fetchEmployeeDetails();
    }, [selectedEmployee]);





    // fetch leave report 

    // fetch emp by id 
    useEffect(() => {
        const fetchEmployeeAndLeaveReport = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }

                if (selectedEmployee) {

                    const response = await axios.get(
                        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave-report/${selectedEmployee._id}`,
                        {
                            headers:
                            {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {

                        setRecord(response.data);
                    }
                } else {

                }


            } catch (error) {


            }
        };

        fetchEmployeeAndLeaveReport();
    }, [selectedEmployee]);


    // fetch performence report 

    useEffect(() => {
        const fetchEmployeeAndPerformenceReport = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }


                // Fetch leave report

                if (selectedEmployee) {

                    const response = await axios.get(
                        `${import.meta.env.VITE_BASE_URL}/admin-confi/performance-report/${selectedEmployee._id}`,
                        {
                            headers:
                            {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {

                        setPerformenceRecord(response.data);
                    }
                } else {

                }
            }

            catch (error) {

            }
        };

        fetchEmployeeAndPerformenceReport();
    }, [selectedEmployee]);

    return (

        <div>
            <AdminNav />
            <h1 className='my-8 text-3xl text-center text-bold'> Employee Details</h1>
            <div className="px-0 py-8 overflow-x-auto border border-1 sm:px-0 lg:px-16 md:px-8">
                <table className="min-w-full text-sm bg-white divide-y-2 divide-gray-200">
                    <thead className="text-white ltr:text-left rtl:text-right bg-blue-950">
                        <tr>
                            <th className="px-4 py-2 font-medium text-white whitespace-nowrap">UserImage</th>
                            <th className="px-4 py-2 font-medium text-white whitespace-nowrap">Name</th>
                            <th className="px-4 py-2 font-medium text-white whitespace-nowrap">Email</th>
                            <th className="px-4 py-2 font-medium text-white whitespace-nowrap">EditAttendece</th>
                            <th className="px-4 py-2 font-medium text-white whitespace-nowrap">EditPerfomence</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>

                    <tbody className="text-center divide-y divide-gray-200">
                        {employees.map((emp) => {
                            return (
                                <tr>
                                    <td className="object-cover w-4 px-4 py-2 text-gray-700 cursor-pointer whitespace-nowrap"><img onClick={() => handleOpen(emp)} src={emp.profilePic} /></td>
                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{emp.name}</td>
                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{emp.email}</td>
                                    {/* <td  className="px-4 py-2 text-gray-700 whitespace-nowrap"><Link to={'/'} className="p-2 text-white bg-blue-950">EditAttendence</Link></td> */}
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <Link to={`/admin-all-employee/attendence/${emp._id}`}
                                            href="#"
                                            className="inline-block px-4 py-4 text-xs font-medium text-white bg-blue-900 rounded hover:bg-blue-950"
                                        >
                                            EditAttendence
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <Link to={`/admin-all-employee/performence/${emp._id}`}
                                            href="#"
                                            className="inline-block px-4 py-4 text-xs font-medium text-white bg-blue-900 rounded hover:bg-blue-950"
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
                        <svg className="float-right w-8 h-8 text-red-600" onClick={() => setOpen(false)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="15" y1="9" x2="9" y2="15" />  <line x1="9" y1="9" x2="15" y2="15" /></svg>
                        <div className='flex flex-col items-center justify-center text-center'>
                            <img src={selectedEmployee.profilePic} alt={selectedEmployee.name} className='flex justify-center w-24' />
                            <h1>

                                <p>Name: {selectedEmployee.name}</p>
                                <p>Email: {selectedEmployee.email}</p>
                                {/* Add more details as needed */}
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 gap-4 ">
                            <div>
                                <h2 className='mt-2 mb-1 text-2xl font-bold text-center text-blue-950'>Attendence</h2>
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 rtl:text-right bg-gray-50">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">

                                            <tr>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Details
                                                </th>

                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Absent
                                                </th>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Late
                                                </th>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Half Day
                                                </th>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg">
                                                    Adjectment
                                                </th>



                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Month.map((month, index) => (
                                                <tr key={index}>
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                        {month}
                                                    </th>
                                                    {/* Display attendance details for each month */}
                                                    <td className="px-6 py-4">
                                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.absentDays || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.lateDays || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.halfDays || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.adjustedLeaves || '-'}
                                                    </td>
                                                </tr>
                                            ))}




                                        </tbody>

                                    </table>
                                </div>

                            </div>

                            <div>
                                <h2 className='mt-2 mb-1 text-2xl font-bold text-center text-blue-950'>Performence</h2>
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 rtl:text-right bg-gray-50">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">

                                            <tr>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Details
                                                </th>

                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    multiply of 4x
                                                </th>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Monthly Incentive
                                                </th>
                                                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                                                    Kpi Score
                                                </th>



                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Month.map((month, index) => (
                                                <tr key={index}>
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                        {month}
                                                    </th>
                                                    {/* Display attendance details for each month */}
                                                    <td className="px-6 py-4">
                                                        {performenceRecord.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.multipleOf4x || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {performenceRecord.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.monthlyIncentive || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {performenceRecord.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.kpiScore || '-'}
                                                    </td>

                                                </tr>
                                            ))}




                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                        <p>
                            <button className="flex items-center justify-center float-right px-8 py-2 mt-2 text-white border rounded-md bg-blue-950" onClick={() => setOpen(false)}>
                                <span>okk</span>
                            </button>
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </div>

    )
}

export default AdminEmployeeAttendence