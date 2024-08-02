import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AllEmployee from './AllEmployee';
import { Link, useNavigate } from 'react-router-dom';
import PropagateLoader from "react-spinners/PropagateLoader";

const AllEmployeeAccounts = () => {
    const [allAccountsData, setAllAccountsData] = useState([]);
    const [showpopup, setShowPopup] = useState(false);
    const [deletepopup, setDeletePopup] = useState(false);
    let [loading, setLoading] = useState(true);;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllAccount = async () => {
            try {
                const response = await axios.get('https://api.diamondore.in/api/employee/accounts');
                if (response.status === 200) {
                    setAllAccountsData(response.data);
                    
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchAllAccount();
    }, []);

    const groupedData = allAccountsData.reduce((acc, account) => {
        const ownerName = account.ownerName;
        if (!acc[ownerName]) {
            acc[ownerName] = [];
        }
        acc[ownerName].push(account);
        return acc;
    }, {});




    // all employee

    const [employees, setEmployees] = useState([]);
    const [accountid, setAccountId] = useState('');

    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    "https://api.diamondore.in/api/admin-confi/all-employees",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    setEmployees(response.data);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Handle error appropriately
            }
        };

        fetchAllEmployee();
    }, []);


    const handleClick = (id) => {
        
        setAccountId(id);
        setShowPopup(true)

    }



    const handledeleteclick = (id) => {
        
        setAccountId(id)
        setDeletePopup(true)
    }



    // Get all request phone no  to get length to show notification
    const [length, setLength] = useState('')

    useEffect(() => {
        const fetchDuplicatePhoneRequest = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    // navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    "https://api.diamondore.in/api/admin-confi/duplicate-phone-requests",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {

                    
                    setLength(response.data.length)

                }
            } catch (error) {
                console.error("Error fetching duplicate phone requests:", error);
            }
        };

        fetchDuplicatePhoneRequest();
    }, []);



    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    };


    return (
        <>
            <div>
                <h1 className='text-3xl text-center'>All Accounts</h1>
                <div className='w-40 h-1 bg-blue-900 mx-auto'></div>

                <Link to={'/admin-dashboard/all-duplicate-phone/request'} className="relative group">
                    <div className='flex justify-end'>
                        <svg className="h-8 w-8 text-gray-600 md:-top-5 -top-8 float-right -mr-6 md:mr-4 hover:text-gray-900 cursor-pointer relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <div className='w-6 h-6 items-center text-center rounded-full text-gray-100 relative -top-5 md:-top-4 md:right-7 -right-3 bg-red-500'>{length}</div>
                    </div>
                    <div className="absolute z-10  right-0 hidden group-hover:inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 tooltip ">
                        Duplicate Account Phone Request
                        <div className="tooltip-arrow"></div>
                    </div>
                </Link>




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
                        <div>
                            {Object.keys(groupedData).map(ownerName => (
                                <div key={ownerName}>
                                    <h2 className='text-2xl text-center mt-8 font-bold'> Account Holder : {ownerName}</h2>

                                    <div className='md:w-full w-80 overflow-x-auto'>
                                        <table id="example" className="table-auto w-full  mt-4">
                                            <thead className='sticky top-0 bg-blue-900 text-gray-100 text-xs shadow'>
                                                <tr>
                                                    <th className="px-4 py-2">HR Name</th>
                                                    <th className="px-4 py-2">Client Name</th>
                                                    <th className="px-4 py-2">Phone</th>
                                                    <th className="px-4 py-2">Zone</th>
                                                    <th className='px-4 py-2'> Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupedData[ownerName].flatMap(account =>
                                                    account.accountDetails.map((detail, index) => (
                                                        <tr key={`${account._id}-${index}`} className='text-center'>
                                                            <td className="border px-4 py-2">{detail.detail.hrName}</td>
                                                            <td className="border px-4 py-2">{detail.detail.clientName}</td>
                                                            <td className="border px-4 py-2">{detail.detail.phone}</td>
                                                            <td className="border px-4 py-2">{detail.detail.zone}</td>
                                                            <td className='borrder px-4 py-2 text-xs cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(detail._id)}>Edit </span> / <span onClick={() => handledeleteclick(detail._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {allAccountsData.length === 0 && (
                                <div className="text-center mt-10">
                                    No data available .
                                </div>
                            )}

                        </div>
                }
            </div>


            {showpopup && (
                <div className="fixed inset-0 flex items-center bg-gray-900 bg-opacity-60 justify-center z-50">
                    <div className="bg-white shadow-md rounded-md p-6 w-3/4 max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Change Account Owner</h2>
                        <form>


                            <div className="mb-4">
                                <select
                                    className="w-full py-2 px-2"
                                // value={formData.EmpOfMonth}
                                // onChange={(e) => handleInputChange("EmpOfMonth", e.target.value)}
                                >
                                    <option value="">Change Owner</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2">Close</button>
                                <button type="submit" className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}




            {deletepopup && (
                <div id="modelConfirm" className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
                    <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
                        <div className="flex justify-end p-2">
                            <button onClick={() => setDeletePopup(false)}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 pt-0 text-center">
                            <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to delete this Account?</h3>
                            <a href="#"
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </a>
                            <a href="#" onClick={() => setDeletePopup(false)}
                                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                                data-modal-toggle="delete-user-modal">
                                No, cancel
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AllEmployeeAccounts