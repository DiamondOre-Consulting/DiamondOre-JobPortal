import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from './AdminNav';
import Footer from '../../Pages/HomePage/Footer';

const AdminEditPerfomence = () => {
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [record, setRecord] = useState([]);
    const navigate = useNavigate();
    const [totalLeaves, setTotalLeaves] = useState(null);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        month: '',
        year: new Date().getFullYear().toString(),
        absentDays: '',
        lateDays: '',
        halfDays: '',
        adjustedLeaves: ''
    });

    const { decodedToken } = useJwt(localStorage.getItem("token"));
    // 


    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }
               
                const response = await axios.get(
                    `https://api.diamondore.in/api/admin-confi/all-employees/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 201) {
                    
                    setEmployeeDetails(response.data);
                }
            } catch (error) {
                
            }
        };

        fetchEmployeeDetails();
    }, [id]);

    useEffect(() => {
        const fetchEmployeeAndPerformenceReport = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }


                // Fetch leave report

                const leaveReportResponse = await axios.get(
                    `https://api.diamondore.in/api/admin-confi/performance-report/${id}`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                    }
                );
                if (leaveReportResponse.status === 200) {
                    
                    setRecord(leaveReportResponse.data);
                    // const rec = leaveReportResponse.data;
                    // if (rec.length > 0) {
                    //     const lastRecord = rec[rec.length - 1];
                    //     const leaves = lastRecord.totalLeaves;
                    //     setTotalLeaves(leaves);
                    //     
                    // } else {
                    //     
                    // }
                }
            }
            catch (error) {
                
            }
        };

        fetchEmployeeAndPerformenceReport();
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
            const { month , year, multipleOf4x, monthlyIncentive, kpiScore } = formData;

            // Save form data
            const response = await axios.post(
                `https://api.diamondore.in/api/admin-confi/add-performance-report/${id}`,
                {
                    month,
                    year,
                    multipleOf4x,
                    monthlyIncentive,
                    kpiScore,

                }
            );


            


            // Update record state with new data
            setRecord(prevRecord => [
                ...prevRecord,
                {
                    month: month,
                    multipleOf4x: multipleOf4x,
                    monthlyIncentive: monthlyIncentive,
                    kpiScore: kpiScore
                }
            ]);

            // Clear form data
            setFormData({
                month: '',
                year: '',
                multipleOf4x: "",
                monthlyIncentive: "",
                kpiScore: "",
            });
        }

        catch (error) {
            if (error.response && error.response.status === 409) {
                window.alert("This month's or year's report already exists");
                setFormData({
                    month: '',
                    year: '',
                    multipleOf4x:'',
                    monthlyIncentive:'',
                    kpiScore:'',
                });
            }
            console.error('Error submitting form:', error);
        }
    };


    return (
        <div>
            <AdminNav/>
            <h1 className='text-center text-2xl font-bold my-4'>Add Performence Report</h1>
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
                        <label className="block text-gray-700">multipleOf4x:</label>
                        <input type="text" name="multipleOf4x" value={formData.multipleOf4x} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-gray-700">monthlyIncentive:</label>
                        <input type="text" name="monthlyIncentive" value={formData.monthlyIncentive} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-gray-700">kpiScore:</label>
                        <input type="text" name="kpiScore" value={formData.kpiScore} onChange={handleChange} className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white" />
                    </div>
                </div>
                <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-blue-900 rounded-lg hover:bg-blue-950 focus:outline-none">Submit</button>
            </form>


            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 px-0 sm:px-0 lg:px-8 md:px-6 mt-6 pt-4 my-4 ">
                {/* <p>totalleaves:- {totalLeaves}</p> */}
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right bg-blue-950">
                        <tr>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Month</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">multiply of 4x</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Monthly Incentive</th>
                            <th className="whitespace-nowrap px-2 py-2 font-medium text-white border ">Kpi Score</th>
                         
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {record.map((rec, index) => (
                            <tr key={index} className='text-center '>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.month}</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.multipleOf4x
                                }</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.
                                    monthlyIncentive
                                }</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-black">{rec.kpiScore
                                }</td>
                              
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer/>
        </div>
    )
}

export default AdminEditPerfomence