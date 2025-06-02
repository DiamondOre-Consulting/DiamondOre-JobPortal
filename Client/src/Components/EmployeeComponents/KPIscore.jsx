import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PropagateLoader from "react-spinners/PropagateLoader";

const KPIscore = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getkpidata = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/employee/my-kpi`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.status === 200) {
                    setTableData(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getkpidata();
    }, []);

    const kpiCategories = [
        { name: 'Target Vs Revenue', key: 'costVsRevenue' },
        { name: 'Successful Drives', key: 'successfulDrives' },
        ...(tableData?.owner?.kpiDesignation === "Recruiter/KAM/Mentor" || 
           tableData?.owner?.kpiDesignation === "Sr. Consultant" 
            ? [{ name: 'Accounts', key: 'accounts' }] : []),
        ...(tableData?.owner?.kpiDesignation === "Recruiter/KAM/Mentor" 
            ? [{ name: 'Mentorship', key: 'mentorship' }] : []),
        { name: 'Process Adherence', key: 'processAdherence' },
        { name: 'Leakage', key: 'leakage' }
    ];

    const renderValue = (value) => {
        if (value === undefined || value === null) return "N/A";
        if (typeof value === 'object') return value.actual ?? "N/A";
        return value;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">KPI Score</h1>
                <div className="w-20 h-1 bg-blue-900 mt-2"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <PropagateLoader color="#023E8A" loading={loading} size={15} />
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Month/Year
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Metric
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Target
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actual
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Weight
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tableData?.kpis?.length > 0 ? (
                                tableData.kpis.map((row, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="bg-gray-100">
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-sm">
                                                {row?.kpiMonth?.month} {row?.kpiMonth?.year}
                                            </td>
                                            <td colSpan="5" className="px-4 py-3 whitespace-nowrap font-medium text-sm">
                                                KPI Metrics
                                            </td>
                                        </tr>
                                        
                                        {kpiCategories.map((category) => (
                                            <tr key={`${idx}-${category.key}`}>
                                                <td className="px-4 py-2"></td>
                                                <td className="px-4 py-2 text-sm">{category.name}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    {renderValue(row?.kpiMonth?.[category.key]?.target)}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {renderValue(row?.kpiMonth?.[category.key]?.actual)}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {renderValue(row?.kpiMonth?.[category.key]?.weight)}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {row?.kpiMonth?.[category.key]?.kpiScore?.toFixed(2) || "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                        
                                        <tr className="bg-blue-50">
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2 font-medium text-sm">Total KPI Score</td>
                                            <td colSpan="4" className="px-4 py-2 font-medium text-sm">
                                                {row?.kpiMonth?.totalKPIScore?.toFixed(2) || "N/A"}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                        No KPI data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default KPIscore;