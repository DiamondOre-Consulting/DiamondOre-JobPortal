import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from './AdminNav';
import Footer from '../../Pages/HomePage/Footer';

const AdminEditAttendence = () => {
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [record, setRecord] = useState([]);
    const navigate = useNavigate();
    const [totalLeavesis, setTotalLeavesis] = useState(0);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        month: '',
        year: new Date().getFullYear().toString(),
        absentDays: '',
        lateDays: '',
        halfDays: '',
        adjustedLeaves: ''
    });

    // Use useJwt directly inside the functional component
    const { decodedToken } = useJwt(localStorage.getItem("token"));


    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    `https://diamondore-jobportal-backend.onrender.com/api/admin-confi/all-employees/${id}`,
                    {
                        headers:
                        {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 201) {
                    console.log('single emp', response.data);
                    setEmployeeDetails(response.data);
                }


            } catch (error) {

                console.log('Error fetching employee details:', error);
            }
        };

        fetchEmployeeDetails();
    }, [id]);


    useEffect(() => {
        const fetchEmployeeAndLeaveReport = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }


                // Fetch leave report

                const leaveReportResponse = await axios.get(
                    `https://diamondore-jobportal-backend.onrender.com/api/admin-confi/leave-report/${id}`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                    }
                );
                if (leaveReportResponse.status === 200) {
                    console.log("leave report response", leaveReportResponse.data);
                    console.log(leaveReportResponse.data);
                    const all = leaveReportResponse.data;
                    const latest = all.slice(-1);
                    console.log(latest);
                    setTotalLeavesis(latest[0]);

                    console.log("latest",totalLeavesis.totalLeaves);
                    setRecord(leaveReportResponse.data);

                }
            }
            catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchEmployeeAndLeaveReport();
    }, [id, navigate,]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // totalLeaves(null);
        try {
            const { month, year, absentDays, lateDays, halfDays, adjustedLeaves } = formData;

            // Save form data
            const response = await axios.post(
                `https://diamondore-jobportal-backend.onrender.com/api/admin-confi/add-leave-report/${id}`,
                {
                    month,
                    year,
                    absentDays,
                    lateDays,
                    halfDays,
                    adjustedLeaves
                }
            );


            console.log('Response:', response.data);


            // Update record state with new data
            setRecord(prevRecord => [
                ...prevRecord,
                {
                    name: month,
                    absent: absentDays,
                    late: lateDays,
                    halfDay: halfDays,
                    adjustment: adjustedLeaves
                }
            ]);

            // Clear form data
            setFormData({
                month: '',
                year: '',
                absentDays: '',
                lateDays: '',
                halfDays: '',
                adjustedLeaves: ''
            });
        }

        catch (error) {
            if (error.response && error.response.status === 409) {
                window.alert("This month's or year's report already exists");
                setFormData({
                    month: '',
                    year: '',
                    absentDays: '',
                    lateDays: '',
                    halfDays: '',
                    adjustedLeaves: ''
                });
            }
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <AdminNav />
            <h1 className='text-center text-2xl font-bold my-4'>Add Leave Report</h1>
            <form onSubmit={handleSubmit} className='w-full max-w-md mx-auto my-8 p-6 bg-gray-50 shadow-lg rounded-lg shadow-lg'>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Month:</label>
                        <select name="month" value={formData.month} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white">
                            <option value="">Select Month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Year:</label>
                        <input type="text" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Absent Days:</label>
                        <input type="text" name="absentDays" value={formData.absentDays} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Late Days:</label>
                        <input type="text" name="lateDays" value={formData.lateDays} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Half Days:</label>
                        <input type="text" name="halfDays" value={formData.halfDays} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Adjusted Leaves:</label>
                        <input type="text" name="adjustedLeaves" value={formData.adjustedLeaves} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                </div>
                <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-blue-900 rounded-lg hover:bg-blue-950 focus:outline-none">Submit</button>
            </form>


            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 px-0 sm:px-0 lg:px-8 md:px-6 mt-6 pt-4">
              <span className='bg-blue-950 shadow-lg text-white  rounded-lg p-2 border-black m-4'>totalleaves:- {totalLeavesis.totalLeaves}</span>
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">
                    <thead className="ltr:text-left rtl:text-right bg-blue-950">
                        <tr>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Month</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Absent</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Late</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Half Day</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Adjustment</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {record.map((rec, index) => (
                            <tr key={index} className='text-center '>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.month}</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.absentDays
                                }</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.
                                    lateDays
                                }</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.halfDays
                                }</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.adjustedLeaves
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    )
}

export default AdminEditAttendence