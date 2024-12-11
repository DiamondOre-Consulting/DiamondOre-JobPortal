import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeNavbar from './EmployeeNavbar';
import Footer from '../HomePage/Footer';

const EmployeePerformence = () => {
    const Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];
    const [record, setRecord] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const { decodedToken } = useJwt(localStorage.getItem("token"));

    const userId = decodedToken?.userId; // Accessing the ID from decoded token



    useEffect(() => {
        const fetchEmployeePerformenceReport = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/employee-login");
                    return;
                }

                // Fetch leave report

                const Response = await axios.get(
                    `https://api.diamondore.in/api/employee/performance-report`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                    }
                );
                if (Response.status === 200) {

                    setRecord(Response.data);

                }
            }
            catch (error) {

            }
        };

        fetchEmployeePerformenceReport();
    });

    return (
        <>
            <EmployeeNavbar />
            <div className='p-4'>
                <h2 className='text-center font-bold  mb-1 mb-1 text-2xl mt-2 text-blue-950'>Performence</h2>
                <div className="relative overflow-x-auto mt-8">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500  bg-gray-50">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100  ">

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
                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.multipleOf4x || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.monthlyIncentive || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.kpiScore || '-'}
                                    </td>

                                </tr>
                            ))}




                        </tbody>

                    </table>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EmployeePerformence