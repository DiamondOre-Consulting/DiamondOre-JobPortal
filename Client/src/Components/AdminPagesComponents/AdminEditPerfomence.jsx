import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useJwt } from 'react-jwt';
import { useNavigate, useParams } from 'react-router-dom';

const AdminEditPerfomence = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [multiply, setMultiply] = useState('');
    const [monthlyIncentive, setMonthlyIncentive] = useState('');
    const [formData, setFormData] = useState({});
    const [kpiScore, setKpiScore] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id);

    const months = [
        { name: 'January', shortName: 'Jan' },
        { name: 'February', shortName: 'Feb' },
        { name: 'March', shortName: 'Mar' },
        { name: 'April', shortName: 'Apr' },
        { name: 'May', shortName: 'May' },
        { name: 'June', shortName: 'Jun' },
        { name: 'July', shortName: 'Jul' },
        { name: 'August', shortName: 'Aug' },
        { name: 'September', shortName: 'Sep' },
        { name: 'October', shortName: 'Oct' },
        { name: 'November', shortName: 'Nov' },
        { name: 'December', shortName: 'Dec' }
    ];

    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // No token found, redirect to login page
            navigate("/admin-login");
        } else {
            const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

            if (tokenExpiration && tokenExpiration < Date.now()) {
                // Token expired, remove from local storage and redirect to login page
                localStorage.removeItem("token");
                navigate("/admin-login");
            }
        }

        const fetchEmployee = async () => {
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
                    `http://localhost:5000/api/admin-confi/all-employees/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status == 201) {
                    console.log(response.data);
                    setEmployeeDetails(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchEmployee();
    }, []);

    const handleFormOpen = (monthName) => {
        setIsFormOpen(monthName);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

 
    const handleSubmit = (e, month) => {
        e.preventDefault();
        setIsFormOpen(false);
        console.log(formData);
        // Here you can handle saving the form data to the backend for the specific month
    };
    
    const handleChange = (e, month) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [month]: {
                ...prevData[month],
                [name]: value,
            }
        }));
    };
    

    return (
        <div>
            <h1 className='text-3xl font-bold font-serif text-center my-12'>Employee Perfomence</h1>
            <div class="flex justify-center">
                <div class="max-w-md w-full mx-4">
                    <div class="bg-white shadow-md shadow-gray-400 rounded-lg p-6 flex flex-col items-center justify-center">
                        <img class="w-20 h-24 rounded-full mb-4" src={employeeDetails?.profilePic} alt="Employee Image" />
                        <h2 class="text-xl font-semibold mb-2">{employeeDetails?.name}</h2>
                        <p class="text-gray-700 text-sm">{employeeDetails?.email}</p>
                    </div>
                </div>
            </div>
        
            {isFormOpen && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 px-16 my-4">
                <form onSubmit={(e) => handleSubmit(e, isFormOpen)}>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="multiply" className="block text-sm font-medium text-gray-700">Multiply (Out of 4x)</label>
                            <input type="number" id="multiply" name="multiply" value={formData[isFormOpen]?.multiply || ''} onChange={(e) => handleChange(e, isFormOpen)} className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="monthlyIncentive" className="block text-sm font-medium text-gray-700">Monthly Incentive</label>
                            <input type="number" id="monthlyIncentive" name="monthlyIncentive" value={formData[isFormOpen]?.monthlyIncentive || ''} onChange={(e) => handleChange(e, isFormOpen)} className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="kpiScore" className="block text-sm font-medium text-gray-700">KPI Score</label>
                            <input type="number" id="kpiScore" name="kpiScore" value={formData[isFormOpen]?.kpiScore || ''} onChange={(e) => handleChange(e, isFormOpen)} className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-900 text-white text-center flex align-center justify-center p-2">Save Data for {isFormOpen}</button>
                        <button onClick={handleFormClose} className="bg-red-700 text-white text-center flex align-center justify-center p-2 ml-4">Cancel</button>
                    </div>
                </form>
            </div>
        )}

        {/* Table */}
        <div class="overflow-x-auto rounded-lg border border-gray-200 px-8 my-4 ">
            <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead class="ltr:text-left rtl:text-right bg-blue-950">
                    <tr>
                        <th class="whitespace-nowrap px-2 py-2 font-medium text-white border ">Perfomance</th>
                        {months.map((month, index) => (
                            <th key={index} onClick={() => handleFormOpen(month.name)} class="whitespace-nowrap px-2 py-2 font-medium text-white border cursor-pointer">{month.shortName}</th>
                        ))}
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                    <tr className='text-center '>
                        <td class="whitespace-nowrap px-4 py-2 font-medium text-white bg-blue-950">Multiply(Out of 4x)</td>
                        {months.map((month, index) => (
                            <td key={index}>{formData[month.name]?.multiply || ''}X</td>
                        ))}
                    </tr>
                    <tr className='text-center '>
                        <td class="whitespace-nowrap px-4 py-2 text-white bg-blue-950">Monthly Incentive</td>
                        {months.map((month, index) => (
                            <td key={index}>{formData[month.name]?.monthlyIncentive || ''}</td>
                        ))}
                    </tr>
                    <tr className='text-center'>
                        <td class="whitespace-nowrap px-4 py-2 text-white bg-blue-950">KPI Score</td>
                        {months.map((month, index) => (
                            <td key={index}>{formData[month.name]?.kpiScore || ''}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )
}

export default AdminEditPerfomence