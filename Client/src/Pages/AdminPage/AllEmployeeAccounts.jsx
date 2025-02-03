import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AllEmployee from './AllEmployee';
import { Link, useNavigate } from 'react-router-dom';
import PropagateLoader from "react-spinners/PropagateLoader";

const AllEmployeeAccounts = () => {
    const [allAccountsData, setAllAccountsData] = useState([]);
    const [showpopup, setShowPopup] = useState(false);
    const [deletepopup, setDeletePopup] = useState(false);
    let [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllAccount = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/accounts`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log(response)
                if (response.status === 200) {
                    setAllAccountsData(response.data);
                    
                    setLoading(false)
                }
            } catch (error) {

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

    console.log("groupedData", groupedData)




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
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    setEmployees(response.data.allEmployees);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Handle error appropriately
            }
        };

        fetchAllEmployee();
    }, []);


  


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
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/duplicate-phone-requests`,
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


    // edit the joining and the amount  in the acccount handling 

    const [amount , setAmount] = useState('');
    const [joinings , setjoinings] = useState('');
    const [accountDetailsId , setAccountDetailId] = useState();

    const handleClick = (id , accountId) => {

        setAccountId(id);
        setAccountDetailId(accountId)
        console.table([accountid, accountDetailsId])
        setShowPopup(true)

    }


  // Update the handleEditAccounthandling function
const handleEditAccounthandling = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found");
            navigate("/admin-login");
            return;
        }

        if (!accountid) {
            console.error("No account ID selected");
            return;
        }

        const data = {
            joinings,
            amount,
        };

        const response = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/admin-confi/updateAccounts/${accountid}/${accountDetailsId}`,
            data,
            console.log(data),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            alert("Account updated successfully");
            setjoinings("");
            setAmount("");
            setShowPopup(false);
            window.location.reload();
        }
    } catch (error) {
        console.error("Error updating account handling:", error);
        alert("Failed to update account. Please try again.");
    }
};


    return (
        <>
            <div>
                <h1 className='text-3xl text-center'>All Accounts</h1>
                <div className='w-40 h-1 mx-auto bg-blue-900'></div>

                <Link to={'/admin-dashboard/all-duplicate-phone/request'} className="relative group">
                    <div className='flex justify-end'>
                        <svg className="relative float-right w-8 h-8 -mr-6 text-gray-600 cursor-pointer md:-top-5 -top-8 md:mr-4 hover:text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <div className='relative items-center w-6 h-6 text-center text-gray-100 bg-red-500 rounded-full -top-5 md:-top-4 md:right-7 -right-3'>{length}</div>
                    </div>
                    <div className="absolute right-0 z-10 hidden px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 group-hover:inline-block tooltip ">
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
                                    <h2 className='mt-8 text-2xl font-bold text-center'> Account Holder : {ownerName}</h2>

                                    <div className='overflow-x-auto md:w-full w-80'>
                                        <table id="example" className="w-full mt-4 table-auto">
                                            <thead className='sticky top-0 text-xs text-gray-100 bg-blue-900 shadow'>
                                                <tr>
                                                    <th className="px-4 py-2">HR Name</th>
                                                    <th className="px-4 py-2">Client Name</th>
                                                    <th className="px-4 py-2">Phone</th>
                                                    <th className="px-4 py-2">Zone</th>
                                                    <th className="px-4 py-2">Joinings</th>
                                                    <th className='px-4 py-2'> Amount</th>
                                                    <th className='px-4 py-2'> Action</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupedData[ownerName].flatMap(account =>
                                                    account.accountDetails.map((detail, index) => (
                                                        <tr key={`${account._id}-${index}`} className='text-center'>
                                                            <td className="px-4 py-2 border">{detail?.channels[0]?.hrDetails[0]?.hrName}</td>
                                                            <td className="px-4 py-2 border">{detail?.clientName}</td>
                                                            <td className="px-4 py-2 border">{detail?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                                            <td className="px-4 py-2 border">{detail?.zoneName}</td>
                                                            <td className="px-4 py-2 border">{detail?.joinings}</td>
                                                            <td className="px-4 py-2 border">{detail?.amount}</td>
                                                            <td className='px-4 py-2 text-xs cursor-pointer borrder'> <span className='text-red-400 hover:underline' onClick={() => handleClick( account._id,detail._id  )}>Edit </span> / <span onClick={() => handledeleteclick(detail._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {allAccountsData.length === 0 && (
                                <div className="mt-10 text-center">
                                    No data available .
                                </div>
                            )}

                        </div>
                }
            </div>

            {showpopup && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
        <div className="w-3/4 max-w-md p-6 bg-white rounded-md shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Edit Account Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Joinings
                    </label>
                    <input
                        type="text"
                        value={joinings}
                        onChange={(e) => setjoinings(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowPopup(false)}
                        className="px-4 py-2 mr-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleEditAccounthandling}
                        className="px-4 py-2 text-white bg-orange-400 rounded-md hover:bg-orange-500"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

            {/* {showpopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
                    <div className="w-3/4 max-w-md p-6 bg-white rounded-md shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">Change Account Owner</h2>
                        <form>


                            <div className="mb-4">
                                <select
                                    className="w-full px-2 py-2"
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
                                <button type="button" onClick={() => setShowPopup(false)} className="px-4 py-2 mr-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">Close</button>
                                <button type="submit" className="px-4 py-2 text-white bg-orange-400 rounded-md hover:bg-orange-500">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}




            {deletepopup && (
                <div id="modelConfirm" className="fixed inset-0 z-50 w-full h-full px-4 overflow-y-auto bg-gray-900 bg-opacity-60">
                    <div className="relative max-w-md mx-auto bg-white rounded-md shadow-xl top-40">
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
                            <svg className="w-20 h-20 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="mt-5 mb-6 text-xl font-normal text-gray-500">Are you sure you want to delete this Account?</h3>
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