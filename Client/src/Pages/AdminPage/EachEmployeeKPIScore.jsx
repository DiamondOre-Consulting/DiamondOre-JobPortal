import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropagateLoader from "react-spinners/PropagateLoader";
import {set, z} from 'zod'

const kpiScoreSchema = z.object({
    owner:z.string(),
    month:z.string(),
    year:z.coerce.number(),
    costVsRevenue:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    }),
    successfulDrives:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    }),
    accounts:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    }),
    mentorship:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    }),
    processAdherence:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    }),
    leakage:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    }),
    noOfJoining:z.object({
        target:z.coerce.number(),
        actual:z.coerce.number()
    })
})

const EachEmployeeKPIScore = () => {
    const { id } = useParams();
    const [showSubmitLoader, setShowSubmitLoader] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
    const [popupform, setPopUpForm] = useState(false);
    const [kpiDesignation,setKpiDesignation]= useState(null)


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

        if(field){
           
            setFormData((prevData) => ({
                ...prevData,
                [category] : { ...prevData[category], [field]: value },
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

        if(!formData.month ){
            alert("Filling month is compulsory.")
            return 
        }

        if(!formData.year){
            alert("Filling year is compulsory.")
            return
        }

        const {success,error, data} = kpiScoreSchema.safeParse(formData)

        if (!success) {
            error.errors.forEach((err) => {
              
              alert(`Field: ${err.path.join(' -> ')} - Error: ${err.message}`);
            });
            return;
          }
          

          
        


        setShowSubmitLoader(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin-confi/set-kpi-score`, data);
            ;
           
            setPopUpForm(false)
            window.location.reload();
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

        }
        finally{
           setShowSubmitLoader(false);
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
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/employee-kpi-score/${id}`, {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                })

                if (response.status === 200) {
                    setKpiDesignation(response.data.owner.kpiDesignation)
                    
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
                <h1 className="font-bold text-center mx-auto text-2xl md:text-4xl">KPI Score</h1>
                <div className='mx-auto w-20 h-1 bg-blue-900 '></div>
                <span className='float-right -mt-6 md:-mt-10 cursor-pointer bg-blue-900 p-2 md:p-4 rounded-md text-xs md:text-normal text-gray-100' onClick={() => setPopUpForm(true)}>Add KPI Score</span>
                <div className="flex flex-col mt-10 mb-6">


                    {
                        popupform && (

                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-gray-50 mb-10 border border-1 p-8 rounded-md overflow-y-auto h-96 md:ml-0 ml-20  md:mx-0  mx-10">
                                    <div className="flex justify-end p-2 -mt-8 -mr-6">
                                        <button onClick={() => setPopUpForm(false)}
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <h1 className='text-2xl font-bold text-center -mt-4'>Add KPI Score</h1>
                                    <div className='bg-blue-900  w-20 h-1 mb-4 mx-auto'></div>

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
                                            ...(kpiDesignation === "Recruiter/KAM/Mentor" || kpiDesignation === "Sr. Consultant" ?  [{ label: 'Accounts', name: 'accounts' }]:[] ),
                                            ...(kpiDesignation === "Recruiter/KAM/Mentor" ?  [{ label: 'Mentorship', name: 'mentorship' }]:[]),
                                            { label: 'Process Adherence', name: 'processAdherence' },
                                            { label: 'Leakage', name: 'leakage' },
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

                        )
                    }




                    {/* tables */}

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
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">Month</th>
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">Year</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Cost Vs Revenue</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Successful Drives</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Accounts</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Mentorship</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Process Adherence</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Leakage</th>
                                            <th colSpan="4" className="border border-gray-900 px-4 py-2 bg-yellow-300">Total</th>
                                        </tr>
                                        <tr>
                                            {headers.map((header, idx) => (
                                                <th key={`cost-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2">{header}</th>
                                            ))}
                                            {headers.map((header, idx) => (
                                                <th key={`drive-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2">{header}</th>
                                            ))}
                                            {headers.map((header, idx) => (
                                                <th key={`accounts-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2">{header}</th>
                                            ))}
                                            {headers.map((header, idx) => (
                                                <th key={`mentorship-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2">{header}</th>
                                            ))}
                                            {headers.map((header, idx) => (
                                                <th key={`process-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2">{header}</th>
                                            ))}
                                            {headers.map((header, idx) => (
                                                <th key={`leakage-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2">{header}</th>
                                            ))}
                                            {/* {headers.map((header, idx) => (
                                                <th key={`-${idx}`} className="border border-gray-300 bg-blue-200 px-4 py-2"></th>
                                            ))} */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData?.kpis?.length > 0 ? (
                                            tableData?.kpis?.map((row, idx) => (
                                                <tr key={idx} className="border-t border-gray-300">
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.month}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.year}</td>

                                                    {/* Cost Vs Revenue */}
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.target}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.actual}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.weight}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.costVsRevenue?.kpiScore}</td>

                                                    {/* Successful Drives */}
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.successfulDrives?.target}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.successfulDrives?.actual}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.successfulDrives?.weight}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.successfulDrives?.kpiScore}</td>

                                                    {/* Accounts */}
                                                    <td className={`border ${(row?.kpiMonth?.accounts?.target<=0||row?.kpiMonth?.accounts?.target>0)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.accounts?.target<=0?0:row?.kpiMonth?.accounts?.target>0?row?.kpiMonth?.accounts?.target:"N/A"}</td>
                                                    <td className={`border ${(row?.kpiMonth?.accounts?.actual<=0||row?.kpiMonth?.accounts?.actual>0)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.accounts?.actual<=0?0:row?.kpiMonth?.accounts?.actual>0?row?.kpiMonth?.accounts?.actual:"N/A"}</td>
                                                    <td className={`border ${(row?.kpiMonth?.accounts?.weight<=0||row?.kpiMonth?.accounts?.weight>0)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.accounts?.weight<=0?0:row?.kpiMonth?.accounts?.weight>0?row?.kpiMonth?.accounts?.weight:"N/A"}</td>
                                                    <td className={`border ${(row?.kpiMonth?.accounts?.kpiScore<=0||row?.kpiMonth?.accounts?.kpiScore>0)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.accounts?.kpiScore<=0?0:row?.kpiMonth?.accounts?.kpiScore>0?row?.kpiMonth?.accounts?.kpiScore:"N/A"}</td>

                                                    {/* Mentorship */}
                                                    <td className={`border ${(row?.kpiMonth?.mentorship?.target<=0||row?.kpiMonth?.mentorship?.target)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.mentorship?.target<=0?0:row?.kpiMonth?.mentorship?.target>0?row?.kpiMonth?.mentorship?.target:"N/A"}</td>
                                                    <td className={`border ${(row?.kpiMonth?.mentorship?.actual<=0||row?.kpiMonth?.mentorship?.actual)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.mentorship?.actual<=0?0:row?.kpiMonth?.mentorship?.actual>0?row?.kpiMonth?.mentorship?.actual:"N/A"}</td>
                                                    <td className={`border ${(row?.kpiMonth?.mentorship?.weight<=0||row?.kpiMonth?.mentorship?.weight)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.mentorship?.weight<=0?0:row?.kpiMonth?.mentorship?.weight>0?row?.kpiMonth?.mentorship?.weight:"N/A"}</td>
                                                    <td className={`border ${(row?.kpiMonth?.mentorship?.kpiScore<=0||row?.kpiMonth?.mentorship?.weight)?"":"text-blue-500"} border-gray-300 px-4 py-2`}>{row?.kpiMonth?.mentorship?.kpiScore<=0?0:row?.kpiMonth?.mentorship?.kpiScore>0?row?.kpiMonth?.mentorship?.kpiScore:"N/A"}</td>

                                                    {/* Process Adherence */}
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.processAdherence?.target}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.processAdherence?.actual}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.processAdherence?.weight}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.processAdherence?.kpiScore}</td>

                                                    {/* Leakage */}
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.leakage?.target}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.leakage?.actual}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.leakage?.weight}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.leakage?.kpiScore}</td>


                                                    {/* joinings */}

                                                    <td className="border border-gray-300 px-4 py-2">{row?.kpiMonth?.totalKPIScore}</td>

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
            </div>
        </>
    );
};

export default EachEmployeeKPIScore;
