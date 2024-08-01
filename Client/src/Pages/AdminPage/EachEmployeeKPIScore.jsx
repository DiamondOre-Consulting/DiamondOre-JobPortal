import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const EachEmployeeKPIScore = () => {
    const { id } = useParams();
    const [showSubmitLoader, setShowSubmitLoader] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar


    const [formData, setFormData] = useState({
        owner: id,
        month: '',
        year: '',
        costVsRevenue: { target: '', actual: '' },
        successfulDrives: { target: '', actual: '' },
        accounts: { target: '', actual: '' },
        mentorship: { target: '', actual: '' },
        processAdherence: { target: '', actual: '' },
        leakage: { target: '', actual: '' },
        noOfJoining: { target: '', actual: '' },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [category, field] = name.split('.');

        if (field) {
            setFormData((prevData) => ({
                ...prevData,
                [category]: { ...prevData[category], [field]: value },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmitKpiScore = async (e) => {
        e.preventDefault();
        setShowSubmitLoader(true)
        try {
            const response = await axios.post('http://localhost:5000/api/admin-confi/set-kpi-score', formData);
            console.log(response.data);
            setShowSubmitLoader(false);
            setSnackbarOpen(true);
            setFormData({
                owner: id,
                month: '',
                year: '',
                costVsRevenue: { target: '', actual: '' },
                successfulDrives: { target: '', actual: '' },
                accounts: { target: '', actual: '' },
                mentorship: { target: '', actual: '' },
                processAdherence: { target: '', actual: '' },
                leakage: { target: '', actual: '' },
                noOfJoining: { target: '', actual: '' },
            });

        } catch (error) {
            console.log(error);
        }
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };



    // get scores


    const [tableData, setTableData] = useState([]);

    useEffect(() => {

        const getkpidata = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/admin-confi/employee-kpi-score/${id}`, {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                })

                if (response.status === 200) {
                    console.log("kpi data ", response.data)
                    setTableData(response.data);
                }


            }
            catch (error) {

                console.log(error)

            }

        }

        getkpidata();


    }, []);


    const headers = ['Target', 'Actual', 'Weight', 'KPI Score'];

    return (
        <>
            <div>
                <h1 className="font-bold text-center mx-auto text-4xl">KPI Score</h1>
                <div className="flex flex-col">
                    <div className="flex mt-8">
                        <div className="bg-white border border-1 p-8 rounded-md">
                            <form onSubmit={handleSubmitKpiScore}>
                                <div className="-mx-3 flex flex-wrap">
                                    <div className="w-full px-3 sm:w-1/2">
                                        <div className="mb-5">
                                            <label htmlFor="month" className="mb-3 block text-base font-medium text-[#07074D]">
                                                Select Month
                                            </label>
                                            <select
                                                name="month"
                                                className="w-full rounded-md py-2 px-2 ml-2"
                                                value={formData.month}
                                                onChange={handleChange}
                                            >
                                                <option>Select Month</option>
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
                                    </div>
                                    <div className="w-full px-3 sm:w-1/2">
                                        <div className="mb-5">
                                            <label htmlFor="year" className="mb-3 block text-base font-medium text-[#07074D]">
                                                Year
                                            </label>
                                            <select
                                                name="year"
                                                className="w-full rounded-md py-2 px-2"
                                                value={formData.year}
                                                onChange={handleChange}
                                            >
                                                <option>Select Year</option>
                                                <option value="2020">2020</option>
                                                <option value="2021">2021</option>
                                                <option value="2022">2022</option>
                                                <option value="2023">2023</option>
                                                <option value="2024">2024</option>
                                                <option value="2025">2025</option>
                                                <option value="2026">2026</option>
                                                <option value="2027">2027</option>
                                                <option value="2028">2028</option>
                                                <option value="2029">2029</option>
                                                <option value="2030">2030</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {[
                                    { label: 'Cost Vs Revenue', name: 'costVsRevenue' },
                                    { label: 'Successful Drives', name: 'successfulDrives' },
                                    { label: 'Accounts', name: 'accounts' },
                                    { label: 'Mentorship', name: 'mentorship' },
                                    { label: 'Process Adherence', name: 'processAdherence' },
                                    { label: 'Leakage', name: 'leakage' },
                                    { label: 'Number of Joining', name: 'noOfJoining' },
                                ].map((item) => (
                                    <div key={item.name} className="mb-2 pt-3">
                                        <label className="mb-5 block text-base text-gray-700 sm:text-medium">
                                            {item.label}
                                        </label>
                                        <div className="-mx-3 flex flex-wrap">
                                            <div className="w-full px-3 sm:w-1/2">
                                                <div className="mb-5">
                                                    <input
                                                        type="number"
                                                        name={`${item.name}.target`}
                                                        placeholder="Enter Target"
                                                        value={formData[item.name].target}
                                                        onChange={handleChange}
                                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full px-3 sm:w-1/2">
                                                <div className="mb-5">
                                                    <input
                                                        type="number"
                                                        name={`${item.name}.actual`}
                                                        placeholder="Enter Actual"
                                                        value={formData[item.name].actual}
                                                        onChange={handleChange}
                                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none w-full"
                                    >
                                        {showSubmitLoader ? (
                                            <svg
                                                className="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        ) : (
                                            'Submit'
                                        )}
                                    </button>


                                    <Snackbar
                                        open={snackbarOpen}
                                        autoHideDuration={6000}
                                        onClose={handleCloseSnackbar}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    >
                                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                                            KPI Score updated successfully!
                                        </Alert>
                                    </Snackbar>
                                </div>
                            </form>
                        </div>
                    </div>



                    {/* tables */}



                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th rowSpan="2" className="border border-gray-300 px-4 py-2">Month</th>
                                    <th rowSpan="2" className="border border-gray-300 px-4 py-2">Year</th>
                                    <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Cost Vs Revenue</th>
                                    <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Successful Drives</th>
                                    <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Accounts</th>
                                    <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Mentorship</th>
                                    <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Process Adherence</th>
                                    <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Leakage</th>
                                </tr>
                                <tr>
                                    {headers.map((header, idx) => (
                                        <th key={`cost-${idx}`} className="border border-gray-300 px-4 py-2">{header}</th>
                                    ))}
                                    {headers.map((header, idx) => (
                                        <th key={`drive-${idx}`} className="border border-gray-300 px-4 py-2">{header}</th>
                                    ))}
                                    {headers.map((header, idx) => (
                                        <th key={`accounts-${idx}`} className="border border-gray-300 px-4 py-2">{header}</th>
                                    ))}
                                    {headers.map((header, idx) => (
                                        <th key={`mentorship-${idx}`} className="border border-gray-300 px-4 py-2">{header}</th>
                                    ))}
                                    {headers.map((header, idx) => (
                                        <th key={`process-${idx}`} className="border border-gray-300 px-4 py-2">{header}</th>
                                    ))}
                                    {headers.map((header, idx) => (
                                        <th key={`leakage-${idx}`} className="border border-gray-300 px-4 py-2">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ? (
                                    tableData.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2">{row.month}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.year}</td>

                                            {/* Cost Vs Revenue */}
                                            <td className="border border-gray-300 px-4 py-2">{row.cost.target}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.cost.actual}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.cost.weight}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.cost.kpi}</td>

                                            {/* Successful Drives */}
                                            <td className="border border-gray-300 px-4 py-2">{row.drive.target}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.drive.actual}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.drive.weight}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.drive.kpi}</td>

                                            {/* Accounts */}
                                            <td className="border border-gray-300 px-4 py-2">{row.accounts.target}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.accounts.actual}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.accounts.weight}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.accounts.kpi}</td>

                                            {/* Mentorship */}
                                            <td className="border border-gray-300 px-4 py-2">{row.mentorship.target}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.mentorship.actual}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.mentorship.weight}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.mentorship.kpi}</td>

                                            {/* Process Adherence */}
                                            <td className="border border-gray-300 px-4 py-2">{row.process.target}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.process.actual}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.process.weight}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.process.kpi}</td>

                                            {/* Leakage */}
                                            <td className="border border-gray-300 px-4 py-2">{row.leakage.target}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.leakage.actual}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.leakage.weight}</td>
                                            <td className="border border-gray-300 px-4 py-2">{row.leakage.kpi}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="26" className="border border-gray-300 px-4 py-2 text-center">
                                            Loading data...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>






                </div>
            </div>
        </>
    );
};

export default EachEmployeeKPIScore;
