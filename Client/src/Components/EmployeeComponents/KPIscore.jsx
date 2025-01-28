import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PropagateLoader from "react-spinners/PropagateLoader";

const KPIscore = () => {

    const [tableData, setTableData] = useState([]);
    let [loading, setLoading] = useState(true);

    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    };

    useEffect(() => {

        const getkpidata = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/employee/my-kpi`, {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                })

                if (response.status === 200) {

                    setTableData(response.data);
                    setLoading(false)

                }


            }
            catch (error) {



            }

        }

        getkpidata();


    }, []);


    const headers = ['Target', 'Actual', 'Weight', 'KPI Score'];

    return (
        <>
            <div>
                <h1 className='text-4xl font-bold'>KPI Score</h1>
                <div className='w-20 h-0.5 bg-blue-900 mb-10'></div>

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
                        <div className="overflow-x-auto" style={{ width: "90vw" }}>
                            <table className="w-full bg-white border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th rowSpan="2" className="border border-gray-500 px-4 py-2">Month</th>
                                        <th rowSpan="2" className="border border-gray-500 px-4 py-2">Year</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">Cost Vs Revenue</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">Successful Drives</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">Accounts</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">Mentorship</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">Process Adherence</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">Leakage</th>
                                        <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-200">No. Of Joinings</th>
                                        <th rowSpan="2" className="border border-gray-900 px-4 py-2 bg-gray-300">Total KPI Score</th>



                                    </tr>
                                    <tr>
                                        {headers.map((header, idx) => (
                                            <th key={`cost-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                        {headers.map((header, idx) => (
                                            <th key={`drive-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                        {headers.map((header, idx) => (
                                            <th key={`accounts-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                        {headers.map((header, idx) => (
                                            <th key={`mentorship-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                        {headers.map((header, idx) => (
                                            <th key={`process-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                        {headers.map((header, idx) => (
                                            <th key={`leakage-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                        {headers.map((header, idx) => (
                                            <th key={`joinings-${idx}`} className="border border-gray-500 bg-blue-100 px-4 py-2">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.kpis?.length > 0 ? (
                                        tableData?.kpis?.map((row, idx) => (
                                            <tr key={idx} className="border-t border-gray-300">
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.month}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.year}</td>

                                                {/* Cost Vs Revenue */}
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.kpiScore}</td>

                                                {/* Successful Drives */}
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.successfulDrives?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.successfulDrives?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.successfulDrives?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.successfulDrives?.kpiScore}</td>

                                                {/* Accounts */}
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.accounts?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.accounts?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.accounts?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.accounts?.kpiScore}</td>

                                                {/* Mentorship */}
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.mentorship?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.mentorship?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.mentorship?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.mentorship?.kpiScore}</td>

                                                {/* Process Adherence */}
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.processAdherence?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.processAdherence?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.processAdherence?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.processAdherence?.kpiScore}</td>

                                                {/* Leakage */}
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.leakage?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.leakage?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.leakage?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.leakage?.kpiScore}</td>


                                                {/* joinings */}

                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.noOfJoining?.target}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.noOfJoining?.actual}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.noOfJoining?.weight}</td>
                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.noOfJoining?.kpiScore}</td>


                                                <td className="border border-gray-500 px-4 py-2">{row?.kpiMonth?.totalKPIScore}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="26" className="border border-gray-300 px-4 py-2 text-center">
                                                No Data Found...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                }
            </div>

        </>
    )
}

export default KPIscore