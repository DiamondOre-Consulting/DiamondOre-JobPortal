import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropagateLoader from "react-spinners/PropagateLoader";
import {z} from 'zod';

const kpiScoreSchema = z.object({
    owner: z.string(),
    month: z.string(),
    year: z.coerce.number(),
    successfulDrives: z.object({
        target: z.coerce.number(),
        actual: z.coerce.number()
    }),
    accounts: z.object({
        target: z.coerce.number(),
        actual: z.coerce.number()
    }),
    mentorship: z.object({
        target: z.coerce.number(),
        actual: z.coerce.number()
    }),
    processAdherence: z.object({
        target: z.coerce.number(),
        actual: z.coerce.number()
    }),
    leakage: z.object({
        target: z.coerce.number(),
        actual: z.coerce.number()
    }),
    noOfJoining: z.object({
        target: z.coerce.number(),
        actual: z.coerce.number()
    })
});

const KpiData = () => {
    const { empId } = useParams();
    const [showSubmitLoader, setShowSubmitLoader] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [popupform, setPopUpForm] = useState(false);
    const [kpiDesignation, setKpiDesignation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentKpiId, setCurrentKpiId] = useState(null);

    const [formData, setFormData] = useState({
        owner: empId,
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
            setFormData(prevData => ({
                ...prevData,
                [category]: { ...prevData[category], [field]: value },
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmitKpiScore = async (e) => {
        e.preventDefault();

        if (!formData.month) {
            alert("Month is required.");
            return;
        }

        if (!formData.year) {
            alert("Year is required.");
            return;
        }

        const validation = kpiScoreSchema.safeParse(formData);
        
        if (!validation.success) {
            validation.error.errors.forEach(err => {
                alert(`Field: ${err.path.join(' -> ')} - Error: ${err.message}`);
            });
            return;
        }

        setShowSubmitLoader(true);
        try {
            let response;
            if (isEditing) {
                response = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/edit-kpi-score/${currentKpiId}`, 
                    validation.data,{
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setSnackbarMessage("KPI Score updated successfully!");
            } else {
                response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/set-kpi-score`, 
                    validation.data,{
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setSnackbarMessage("KPI Score added successfully!");
            }
            
            setPopUpForm(false);
            setSnackbarOpen(true);
            resetForm();
            fetchKpiData(); // Refresh data after submission
        } catch (error) {
            console.error("Error submitting KPI score:", error);
            alert(`Failed to ${isEditing ? 'update' : 'submit'} KPI score. Please try again.`);
        } finally {
            setShowSubmitLoader(false);
        }
    };

    const resetForm = () => {
        setFormData({
            owner: empId,
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
        setIsEditing(false);
        setCurrentKpiId(null);
    };

    const handleEdit = (kpi) => {
        setFormData({
            owner: empId,
            month: kpi.kpiMonth.month,
            year: kpi.kpiMonth.year,
            successfulDrives: { 
                target: kpi.kpiMonth.successfulDrives?.target || '', 
                actual: kpi.kpiMonth.successfulDrives?.actual || '' 
            },
            accounts: { 
                target: kpi.kpiMonth.accounts?.target || '', 
                actual: kpi.kpiMonth.accounts?.actual || '' 
            },
            mentorship: { 
                target: kpi.kpiMonth.mentorship?.target || '', 
                actual: kpi.kpiMonth.mentorship?.actual || '' 
            },
            processAdherence: { 
                target: kpi.kpiMonth.processAdherence?.target || '', 
                actual: kpi.kpiMonth.processAdherence?.actual || '' 
            },
            leakage: { 
                target: kpi.kpiMonth.leakage?.target || '', 
                actual: kpi.kpiMonth.leakage?.actual || '' 
            },
            noOfJoining: { 
                target: kpi.kpiMonth.noOfJoining?.target || '', 
                actual: kpi.kpiMonth.noOfJoining?.actual || '' 
            },
        });
        setIsEditing(true);
        setCurrentKpiId(kpi._id);
        setPopUpForm(true);
    };

    const handleDelete = async (kpiId) => {
        if (window.confirm("Are you sure you want to delete this KPI record?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/delete-kpi-month/${kpiId}/${empId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSnackbarMessage("KPI Score deleted successfully!");
                setSnackbarOpen(true);
                fetchKpiData(); // Refresh data after deletion
            } catch (error) {
                console.error("Error deleting KPI score:", error);
                alert("Failed to delete KPI score. Please try again.");
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const [tableData, setTableData] = useState([]);

    const fetchKpiData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/admin-confi/employee-kpi-score/${empId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                console.log(response.data)
                setKpiDesignation(response.data.owner?.kpiDesignation);
                setTableData(response.data);
            }
        } catch (error) {
            console.error("Error fetching KPI data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKpiData();
    }, [empId]);

    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const renderKpiRow = (label, value) => {
        if (value === undefined || value === null) return "N/A";
        if (typeof value === 'object') {
            return value.actual !== undefined ? value.actual : "N/A";
        }
        return value;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="font-bold text-2xl md:text-4xl">KPI Score</h1>
                    <div className='w-20 h-1 bg-blue-900 mx-auto md:mx-0'></div>
                </div>
                <button 
                    onClick={() => {
                        resetForm();
                        setPopUpForm(true);
                    }}
                    className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm md:text-base"
                >
                    Add KPI Score
                </button>
            </div>

            {/* Popup Form */}
            {popupform && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} KPI Score</h2>
                            <button 
                                onClick={() => {
                                    setPopUpForm(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitKpiScore} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                    <select
                                        name="month"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                        value={formData.month}
                                        onChange={handleChange}
                                        required
                                    >
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select
                                        name="year"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Year</option>
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

                            {[
                             
                                { label: 'Successful Drives', name: 'successfulDrives' },
                                ...(kpiDesignation === "Recruiter/KAM/Mentor" || kpiDesignation === "Sr. Consultant" ? 
                                    [{ label: 'Accounts', name: 'accounts' }] : []),
                                ...(kpiDesignation === "Recruiter/KAM/Mentor" ? 
                                    [{ label: 'Mentorship', name: 'mentorship' }] : []),
                                { label: 'Process Adherence', name: 'processAdherence' },
                                { label: 'Leakage', name: 'leakage' },
                            ].map((item) => (
                                <div key={item.name} className="mb-4">
                                    <h3 className="text-lg font-medium mb-2">{item.label}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Target</label>
                                            <input
                                                type="number"
                                                name={`${item.name}.target`}
                                                placeholder="Enter Target"
                                                value={formData[item.name].target}
                                                onChange={handleChange}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Actual</label>
                                            <input
                                                type="number"
                                                name={`${item.name}.actual`}
                                                placeholder="Enter Actual"
                                                value={formData[item.name].actual}
                                                onChange={handleChange}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex justify-center items-center"
                                    disabled={showSubmitLoader}
                                >
                                    {showSubmitLoader ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    {showSubmitLoader ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <PropagateLoader
                        color={'#023E8A'}
                        loading={loading}
                        size={20}
                        aria-label="Loading Spinner"
                    />
                </div>
            ) : (
                /* Table Display */
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Month/Year
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metric
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Target
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actual
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
    {tableData?.kpis?.length > 0 ? (
        tableData.kpis.map((row, idx) => {
            // Extract the month/year and metrics data
            const monthYear = `${row?.kpiMonth?.month || ''} ${row?.kpiMonth?.year || ''}`;
            const metrics = row?.kpiMonth || {};

            return (
                <React.Fragment key={`${idx}-fragment`}>
                    <tr className="bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {monthYear}
                        </td>
                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap font-medium">
                            KPI Metrics
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleEdit(row)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(row._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    
                    {/* Cost Vs Revenue - Blurred */}
                    {metrics.costVsRevenue && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                            <td className="px-6 py-4 whitespace-nowrap">TargetVsRevenue</td>
                            <td className="px-6 py-4 whitespace-nowrap blur-sm">
                                {metrics.costVsRevenue.target || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap blur-sm">
                                {metrics.costVsRevenue.actual || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap blur-sm">
                                {metrics.costVsRevenue.kpiScore || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                    )}
                    
                    {/* Successful Drives */}
                    {metrics.successfulDrives && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                            <td className="px-6 py-4 whitespace-nowrap">Successful Drives</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.successfulDrives.target || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.successfulDrives.actual || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.successfulDrives.kpiScore || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                    )}
                    
                    {/* Accounts - conditionally rendered */}
                    {(kpiDesignation === "Recruiter/KAM/Mentor" || kpiDesignation === "Sr. Consultant") && metrics.accounts && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                            <td className="px-6 py-4 whitespace-nowrap">Accounts</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.accounts.target || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.accounts.actual || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.accounts.kpiScore || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                    )}
                    
                    {/* Mentorship - conditionally rendered */}
                    {kpiDesignation === "Recruiter/KAM/Mentor" && metrics.mentorship && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                            <td className="px-6 py-4 whitespace-nowrap">Mentorship</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.mentorship.target || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.mentorship.actual || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.mentorship.kpiScore || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                    )}
                    
                    {/* Process Adherence */}
                    {metrics.processAdherence && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                            <td className="px-6 py-4 whitespace-nowrap">Process Adherence</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.processAdherence.target || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.processAdherence.actual || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.processAdherence.kpiScore || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                    )}
                    
                    {/* Leakage */}
                    {metrics.leakage && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                            <td className="px-6 py-4 whitespace-nowrap">Leakage</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.leakage.target || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.leakage.actual || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {metrics.leakage.kpiScore || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                    )}
                    
                    {/* Total */}
                    <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium"></td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">Total KPI Score</td>
                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap font-medium">
                            {metrics.totalKPIScore || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                    </tr>
                </React.Fragment>
            );
        })
    ) : (
        <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No KPI data found
            </td>
        </tr>
    )}
</tbody>
                        </table>
                    </div>
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default KpiData;