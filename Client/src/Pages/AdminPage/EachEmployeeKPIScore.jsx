import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropagateLoader from "react-spinners/PropagateLoader";
import { z } from 'zod';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const kpiScoreSchema = z.object({
    owner: z.string(),
    month: z.string().optional(),
    year: z.coerce.number().optional(),
    costVsRevenue: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional(),
    successfulDrives: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional(),
    accounts: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional().optional(),
    mentorship: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional(),
    processAdherence: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional(),
    leakage: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional(),
    noOfJoining: z.object({
        target: z.coerce.number().optional(),
        actual: z.coerce.number().optional()
    }).optional()
});

const EachEmployeeKPIScore = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showSubmitLoader, setShowSubmitLoader] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [popupform, setPopUpForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentKpiId, setCurrentKpiId] = useState(null);
    const [kpiDesignation, setKpiDesignation] = useState(null);
    const [tableData, setTableData] = useState([]);

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

    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    // Fetch KPI data
    useEffect(() => {
        const getKpiData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/employee-kpi-score/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    setKpiDesignation(response.data.owner.kpiDesignation);
                    setTableData(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getKpiData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [category, field] = name.split('.');

        if (field) {
            setFormData(prev => ({
                ...prev,
                [category]: { ...prev[category], [field]: value },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitKpiScore = async (e) => {
        e.preventDefault();
        
        if (!formData.month || !formData.year) {
            alert("Month and Year are required fields.");
            return;
        }

        const result = kpiScoreSchema.safeParse(formData);
        if (!result.success) {
            result.error.errors.forEach(err => {
                alert(`Field: ${err.path.join(' -> ')} - Error: ${err.message}`);
            });
            return;
        }

        setShowSubmitLoader(true);
        try {
            const url = isEditing 
                ? `${import.meta.env.VITE_BASE_URL}/admin-confi/edit-kpi-score/${currentKpiId}`
                : `${import.meta.env.VITE_BASE_URL}/admin-confi/set-kpi-score`;

            const method = isEditing ? 'put' : 'post';
            await axios[method](url, result.data,{
                headers : {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSnackbarMessage(`KPI Score ${isEditing ? 'updated' : 'added'} successfully!`);
            setSnackbarOpen(true);
            resetForm();
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setShowSubmitLoader(false);
        }
    };

    const handleEdit = (kpiId) => {
        const kpiToEdit = tableData.kpis.find(k => k._id === kpiId)?.kpiMonth;
        if (!kpiToEdit) return;

        setFormData({
            owner: id,
            month: kpiToEdit.month,
            year: kpiToEdit.year.toString(),
            costVsRevenue: kpiToEdit.costVsRevenue || { target: '', actual: '' },
            successfulDrives: kpiToEdit.successfulDrives || { target: '', actual: '' },
            accounts: kpiToEdit.accounts || { target: '', actual: '' },
            mentorship: kpiToEdit.mentorship || { target: '', actual: '' },
            processAdherence: kpiToEdit.processAdherence || { target: '', actual: '' },
            leakage: kpiToEdit.leakage || { target: '', actual: '' },
            noOfJoining: kpiToEdit.noOfJoining || { target: '', actual: '' },
        });

        setCurrentKpiId(kpiId);
        setIsEditing(true);
        setPopUpForm(true);
    };

    const handleDelete = async (kpiId) => {
        if (!window.confirm("Are you sure you want to delete this KPI record?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/admin-confi/delete-kpi-month/${kpiId}/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSnackbarMessage("KPI Score deleted successfully!");
            setSnackbarOpen(true);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const resetForm = () => {
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
        setCurrentKpiId(null);
        setIsEditing(false);
        setPopUpForm(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const renderKpiValue = (value) => {
        if (value === undefined || value === null) return "N/A";
        if (typeof value === 'object') {
            return value.actual !== undefined ? value.actual : "N/A";
        }
        return value;
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-8">
                <div className="text-center md:text-left mb-3 sm:mb-0">
                    <h1 className="font-bold text-xl sm:text-2xl md:text-4xl">KPI Score</h1>
                    <div className="w-16 sm:w-20 h-1 bg-blue-900 mx-auto md:mx-0"></div>
                </div>
                <button 
                    onClick={() => setPopUpForm(true)}
                    className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm md:text-base"
                >
                    Add KPI Score
                </button>
            </div>

            {/* KPI Form Modal */}
            {popupform && (
                <div className="fixed inset-0 top-16 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg h-[85vh] shadow-xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
                            <h2 className="text-lg sm:text-xl font-bold">
                                {isEditing ? 'Edit' : 'Add'} KPI Score
                            </h2>
                            <button 
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="bg-blue-900 w-16 sm:w-20 h-1 mb-4 sm:mb-6"></div>

                        <form onSubmit={handleSubmitKpiScore} className="p-2 sm:p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Month
                                    </label>
                                    <select
                                        name="month"
                                        className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
                                        value={formData.month}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Month</option>
                                        {['January', 'February', 'March', 'April', 'May', 'June', 
                                          'July', 'August', 'September', 'October', 'November', 'December']
                                          .map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Year
                                    </label>
                                    <select
                                        name="year"
                                        className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value={formData.year==""?"":formData.year}>{formData.year==""?"Selected Year":formData.year}</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)
                                            .filter(y => y.toString() !== formData.year)
                                            .map(y => (
                                            <option key={y} value={y.toString()}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {[
                                { label: 'Cost Vs Revenue', name: 'costVsRevenue' },
                                { label: 'Successful Drives', name: 'successfulDrives' },
                                ...(kpiDesignation === "Recruiter/KAM/Mentor" || kpiDesignation === "Sr. Consultant" ? 
                                    [{ label: 'Accounts', name: 'accounts' }] : []),
                                ...(kpiDesignation === "Recruiter/KAM/Mentor" ? 
                                    [{ label: 'Mentorship', name: 'mentorship' }] : []),
                                { label: 'Process Adherence', name: 'processAdherence' },
                                { label: 'Leakage', name: 'leakage' },
                            ].map((item) => (
                                <div key={item.name} className="mb-3 sm:mb-4">
                                    <h3 className="text-sm sm:text-lg font-medium mb-1 sm:mb-2">{item.label}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm text-gray-600 mb-1">Target</label>
                                            <input
                                                type="number"
                                                name={`${item.name}.target`}
                                                placeholder="Enter Target"
                                                value={formData[item.name].target}
                                                onChange={handleChange}
                                                className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm text-gray-600 mb-1">Actual</label>
                                            <input
                                                type="number"
                                                name={`${item.name}.actual`}
                                                placeholder="Enter Actual"
                                                value={formData[item.name].actual}
                                                onChange={handleChange}
                                                className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded shadow mt-3 sm:mt-4 flex justify-center items-center text-sm sm:text-base"
                                disabled={showSubmitLoader}
                            >
                                {showSubmitLoader ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {showSubmitLoader ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <PropagateLoader color="#023E8A" loading={loading} size={15} />
                </div>
            ) : (
                /* Table Display */
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Month/Year
                                    </th>
                                    <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metric
                                    </th>
                                    <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Target
                                    </th>
                                    <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actual
                                    </th>
                                    <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData?.kpis?.length > 0 ? (
                                    tableData.kpis.map((row, idx) => (
                                        <Fragment key={idx}>
                                            <tr className="bg-gray-100">
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                                                    {row?.kpiMonth?.month} {row?.kpiMonth?.year}
                                                </td>
                                                <td colSpan="4" className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                                                    KPI Metrics
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium">
                                                    <div className="flex space-x-1 sm:space-x-2">
                                                        <IconButton 
                                                            color="primary" 
                                                            onClick={() => handleEdit(row._id)}
                                                            size="small"
                                                            className="p-1"
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            color="error" 
                                                            onClick={() => handleDelete(row._id)}
                                                            size="small"
                                                            className="p-1"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {/* Cost Vs Revenue */}
                                            <tr key={`${idx}-cost`}>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Cost Vs Revenue</td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.costVsRevenue?.target)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.costVsRevenue?.actual)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {row?.kpiMonth?.costVsRevenue?.kpiScore?.toFixed(2) || "N/A"}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                            </tr>
                                            
                                            {/* Successful Drives */}
                                            <tr key={`${idx}-drives`}>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Successful Drives</td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.successfulDrives?.target)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.successfulDrives?.actual)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {row?.kpiMonth?.successfulDrives?.kpiScore?.toFixed(2) || "N/A"}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                            </tr>
                                            
                                            {/* Accounts - conditionally rendered */}
                                            {(kpiDesignation === "Recruiter/KAM/Mentor" || kpiDesignation === "Sr. Consultant") && (
                                                <tr key={`${idx}-accounts`}>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Accounts</td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                        {renderKpiValue(row?.kpiMonth?.accounts?.target)}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                        {renderKpiValue(row?.kpiMonth?.accounts?.actual)}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                        {row?.kpiMonth?.accounts?.kpiScore?.toFixed(2) || "N/A"}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                </tr>
                                            )}
                                            
                                            {/* Mentorship - conditionally rendered */}
                                            {kpiDesignation === "Recruiter/KAM/Mentor" && (
                                                <tr key={`${idx}-mentorship`}>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Mentorship</td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                        {renderKpiValue(row?.kpiMonth?.mentorship?.target)}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                        {renderKpiValue(row?.kpiMonth?.mentorship?.actual)}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                        {row?.kpiMonth?.mentorship?.kpiScore?.toFixed(2) || "N/A"}
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                </tr>
                                            )}
                                            
                                            {/* Process Adherence */}
                                            <tr key={`${idx}-process`}>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Process Adherence</td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.processAdherence?.target)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.processAdherence?.actual)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {row?.kpiMonth?.processAdherence?.kpiScore?.toFixed(2) || "N/A"}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                            </tr>
                                            
                                            {/* Leakage */}
                                            <tr key={`${idx}-leakage`}>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Leakage</td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.leakage?.target)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {renderKpiValue(row?.kpiMonth?.leakage?.actual)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                    {row?.kpiMonth?.leakage?.kpiScore?.toFixed(2) || "N/A"}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                            </tr>
                                            
                                            {/* Total */}
                                            <tr key={`${idx}-total`} className="bg-blue-50">
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium"></td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">Total KPI Score</td>
                                                <td colSpan="3" className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                                                    {row?.kpiMonth?.totalKPIScore?.toFixed(2) || "N/A"}
                                                </td>
                                                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap"></td>
                                            </tr>
                                        </Fragment>
                                    ))
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
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EachEmployeeKPIScore;